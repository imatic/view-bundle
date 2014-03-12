<?php

namespace Imatic\Bundle\ViewBundle\Twig\Extension;

use Imatic\Bundle\ViewBundle\Templating\Helper\Layout\LayoutHelper;
use Twig_Extension;
use Twig_SimpleFunction;

/**
 * Layout extension
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
class LayoutExtension extends Twig_Extension
{
    /** @var LayoutHelper */
    private $layoutHelper;

    /**
     * Constructor
     *
     * @param LayoutHelper $layoutHelper
     */
    public function __construct(LayoutHelper $layoutHelper)
    {
        $this->layoutHelper = $layoutHelper;
    }

    /**
     * {@inheritDoc}
     */
    public function getFunctions()
    {
        return array(
            new Twig_SimpleFunction('imatic_view_has_layout', array($this->layoutHelper, 'hasLayout')),
            new Twig_SimpleFunction('imatic_view_set_title', array($this->layoutHelper, 'setTitle')),
            new Twig_SimpleFunction('imatic_view_set_full_title', array($this->layoutHelper, 'setFullTitle')),
        );
    }

    /**
     * {@inheritDoc}
     */
    public function getName()
    {
        return 'imatic_view_layout';
    }
}
