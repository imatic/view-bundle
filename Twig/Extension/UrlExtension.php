<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Twig\Extension;

use Imatic\Bundle\ViewBundle\Templating\Helper\Html\UrlHelper;
use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;
use Twig\TwigFunction;

class UrlExtension extends AbstractExtension
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
            new TwigFilter('imatic_slug', 'Imatic\Bundle\ViewBundle\Templating\Utils\StringUtil::slugify'),
        ];
    }

    public function getFunctions()
    {
        return [
            new TwigFunction('imatic_view_update_url', [$this->urlHelper, 'updateUrl']),
            new TwigFunction('imatic_view_update_sorter_url', [$this->urlHelper, 'updateSorterUrl']),
            new TwigFunction('imatic_view_update_filter_url', [$this->urlHelper, 'updateFilterUrl']),
            new TwigFunction('imatic_view_update_pager_url', [$this->urlHelper, 'updatePagerUrl']),
        ];
    }
}
