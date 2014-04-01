<?php
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

    /**
     * {@inheritDoc}
     */
    public function getFilters()
    {
        return [
            new \Twig_SimpleFilter('imatic_slug', 'Imatic\Bundle\ViewBundle\Templating\Utils\String::slugify')
        ];
    }

    /**
     * {@inheritDoc}
     */
    public function getFunctions()
    {
        return array(
            new \Twig_SimpleFunction('imatic_view_update_url', array($this->urlHelper, 'updateUrl')),
            new \Twig_SimpleFunction('imatic_view_update_sorter_url', array($this->urlHelper, 'updateSorterUrl')),
            new \Twig_SimpleFunction('imatic_view_update_filter_url', array($this->urlHelper, 'updateFilterUrl')),
            new \Twig_SimpleFunction('imatic_view_update_pager_url', array($this->urlHelper, 'updatePagerUrl')),
        );
    }

    /**
     * {@inheritDoc}
     */
    public function getName()
    {
        return 'imatic_view_url';
    }
}
