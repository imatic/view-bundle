<?php

namespace Imatic\Bundle\ViewBundle\Templating\Helper\Resource;

use Imatic\Bundle\ControllerBundle\Resource\Config\Resource;
use Imatic\Bundle\ControllerBundle\Resource\Config\ResourceAction;
use Symfony\Component\Translation\TranslatorInterface;

class ResourceHelper
{
    /**
     * @var TranslatorInterface
     */
    private $translator;

    public function __construct(TranslatorInterface $translator)
    {
        $this->translator = $translator;
    }

    public function createPageActionConfiguration(Resource $resource, $currentActionName, $itemId = null)
    {
        $currentAction = $resource->getAction($currentActionName);
        $filterActions = 'list' === $currentAction->group ? ['list'] : ['list', 'item'];
        $actions = $this->filterActions($resource, $filterActions, $currentActionName);

        $result = array_map(function (ResourceAction $action) use ($resource, $currentAction, $itemId) {
            $configuration = $this->createDefaultConfiguration($action, $resource);
            if ('item' === $currentAction->group && 'list' !== $action->group) {
                $configuration['routeParams'] = ['id' => $itemId];
            }

            return $configuration;
        }, $actions);

        $result = $this->groupNestedConfiguration($result, true);

        return $result;
    }

    public function createRowActionConfiguration(Resource $resource)
    {
        $actions = $this->filterActions($resource, ['item']);

        $result = array_map(function (ResourceAction $action) use ($resource) {
            $configuration = $this->createDefaultConfiguration($action, $resource);
            $configuration['routeParams'] = ['id' => '#id'];

            return $configuration;
        }, $actions);

        $result = $this->groupNestedConfiguration($result);

        return $result;
    }

    private function createDefaultConfiguration(ResourceAction $action, Resource $resource)
    {
        $configuration['label'] = $this->translate(
            ucfirst($action->name), $resource->getConfig()['translation_domain']
        );
        $configuration['route'] = $action['route']['name'];

        if ($action['role']) {
            $configuration['condition'] = sprintf('isGranted("%s")', $action['role']);
        }

        if (isset($action['extra']['button_data'])) {
            $configuration['data'] = $action['extra']['button_data'];
        }

        if (isset($action['extra']['button_parent'])) {
            $configuration['parent'] = $action['extra']['button_parent'];
        }

        return $configuration;
    }

    private function groupNestedConfiguration(array $configuration, $removeParentOnly = false)
    {
        foreach ($configuration as $actionName => &$actionConfig) {
            $parentActionName = empty($actionConfig['parent']) ? null : $actionConfig['parent'];
            unset($actionConfig['parent']);

            if (!$removeParentOnly && null !== $parentActionName && !empty($configuration[$parentActionName])) {

                if (empty($configuration[$parentActionName]['nested'])) {
                    $configuration[$parentActionName]['nested'] = [];
                }

                $configuration[$parentActionName]['nested'][$actionName] = $actionConfig;
                unset($configuration[$actionName]);
            }
        }

        return $configuration;
    }

    private function filterActions(Resource $resource, array $types, $excludeAction = null)
    {
        return array_filter($resource->getActions(), function (ResourceAction $action) use ($types, $excludeAction) {
            return in_array($action['group'], $types, true) && (null === $excludeAction || $excludeAction !== $action['name']);
        });
    }

    private function translate($id, $domain)
    {
        $translated = $this->translator->trans($id, [], $domain);
        if ($id === $translated) {
            return $this->translator->trans($id, [], 'ImaticViewBundle');
        }

        return $translated;
    }
}