<?php
namespace Imatic\Bundle\ViewBundle\Twig\Extension;

class StringExtension extends \Twig_Extension
{
    /**
     * {@inheritDoc}
     */
    public function getFilters()
    {
        return [
            new \Twig_SimpleFilter('imatic_format', 'sprintf'),
            new \Twig_SimpleFilter('imatic_slug', 'Imatic\Bundle\ViewBundle\Util\String::slugify')
        ];
    }

    /**
     * {@inheritDoc}
     */
    public function getName()
    {
        return 'imatic_view_string';
    }
}
