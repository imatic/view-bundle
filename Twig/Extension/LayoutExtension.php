<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Twig\Extension;

use Imatic\Bundle\ViewBundle\Templating\Helper\Layout\LayoutHelper;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

/**
 * Layout extension.
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
class LayoutExtension extends AbstractExtension
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
            new TwigFunction('imatic_view_has_layout', [$this->layoutHelper, 'hasLayout']),
            new TwigFunction('imatic_view_is_modal_dialog', [$this->layoutHelper, 'isModalDialog']),
            new TwigFunction('imatic_view_set_title', [$this->layoutHelper, 'setTitle']),
            new TwigFunction('imatic_view_set_full_title', [$this->layoutHelper, 'setFullTitle']),
        ];
    }
}
