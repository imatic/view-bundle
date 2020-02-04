<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Twig\Extension;

use Imatic\Bundle\ViewBundle\Templating\Helper\Condition\ConditionHelper;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class ConditionExtension extends AbstractExtension
{
    /**
     * @var ConditionHelper
     */
    private $conditionHelper;

    public function __construct(ConditionHelper $conditionHelper)
    {
        $this->conditionHelper = $conditionHelper;
    }

    public function getFunctions()
    {
        return [
            new TwigFunction('imatic_view_condition_evaluate', [$this->conditionHelper, 'evaluate']),
        ];
    }
}
