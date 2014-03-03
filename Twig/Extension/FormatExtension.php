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
            new \Twig_SimpleFunction('imatic_view_format', [$this->formatHelper, 'format'], ['is_safe' => ['html']]),
            new \Twig_SimpleFunction('imatic_view_render_value', [$this->formatHelper, 'renderValue'], ['is_safe' => ['html']]),
        ];
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
