<?php

namespace Imatic\Bundle\ViewBundle\Templating\Helper\Action;

use Imatic\Bundle\ViewBundle\Templating\Helper\Html\HtmlElement;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class ActionHelper
{
    /**
     * @var UrlGeneratorInterface
     */
    private $urlGenerator;

    public function __construct(UrlGeneratorInterface $urlGenerator)
    {
        $this->urlGenerator = $urlGenerator;
    }

    public function create($actionOptions, $contextOptions = null)
    {
        if (!($actionOptions instanceof ActionOptions)) {
            $actionOptions = new ActionOptions($actionOptions);
        }
        if (is_null($contextOptions) || is_array($contextOptions)) {
            $contextOptions = [];
        }

        $url = $actionOptions->url;
        if (!$url && $actionOptions->route) {
            $url = $this->urlGenerator->generate($actionOptions->route, $actionOptions->routeParams);
        }

        $element = new HtmlElement('a', $actionOptions->label, ['href' => $url]);

        foreach ($actionOptions->data as $dataKey => $dataValue) {
            $element->data()->set($dataKey, $dataValue);
        }
        $element->classes()->add($actionOptions->class);

        return $element;
    }

    public function getActionOptions($action)
    {
        if (!($action instanceof ActionOptions)) {
            return new ActionOptions($action);
        }

        return $action;
    }
}