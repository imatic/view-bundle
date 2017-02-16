<?php

namespace Imatic\Bundle\ViewBundle\Templating\Helper\Condition;

use Imatic\Bundle\ViewBundle\Templating\Helper\Layout\LayoutHelper;
use Symfony\Component\ExpressionLanguage\ExpressionLanguage;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

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
     * @var TokenStorageInterface
     */
    private $tokenStorage;

    /**
     * @var AuthorizationCheckerInterface
     */
    private $authorizationChecker;

    public function __construct(
        TokenStorageInterface $tokenStorage,
        AuthorizationCheckerInterface $authorizationChecker,
        LayoutHelper $layoutHelper,
        ExpressionLanguage $expressionLanguage = null
    ) {
        $this->expressionLanguage = $expressionLanguage ?: new ExpressionLanguage();
        $this->authorizationChecker = $authorizationChecker;
        $this->expressionLanguage->register(
            'isGranted',
            function ($str) {
                throw new \Exception($str.' function is not implemented');
            }, function (array $values, $attributes, $object = null) {
                return $this->authorizationChecker->isGranted($attributes, $object);
            });
        $this->layoutHelper = $layoutHelper;
        $this->tokenStorage = $tokenStorage;
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
        if ($this->tokenStorage->getToken()) {
            $context['user'] = $this->tokenStorage->getToken()->getUser();
        }
        $context['hasLayout'] = $this->layoutHelper->hasLayout();

        return $this->expressionLanguage->evaluate($expression, $context);
    }
}
