<?php

namespace Imatic\Bundle\ViewBundle\Twig\Extension;

use Twig_Extension;
use Twig_ExpressionParser;
use Imatic\Bundle\ViewBundle\Twig\Node\InstanceofNode;

class TypeExtension extends Twig_Extension
{
    public function getTests()
    {
        return [
            new \Twig_Test('integer', 'is_int'),
            new \Twig_Test('float', 'is_float'),
            new \Twig_Test('numeric', 'is_numeric'),
            new \Twig_Test('boolean', 'is_bool'),
            new \Twig_Test('string', 'is_string'),
            new \Twig_Test('array', 'is_array'),
            new \Twig_Test('object', 'is_object'),
        ];
    }

    public function getOperators()
    {
        return [
            // unary
            [],

            // binary
            [
                'instanceof' => ['precedence' => 400, 'class' => InstanceofNode::class, 'associativity' => Twig_ExpressionParser::OPERATOR_LEFT],
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
