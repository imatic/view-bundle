<?php

namespace Imatic\Bundle\ViewBundle\Twig\Node;

use Twig_Node;
use Twig_NodeInterface;
use Twig_Compiler;

/**
 * Represents an example node.
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
class ExampleNode extends Twig_Node
{
    /**
     * @param Twig_NodeInterface $body
     * @param string             $rawBody
     * @param int                $lineno
     * @param string             $tag
     */
    public function __construct(Twig_NodeInterface $body, $rawBody, $lineno, $tag = 'spaceless')
    {
        parent::__construct(['body' => $body], ['raw_body' => $rawBody], $lineno, $tag);
    }

    /**
     * Compiles the node to PHP.
     *
     * @param Twig_Compiler A Twig_Compiler instance
     */
    public function compile(Twig_Compiler $compiler)
    {
        $compiler
            ->addDebugInfo($this)
            ->write("ob_start();\n")
            ->subcompile($this->getNode('body'))
            ->write('$content = ob_get_clean();')
            ->write('echo "<div class=\"example\">";')
            ->write('echo "<div class=\"preview\">", $content, "</div>";')
            ->write('echo "<pre class=\"source django\"><code>", ')
            ->string(htmlspecialchars($this->getAttribute('raw_body'), ENT_QUOTES))
            ->write(', "</code></pre>";')
            ->write('echo "</div>";')
            ->write('unset($content);')
        ;

    }
}
