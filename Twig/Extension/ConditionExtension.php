<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Twig\Extension;

use Imatic\Bundle\ViewBundle\Templating\Helper\Condition\ConditionHelper;
use Twig_Extension;

class ConditionExtension extends Twig_Extension
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
            new \Twig_Function('imatic_view_condition_evaluate', [$this->conditionHelper, 'evaluate']),
        ];
    }
}
