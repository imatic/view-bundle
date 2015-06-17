<?php

namespace Imatic\Bundle\ViewBundle\Templating\Helper\Condition;

use Symfony\Component\ExpressionLanguage\ExpressionLanguage;
use Symfony\Component\Security\Core\SecurityContextInterface;
use Imatic\Bundle\ViewBundle\Templating\Helper\Layout\LayoutHelper;

class ConditionHelper
{
    /**
     * @var ExpressionLanguage
     */
    private $expressionLanguage;

    /**
     * @var LayoutHelper
     */
    private $layoutHelper;

    /**
     * @var SecurityContextInterface
     */
    private $securityContext;

    public function __construct(
        SecurityContextInterface $securityContext,
        LayoutHelper $layoutHelper,
        ExpressionLanguage $expressionLanguage = null
    ) {
        $this->expressionLanguage = $expressionLanguage ? : new ExpressionLanguage();
        $this->expressionLanguage->register(
            'isGranted',
            function ($str) {
                throw new \Exception($str . ' function is not implemented');
            }, function (array $values, $str) {
                return $this->securityContext->isGranted($str);
            });
        $this->layoutHelper = $layoutHelper;
        $this->securityContext = $securityContext;
    }

    public function evaluate($expression, array $context = [])
    {
        if (is_bool($expression)) {
            return $expression;
        }

        if (!$expression) {
            return true;
        }

        $context['user'] = null;
        if ($this->securityContext->getToken()) {
            $context['user'] = $this->securityContext->getToken()->getUser();
        }
        $context['hasLayout'] = $this->layoutHelper->hasLayout();

        return $this->expressionLanguage->evaluate($expression, $context);
    }
}
