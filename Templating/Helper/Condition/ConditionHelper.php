<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Templating\Helper\Condition;

use Imatic\Bundle\ViewBundle\Templating\Helper\Layout\LayoutHelper;
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
     * @param Security           $security
     * @param LayoutHelper       $layoutHelper
     * @param ExpressionLanguage $expressionLanguage
     */
    public function __construct(Security $security, LayoutHelper $layoutHelper, ExpressionLanguage $expressionLanguage)
    {
        $this->security = $security;
        $this->layoutHelper = $layoutHelper;
        $this->expressionLanguage = $expressionLanguage;
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
