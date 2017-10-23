<?php
namespace Imatic\Bundle\ViewBundle\Twig\Extension;

use Imatic\Bundle\ViewBundle\Templating\Helper\Layout\LayoutHelper;
use Twig_Extension;

/**
 * Layout extension.
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
class LayoutExtension extends Twig_Extension
{
    /** @var LayoutHelper */
    private $layoutHelper;

    public function __construct(LayoutHelper $layoutHelper)
    {
        $this->layoutHelper = $layoutHelper;
    }

    public function getFunctions()
    {
        return [
            new \Twig_Function('imatic_view_has_layout', [$this->layoutHelper, 'hasLayout']),
            new \Twig_Function('imatic_view_is_modal_dialog', [$this->layoutHelper, 'isModalDialog']),
            new \Twig_Function('imatic_view_set_title', [$this->layoutHelper, 'setTitle']),
            new \Twig_Function('imatic_view_set_full_title', [$this->layoutHelper, 'setFullTitle']),
        ];
    }
}
