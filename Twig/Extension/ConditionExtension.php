<?php

namespace Imatic\Bundle\ViewBundle\Twig\Extension;

use Imatic\Bundle\ViewBundle\Templating\Helper\Condition\ConditionHelper;
use Twig_Extension;
use Twig_SimpleFunction;

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

    /**
     * {@inheritDoc}
     */
    public function getFunctions()
    {
        return array(
            new Twig_SimpleFunction('imatic_view_condition_evaluate', array($this->conditionHelper, 'evaluate')),
        );
    }

    /**
     * {@inheritDoc}
     */
    public function getName()
    {
        return 'imatic_view_condition';
    }
}
