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

    public function createPageActionConfiguration(Resource $resource, $currentAction, $itemId = null)
    {
        $actions = $this->filterActions($resource, 'page', $currentAction);

        return array_map(function (ResourceAction $action) use ($resource) {
            $configuration = $this->createDefaultConfiguration($action, $resource);

            return $configuration;
        }, $actions);
    }

    public function createRowActionConfiguration(Resource $resource)
    {
        $actions = $this->filterActions($resource, 'object');

        return array_map(function (ResourceAction $action) use ($resource) {
            $configuration = $this->createDefaultConfiguration($action, $resource);
            $configuration['routeParams'] = ['id' => '#id'];

            return $configuration;
        }, $actions);
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

//            'class' => '',
//            'type' => '',
//            'nested' => [],

        return $configuration;
    }

    private function filterActions(Resource $resource, $type, $excludeAction = null)
    {
        return array_filter($resource->getActions(), function (ResourceAction $action) use ($type, $excludeAction) {
            return $type === $action['group'] && (null === $excludeAction || $excludeAction !== $action['name']);
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