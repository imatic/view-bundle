<?php
namespace Imatic\Bundle\ViewBundle\Templating\Helper\Condition;

use Imatic\Bundle\ViewBundle\Templating\Helper\Layout\LayoutHelper;
use Symfony\Component\ExpressionLanguage\ExpressionLanguage;
use Symfony\Component\Security\Core\Security;

class ConditionHelper
{
    /**
     * @var Security
     */
    private $security;

    /**
     * @var ExpressionLanguage
     */
    private $expressionLanguage;

    /**
     * @var LayoutHelper
     */
    private $layoutHelper;

    /**
     * @param Security     $security
     * @param LayoutHelper $layoutHelper
     */
    public function __construct(Security $security, LayoutHelper $layoutHelper)
    {
        $this->security = $security;
        $this->layoutHelper = $layoutHelper;
        $this->expressionLanguage = new ExpressionLanguage();

        $this->expressionLanguage->register(
            'isGranted',
            function ($str) {
                throw new \Exception($str . ' function is not implemented');
            },
            function (array $values, $attributes, $object = null) {
                return $this->security->isGranted($attributes, $object);
            }
        );
    }

    public function evaluate($expression, array $context = [])
    {
        if (\is_bool($expression)) {
            return $expression;
        }

        if (!$expression) {
            return true;
        }

        if (!isset($context['user'])) {
            $context['user'] = $this->security->getUser();
        }

        $context['hasLayout'] = $this->layoutHelper->hasLayout();

        return $this->expressionLanguage->evaluate($expression, $context);
    }
}
