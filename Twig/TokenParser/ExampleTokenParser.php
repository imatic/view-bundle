<?php

namespace Imatic\Bundle\ViewBundle\Twig\TokenParser;

use Imatic\Bundle\ViewBundle\Twig\Node\ExampleNode;
use Symfony\Component\Templating\TemplateNameParserInterface;
use Symfony\Component\Config\FileLocatorInterface;
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
    /** @var TemplateNameParserInterface */
    private $templatingNameParser;
    /** @var FileLocatorInterface */
    private $templatingLocator;

    public function __construct(
        TemplateNameParserInterface $templatingNameParser,
        FileLocatorInterface $templatingLocator
    ) {
        $this->templatingNameParser = $templatingNameParser;
        $this->templatingLocator = $templatingLocator;
    }

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
        $body = $this->parser->subparse([$this, 'decideExampleEnd'], true);
        $rawBody = $this->parseRawBody($lineno);
        $this->parser->getStream()->expect(Twig_Token::BLOCK_END_TYPE);      

        return new ExampleNode($body, $rawBody, $lineno, $this->getTag());
    }

    /**
     * Parse raw template body
     *
     * @param int $startLine
     * @return string
     */
    private function parseRawBody($startLine)
    {
        // fetch template source
        $templatePath = $this->templatingLocator->locate(
            $this->templatingNameParser->parse(
                $this->parser->getFilename()
            )
         );
        $templateSource = file_get_contents($templatePath);

        // parse tag contents
        preg_match(
            '/\\s*\\{%\s*example\\s*%\\}(.*?)\\s*\\{%\\s*endexample\\s*%\\}/s',
            implode(
                "\n",
                array_slice(
                    preg_split('/\\n|\\r\\n?/', $templateSource),
                    $startLine - 1,
                    $this->parser->getCurrentToken()->getLine() - $startLine + 1
                )
            ),
            $match
        );

        if (isset($match[1])) {
            return $this->removeExtraIndentation($match[1]);
        } else {
            return '';
        }
    }

    /**
     * Remove extra indentation from a string
     *
     * @param string $string
     * @return string
     */
    private function removeExtraIndentation($string)
    {
        $lines = preg_split('/\\n|\\r\\n?/', $string);

        // determine indentation length
        $indentLen = null;
        for ($i = 0; isset($lines[$i]); ++$i) {
            if ('' !== trim($lines[$i])) {
                preg_match('/^\\s*/', $lines[$i], $match);
                $indentLen = strlen($match[0]);
                break;
            }
        }

        if (null !== $indentLen) {
            // cut each line
            $out = '';
            for (; isset($lines[$i]); ++$i) {
                if (substr($lines[$i], 0, $indentLen) === $match[0]) {
                    $out .= substr($lines[$i], $indentLen);
                } else {
                    $out .= $lines[$i];
                }
                $out .= "\n";
            }

            return $out;
        } else {
            return $string;
        }
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
