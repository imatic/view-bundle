<?php

namespace Imatic\Bundle\ViewBundle\Twig\TokenParser;

use Imatic\Bundle\ViewBundle\Twig\Node\ExampleNode;
use Twig_TokenParser;
use Twig_Token;

/**
 * Generate an example
 *
 * {% example %}
 *      <a href="http://example.com/">An example</a>
 * {% endexample %}
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
class ExampleTokenParser extends Twig_TokenParser
{
    /**
     * Parses a token and returns a node.
     *
     * @param Twig_Token $token A Twig_Token instance
     * @return Twig_NodeInterface A Twig_NodeInterface instance
     */
    public function parse(Twig_Token $token)
    {
        $lineno = $token->getLine();

        $this->parser->getStream()->expect(Twig_Token::BLOCK_END_TYPE);
        $body = $this->parser->subparse(array($this, 'decideExampleEnd'), true);
        $this->parser->getStream()->expect(Twig_Token::BLOCK_END_TYPE);

        return new ExampleNode($body, $lineno, $this->getTag());
    }

    /**
     * Decide example end
     *
     * @param Twig_Token $token
     * @return bool
     */
    public function decideExampleEnd(Twig_Token $token)
    {
        return $token->test('endexample');
    }

    /**
     * Gets the tag name associated with this token parser.
     *
     * @return string The tag name
     */
    public function getTag()
    {
        return 'example';
    }
}
