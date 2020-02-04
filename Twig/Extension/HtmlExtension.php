<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Twig\Extension;

use Imatic\Bundle\ViewBundle\Templating\Helper\Html\HtmlHelper;
use Imatic\Bundle\ViewBundle\Templating\Utils\StringUtil;
use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;

class HtmlExtension extends AbstractExtension
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
            new TwigFilter('imatic_html_attributes', [$this->htmlHelper, 'attributes'], ['is_safe' => ['html']]),
            new TwigFilter('imatic_html_data_attributes', [$this->htmlHelper, 'dataAttributes'], ['is_safe' => ['html']]),
            new TwigFilter('imatic_html_unescape', [StringUtil::class, 'unescape']),
        ];
    }
}
