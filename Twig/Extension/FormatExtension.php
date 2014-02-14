<?php

namespace Imatic\Bundle\ViewBundle\Twig\Extension;

use Imatic\Bundle\ViewBundle\Templating\Helper\Format\FormatHelper;

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
            new \Twig_SimpleFunction('imatic_view_format', [$this, 'format'], ['is_safe' => ['html']]),
        ];
    }

    public function format($value, $format, array $options = [])
    {
        return $this->formatHelper->format($value, $format, $options);
    }

    /**
     * Returns the name of the extension.
     *
     * @return string The extension name
     */
    public function getName()
    {
        return 'imatic_view_format';
    }
}
