<?php

namespace Imatic\Bundle\ViewBundle\Twig\Extension;

use Imatic\Bundle\ViewBundle\Templating\Helper\Html\HtmlHelper;
use Imatic\Bundle\ViewBundle\Templating\Utils\StringUtil;

class HtmlExtension extends \Twig_Extension
{
    /**
     * @var HtmlHelper
     */
    private $htmlHelper;

    public function __construct(HtmlHelper $htmlHelper)
    {
        $this->htmlHelper = $htmlHelper;
    }

    public function getFilters()
    {
        return [
            new \Twig_SimpleFilter('imatic_html_attributes', [$this->htmlHelper, 'attributes'], ['is_safe' => ['html']]),
            new \Twig_SimpleFilter('imatic_html_data_attributes', [$this->htmlHelper, 'dataAttributes'], ['is_safe' => ['html']]),
            new \Twig_SimpleFilter('imatic_html_unescape', [StringUtil::class, 'unescape']),
        ];
    }

    public function getName()
    {
        return 'imatic_view_html';
    }
}
