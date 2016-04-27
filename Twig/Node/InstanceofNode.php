<?php

namespace Imatic\Bundle\ViewBundle\Twig\Node;

use Twig_Node_Expression_Binary;
use Twig_Compiler;

/**
 * Represents an instanceof node
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
class InstanceofNode extends Twig_Node_Expression_Binary
{
    public function compile(Twig_Compiler $compiler)
    {
        $compiler
            ->raw('$this->env->getExtension(\'imatic_view_type\')->isInstanceOf(')
            ->subcompile($this->getNode('left'))
            ->raw(', ')
            ->subcompile($this->getNode('right'))
            ->raw(')')
        ;
    }

    public function operator(Twig_Compiler $compiler)
    {
        return $compiler->raw('instanceof');
    }
}
