<?php

namespace Imatic\Bundle\ViewBundle\Twig\Runtime;

use Imatic\Bundle\ViewBundle\Templating\Helper\Format\FormatHelper;

class FormatRuntime
{
    /**
     * @var FormatHelper
     */
    private $formatHelper;

    /**
     * @param FormatHelper $formatHelper
     */
    public function __construct(FormatHelper $formatHelper)
    {
        $this->formatHelper = $formatHelper;
    }

    public function format(\Twig_Environment $env, $templateFormat, $value, $format = null, array $options = [])
    {
        $output = $this->formatHelper->format($value, $format, $options);

        return !$templateFormat || $this->formatHelper->isSafe($format, $templateFormat)
            ? $output
            : twig_escape_filter($env, $output, $templateFormat);
    }

    public function renderValue(\Twig_Environment $env, $templateFormat, $objectOrArray, $propertyPath = null, $format = null, array $options = [])
    {
        $output = $this->formatHelper->renderValue($objectOrArray, $propertyPath, $format, $options);

        return !$templateFormat || $this->formatHelper->isSafe($format, $templateFormat)
            ? $output
            : twig_escape_filter($env, $output, $templateFormat);
    }
}
