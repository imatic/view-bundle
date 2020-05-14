<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Twig\Node;

use Twig\Compiler;
use Twig\Node\Expression\Binary\AbstractBinary;

/**
 * Represents an instanceof node.
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
class InstanceofNode extends AbstractBinary
{
    public function compile(Compiler $compiler): void
    {
        $compiler
            ->raw('$this->env->getExtension(\'imatic_view_type\')->isInstanceOf(')
            ->subcompile($this->getNode('left'))
            ->raw(', ')
            ->subcompile($this->getNode('right'))
            ->raw(')')
        ;
    }

    public function operator(Compiler $compiler): Compiler
    {
        return $compiler->raw('instanceof');
    }
}
