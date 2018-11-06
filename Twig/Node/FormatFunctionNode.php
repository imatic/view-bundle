<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Twig\Node;

/**
 * Format function node.
 *
 * Used by imatic_view_format() and imatic_view_render_value().
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
class FormatFunctionNode extends \Twig_Node_Expression_Function
{
    public function compile(\Twig_Compiler $compiler)
    {
        // guess template format and compile it as an additional argument
        $templateFormat = \Twig_FileExtensionEscapingStrategy::guess($this->getTemplateName());
        $this->setNode('node', new \Twig_Node_Expression_Constant($templateFormat, $this->getTemplateLine()));

        parent::compile($compiler);
    }
}
