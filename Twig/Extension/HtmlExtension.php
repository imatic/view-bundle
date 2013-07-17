<?php
namespace Imatic\Bundle\ViewBundle\Twig\Extension;

class HtmlExtension extends \Twig_Extension
{
    /**
     * {@inheritDoc}
     */
    public function getFilters()
    {
        return [new \Twig_SimpleFilter('imatic_class', 'Imatic\Bundle\ViewBundle\Util\Html::className')];
    }

    /**
     * {@inheritDoc}
     */
    public function getName()
    {
        return 'imatic_view_html';
    }
}
