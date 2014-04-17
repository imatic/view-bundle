<?php

namespace Imatic\Bundle\ViewBundle\Templating\Helper\Condition;

use Symfony\Component\ExpressionLanguage\ExpressionLanguage;
use Symfony\Component\Security\Core\SecurityContextInterface;

class ConditionHelper
{
    /**
     * @var ExpressionLanguage
     */
    private $expressionLanguage;

    /**
     * @var SecurityContextInterface
     */
    private $securityContext;

    public function __construct(SecurityContextInterface $securityContext, ExpressionLanguage $expressionLanguage = null)
    {
        $this->expressionLanguage = $expressionLanguage ? : new ExpressionLanguage();
        $this->expressionLanguage->register(
            'isGranted',
            function ($str) {
                throw new \Exception($str . ' function is not implemented');
            }, function (array $values, $str) {
                return $this->securityContext->isGranted($str);
            });
        $this->securityContext = $securityContext;
    }

    public function evaluate($expression, array $context = [])
    {
        if (!$expression) {
            return true;
        }

        $context['user'] = null;
        if ($this->securityContext->getToken()) {
            $context['user'] = $this->securityContext->getToken()->getUser();
        }

        return $this->expressionLanguage->evaluate($expression, $context);
    }
}
