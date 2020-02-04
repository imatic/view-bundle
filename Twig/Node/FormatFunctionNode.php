<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Twig\Node;

use Twig\Compiler;
use Twig\FileExtensionEscapingStrategy;
use Twig\Node\Expression\ConstantExpression;
use Twig\Node\Expression\FunctionExpression;

/**
 * Format function node.
 *
 * Used by imatic_view_format() and imatic_view_render_value().
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
class FormatFunctionNode extends FunctionExpression
{
    public function compile(Compiler $compiler)
    {
        // guess template format and compile it as an additional argument
        $templateFormat = FileExtensionEscapingStrategy::guess($this->getTemplateName());
        $this->setNode('node', new ConstantExpression($templateFormat, $this->getTemplateLine()));

        parent::compile($compiler);
    }
}
