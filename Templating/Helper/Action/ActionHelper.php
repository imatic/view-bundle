<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Templating\Helper\Action;

use Imatic\Bundle\ViewBundle\Templating\Helper\Html\HtmlElement;
use Symfony\Component\PropertyAccess\PropertyAccess;
use Symfony\Component\PropertyAccess\PropertyAccessor;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class ActionHelper
{
    /**
     * @var UrlGeneratorInterface
     */
    private $urlGenerator;

    /**
     * @var PropertyAccessor
     */
    private $accessor;

    public function __construct(UrlGeneratorInterface $urlGenerator)
    {
        $this->urlGenerator = $urlGenerator;
        $this->accessor = PropertyAccess::createPropertyAccessor();
    }

    /**
     * @param ActionOptions|array $actionOptions
     * @param array|null          $contextOptions
     *
     * @return HtmlElement
     */
    public function create($actionOptions, $contextOptions = null)
    {
        if (!($actionOptions instanceof ActionOptions)) {
            $actionOptions = new ActionOptions($actionOptions);
        }
        if (\is_null($contextOptions) || !\is_array($contextOptions)) {
            $contextOptions = [];
        }

        $url = $this->getActionUrl($actionOptions, $contextOptions);

        if ('input' === $actionOptions->tag) {
            $element = new HtmlElement('input', null, $actionOptions->attrs + [
                'type' => 'submit',
                'formaction' => $url ? $url : null,
                'value' => $actionOptions->label,
                'name' => $actionOptions->name,
            ]);
        } else {
            $element = new HtmlElement('a', $actionOptions->label, $actionOptions->attrs + ['href' => $url]);
        }

        foreach ($actionOptions->data as $dataKey => $dataValue) {
            $element->data()->set($dataKey, $dataValue);
        }
        $element->classes()->add($actionOptions->class);

        return $element;
    }

    /**
     * @param object|array $object
     * @param array        $parameters
     *
     * @return array
     */
    public function applyParameters($object, array $parameters)
    {
        foreach ($parameters as $name => $value) {
            if (\is_string($value) && 0 === \strpos($value, '#')) {
                $key = \substr($value, 1);
                $value = $this->accessor->getValue($object, $key);
                $parameters[$name] = $value;
            }
        }

        return $parameters;
    }

    /**
     * @param ActionOptions|array $action
     *
     * @return ActionOptions
     */
    public function getActionOptions($action)
    {
        if (!($action instanceof ActionOptions)) {
            return new ActionOptions($action);
        }

        return $action;
    }

    /**
     * @param ActionOptions $actionOptions
     * @param array         $contextOptions
     *
     * @return string
     */
    public function getActionUrl(ActionOptions $actionOptions, array $contextOptions)
    {
        $url = $actionOptions->url;
        if (!$url && $actionOptions->route) {
            $routeParameters = $actionOptions->routeParams;
            if (\array_key_exists('item', $contextOptions)) {
                $routeParameters = $this->applyParameters($contextOptions['item'], $routeParameters);
            }
            $url = $this->urlGenerator->generate($actionOptions->route, $routeParameters);
        }

        return $url;
    }
}
