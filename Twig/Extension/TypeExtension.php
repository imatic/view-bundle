<?php

namespace Imatic\Bundle\ViewBundle\Twig\Extension;

use Twig_Extension;
use Twig_SimpleTest;
use Twig_ExpressionParser;
use Imatic\Bundle\ViewBundle\Twig\Node\InstanceofNode;

class TypeExtension extends Twig_Extension
{
    public function getTests()
    {
        return [
            new Twig_SimpleTest('integer', 'is_int'),
            new Twig_SimpleTest('float', 'is_float'),
            new Twig_SimpleTest('numeric', 'is_numeric'),
            new Twig_SimpleTest('boolean', 'is_bool'),
            new Twig_SimpleTest('string', 'is_string'),
            new Twig_SimpleTest('array', 'is_array'),
            new Twig_SimpleTest('object', 'is_object'),
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
            ]
        ];
    }

    /**
     * @param object        $left
     * @param object|string $right
     * @return bool
     */
    public function isInstanceOf($left, $right)
    {
        return $left instanceof $right;
    }
}
