<?php
namespace Imatic\Bundle\ViewBundle\Twig\Extension;

class LayoutExtension extends \Twig_Extension
{
    /**
     * {@inheritDoc}
     */
    public function getFunctions()
    {
        return array(
            new \Twig_SimpleFunction('imatic_view_layout', array($this, 'aa')),
        );
    }

    public function aa()
    {
        return 'aaaaa';
    }

    /**
     * {@inheritDoc}
     */
    public function getName()
    {
        return 'imatic_view_layout';
    }
}
