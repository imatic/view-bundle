<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Templating\Helper\Resource;

use Imatic\Bundle\ControllerBundle\Resource\Config\Resource;
use Imatic\Bundle\ControllerBundle\Resource\Config\ResourceAction;
use Symfony\Component\Security\Core\Security;
use Symfony\Contracts\Translation\TranslatorInterface;

class ResourceHelper
{
    /**
     * @var TranslatorInterface
     */
    private $translator;

    /**
     * @var Security
     */
    private $security;

    /**
     * @param TranslatorInterface $translator
     * @param Security            $security
     */
    public function __construct(TranslatorInterface $translator, Security $security)
    {
        $this->translator = $translator;
        $this->security = $security;
    }

    public function createHeadline(Resource $resource, ResourceAction $action, $item = null)
    {
        $tranKey = \sprintf('%s %s', \ucfirst($resource->getConfig()->name), $action->name);
        $transParam = \sprintf('%%%s%%', $resource->getConfig()->name);

        return $this->translator->trans($tranKey, [$transParam => $item ? $item : 'new'], $resource->getConfig()->translation_domain);
    }

    public function createActionConfiguration(Resource $resource, $actionName, array $merge = [])
    {
        $action = $this->createDefaultConfiguration($resource->getAction($actionName), $resource);
        unset($action['parent']);

        return \array_replace_recursive($action, $merge);
    }

    public function createPageActionConfiguration(Resource $resource, $currentActionName, $itemId = null)
    {
        $currentAction = $resource->getAction($currentActionName);
        $filterActions = 'list' === $currentAction->group ? ['list'] : ['list', 'item'];
        $actions = $this->filterActions($resource, $filterActions, $currentActionName);

        $result = \array_map(function (ResourceAction $action) use ($resource, $currentAction, $itemId) {
            $configuration = $this->createDefaultConfiguration($action, $resource);
            if ('item' === $currentAction->group && 'list' !== $action->group) {
                $configuration['routeParams'] = ['id' => $itemId];
            }

            // We don't need Ajaxify for page actions.
            $configuration = $this->removeDataAttributes($configuration);

            return $configuration;
        }, $actions);

        $result = $this->groupNestedConfiguration($result, true);

        return $result;
    }

    public function createRowActionConfiguration(Resource $resource)
    {
        $actions = $this->filterActions($resource, ['item']);

        $result = \array_map(function (ResourceAction $action) use ($resource) {
            $configuration = $this->createDefaultConfiguration($action, $resource);
            $configuration['routeParams'] = ['id' => '#id'];

            // Disable Ajaxify by resource config.
            if (empty($resource->getConfig()['extra']['ajaxify'])) {
                $configuration = $this->removeDataAttributes($configuration);
            }

            return $configuration;
        }, $actions);

        $result = $this->groupNestedConfiguration($result);

        return $result;
    }

    public function createBatchActionConfiguration(Resource $resource)
    {
        $actions = $this->filterActions($resource, ['batch']);

        $result = \array_map(function (ResourceAction $action) use ($resource) {
            $configuration = $this->createDefaultConfiguration($action, $resource);

            // We don't need Ajaxify for page actions.
            $configuration = $this->removeDataAttributes($configuration);
            // Set tag to input (form action) and form method (one button = one route)
            $configuration['tag'] = 'input';
            $configuration['attrs'] = ['formmethod' => $action['route']['methods'][0]];

            return $configuration;
        }, $actions);

        $result = $this->groupNestedConfiguration($result, true);

        return $result;
    }

    public function filterAvailableActions(array $actions)
    {
        return \array_filter($actions, function (array $action) {
            $expression = $this->createAuthorizationExpression($action);
            if ($expression) {
                return $this->security->isGranted($expression);
            }

            return true;
        });
    }

    private function createDefaultConfiguration(ResourceAction $action, Resource $resource)
    {
        $configuration = [];

        $configuration['label'] = $this->translate(
            \ucfirst(\str_replace('_', ' ', $action->name)),
            $resource->getConfig()['translation_domain']
        );
        $configuration['route'] = $action['route']['name'];

        if ($expression = $this->createAuthorizationExpression($action->toArray())) {
            $configuration['condition'] = $expression;
        }

        if (isset($action['extra']['button_data'])) {
            $configuration['data'] = $action['extra']['button_data'];
        }

        if (isset($action['extra']['button_parent'])) {
            $configuration['parent'] = $action['extra']['button_parent'];
        }

        return $configuration;
    }

    private function removeDataAttributes(array $configuration)
    {
        unset($configuration['data']);

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
        $actions = $resource->getActions();
        $actions = \array_filter($actions, function (ResourceAction $action) use ($types, $excludeAction) {
            return
                \in_array($action['group'], $types, true)
                && (null === $excludeAction || $excludeAction !== $action['name']);
        });

        $actions = \array_filter($actions, function (ResourceAction $action) use ($types, $excludeAction) {
            return !isset($action['extra']['button_show']) || false !== $action['extra']['button_show'];
        });

        return $actions;
    }

    private function translate($id, $domain)
    {
        $translated = $this->translator->trans($id, [], $domain);
        if ($id === $translated) {
            return $this->translator->trans($id, [], 'ImaticViewBundle');
        }

        return $translated;
    }

    private function createAuthorizationExpression(array $action)
    {
        $rules = [];

        if (isset($action['role']) && $action['role']) {
            $rules[] = \sprintf('isGranted("%s")', $action['role']);
        }

        if (isset($action['data_authorization']) && $action['data_authorization'] && 'item' === $action['group']) {
            $rules[] = \sprintf('isGranted("%s", %s)', \strtoupper($action['name']), 'item');
        }

        return \implode(' AND ', $rules);
    }
}
