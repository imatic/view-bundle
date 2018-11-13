<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Twig\Extension;

use Imatic\Bundle\ViewBundle\Templating\Helper\Html\UrlHelper;

class UrlExtension extends \Twig_Extension
{
    /**
     * @var UrlHelper
     */
    private $urlHelper;

    public function __construct(UrlHelper $urlHelper)
    {
        $this->urlHelper = $urlHelper;
    }

    public function getFilters()
    {
        return [
            new \Twig_Filter('imatic_slug', 'Imatic\Bundle\ViewBundle\Templating\Utils\StringUtil::slugify'),
        ];
    }

    public function getFunctions()
    {
        return [
            new \Twig_Function('imatic_view_update_url', [$this->urlHelper, 'updateUrl']),
            new \Twig_Function('imatic_view_update_sorter_url', [$this->urlHelper, 'updateSorterUrl']),
            new \Twig_Function('imatic_view_update_filter_url', [$this->urlHelper, 'updateFilterUrl']),
            new \Twig_Function('imatic_view_update_pager_url', [$this->urlHelper, 'updatePagerUrl']),
        ];
    }
}
