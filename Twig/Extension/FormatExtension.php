<?php
namespace Imatic\Bundle\ViewBundle\Twig\Extension;

use Imatic\Bundle\ViewBundle\Templating\Helper\Format\FormatHelper;
use Imatic\Bundle\ViewBundle\Twig\Node\FormatFunctionNode;

class FormatExtension extends \Twig_Extension
{
    /**
     * @var FormatHelper
     */
    private $formatHelper;

    public function __construct(FormatHelper $formatHelper)
    {
        $this->formatHelper = $formatHelper;
    }

    public function getFunctions()
    {
        return [
            new \Twig_Function(
                'imatic_view_format',
                function (\Twig_Environment $env, $templateFormat, $value, $format = null, array $options = []) {
                    $output = $this->formatHelper->format($value, $format, $options);

                    return !$templateFormat || $this->formatHelper->isSafe($format, $templateFormat)
                        ? $output
                        : twig_escape_filter($env, $output, $templateFormat);
                },
                [
                    'is_safe' => ['all'],
                    'needs_environment' => true,
                    'node_class' => FormatFunctionNode::class,
                ]
            ),

            new \Twig_Function(
                'imatic_view_render_value',
                function (\Twig_Environment $env, $templateFormat, $objectOrArray, $propertyPath = null, $format = null, array $options = []) {
                    $output = $this->formatHelper->renderValue($objectOrArray, $propertyPath, $format, $options);

                    return !$templateFormat || $this->formatHelper->isSafe($format, $templateFormat)
                        ? $output
                        : twig_escape_filter($env, $output, $templateFormat);
                },
                [
                    'is_safe' => ['all'],
                    'needs_environment' => true,
                    'node_class' => FormatFunctionNode::class,
                ]
            ),
        ];
    }
}
