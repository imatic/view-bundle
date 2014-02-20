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
     * Constructor
     *
     * @param Twig_NodeInterface $body
     * @param int                $lineno
     * @param string             $tag
     */
    public function __construct(Twig_NodeInterface $body, $lineno, $tag = 'spaceless')
    {
        parent::__construct(array('body' => $body), array(), $lineno, $tag);
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
            ->write('echo "<pre class=\"code\">", htmlspecialchars(\Imatic\Bundle\ViewBundle\Twig\Node\ExampleNode::trim($content), ENT_QUOTES), "</pre>";')
            ->write('echo "</div>";')
        ;
    }

    /**
     *
     */
    public static function trim($string)
    {
        $out = '';
        $lines = preg_split('/\n|\r\n?/', $string);

        if (!empty($lines)) {
            preg_match('/^\s*/', $lines[0], $match);
            if (isset($match[0])) {
                $indentLen = strlen($match[0]);
            }

            foreach ($lines as $line) {
                if (substr($line, 0, $indentLen) === $match[0]) {
                    $out .= substr($line, $indentLen);
                } else {
                    $out .= $line;
                }
                $out .= "\n";
            }

            return trim($out);
        } else {
            return $string;
        }
    }
}
