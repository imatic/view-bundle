<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Twig\Extension;

use Imatic\Bundle\ViewBundle\Twig\Node\InstanceofNode;
use Twig\ExpressionParser;
use Twig\Extension\AbstractExtension;
use Twig\TwigTest;

class TypeExtension extends AbstractExtension
{
    public function getTests()
    {
        return [
            new TwigTest('integer', 'is_int'),
            new TwigTest('float', 'is_float'),
            new TwigTest('numeric', 'is_numeric'),
            new TwigTest('boolean', 'is_bool'),
            new TwigTest('string', 'is_string'),
            new TwigTest('array', 'is_array'),
            new TwigTest('object', 'is_object'),
        ];
    }

    public function getOperators()
    {
        return [
            // unary
            [],

            // binary
            [
                'instanceof' => ['precedence' => 400, 'class' => InstanceofNode::class, 'associativity' => ExpressionParser::OPERATOR_LEFT],
            ],
        ];
    }

    /**
     * @param object        $left
     * @param object|string $right
     *
     * @return bool
     */
    public function isInstanceOf($left, $right)
    {
        return $left instanceof $right;
    }
}
