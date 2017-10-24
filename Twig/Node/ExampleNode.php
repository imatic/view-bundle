<?php
namespace Imatic\Bundle\ViewBundle\Twig\Node;

use Imatic\Bundle\ViewBundle\Templating\Utils\StringUtil;
use Twig_Compiler;
use Twig_Node;

/**
 * Represents an example node.
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
class ExampleNode extends Twig_Node
{
    /**
     * @param Twig_Node $body
     * @param string             $rawBody
     * @param int                $lineno
     * @param string             $tag
     */
    public function __construct(Twig_Node $body, $rawBody, $lineno, $tag = 'example')
    {
        parent::__construct(['body' => $body], ['raw_body' => $rawBody], $lineno, $tag);
    }

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
            ->string(StringUtil::escape($this->getAttribute('raw_body')))
            ->write(', "</code></pre>";')
            ->write('echo "</div>";')
            ->write('unset($content);');
    }
}
