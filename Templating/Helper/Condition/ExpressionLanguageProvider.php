<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Templating\Helper\Condition;

use Symfony\Component\ExpressionLanguage\ExpressionFunction;
use Symfony\Component\ExpressionLanguage\ExpressionFunctionProviderInterface;
use Symfony\Component\Security\Core\Security;

/**
 * Define some ExpressionLanguage functions.
 */
class ExpressionLanguageProvider implements ExpressionFunctionProviderInterface
{
    /**
     * @var Security
     */
    private $security;

    /**
     * @param Security $security
     */
    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    /**
     * @return array|ExpressionFunction[]
     *
     * @SuppressWarnings(PHPMD.UnusedLocalVariables)
     */
    public function getFunctions()
    {
        return [
            new ExpressionFunction(
                'isGranted',
                function ($str) {
                    throw new \Exception($str . ' function is not implemented');
                },
                function (array $values, $attributes, $object = null) {
                    return $this->security->isGranted($attributes, $object);
                }
            ),
        ];
    }
}
