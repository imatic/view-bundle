<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Twig\Runtime;

use Imatic\Bundle\ViewBundle\Templating\Helper\Format\FormatHelper;
use Twig\Environment;

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

    public function format(Environment $env, $templateFormat, $value, $format = null, array $options = [])
    {
        $output = $this->formatHelper->format($value, $format, $options);

        return !$templateFormat || $this->formatHelper->isSafe($format, $templateFormat)
            ? $output
            : twig_escape_filter($env, $output, $templateFormat);
    }

    public function renderValue(Environment $env, $templateFormat, $objectOrArray, $propertyPath = null, $format = null, array $options = [])
    {
        $output = $this->formatHelper->renderValue($objectOrArray, $propertyPath, $format, $options);

        return !$templateFormat || $this->formatHelper->isSafe($format, $templateFormat)
            ? $output
            : twig_escape_filter($env, $output, $templateFormat);
    }
}
