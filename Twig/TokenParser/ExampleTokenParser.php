<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Twig\TokenParser;

use Imatic\Bundle\ViewBundle\Twig\Node\ExampleNode;
use Twig\Token;
use Twig\TokenParser\AbstractTokenParser;

/**
 * Generate an example.
 *
 * {% example %}
 *      <a href="http://example.com/">An example</a>
 * {% endexample %}
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
class ExampleTokenParser extends AbstractTokenParser
{
    public function getTag()
    {
        return 'example';
    }

    public function parse(Token $token)
    {
        $lineno = $token->getLine();

        $this->parser->getStream()->expect(Token::BLOCK_END_TYPE);
        $body = $this->parser->subparse(function (Token $token) {
            return $token->test('endexample');
        }, true);
        $rawBody = $this->parseRawBody($lineno);
        $this->parser->getStream()->expect(Token::BLOCK_END_TYPE);

        return new ExampleNode($body, $rawBody, $lineno, $this->getTag());
    }

    /**
     * Parse raw template body.
     *
     * @param int $startLine
     *
     * @return string
     */
    private function parseRawBody($startLine)
    {
        $templateSource = \file_get_contents($this->parser->getStream()->getSourceContext()->getPath());

        // parse tag contents
        \preg_match(
            '/\\s*\\{%\s*example\\s*%\\}(.*?)\\s*\\{%\\s*endexample\\s*%\\}/s',
            \implode(
                "\n",
                \array_slice(
                    \preg_split('/\\n|\\r\\n?/', $templateSource),
                    $startLine - 1,
                    $this->parser->getCurrentToken()->getLine() - $startLine + 1
                )
            ),
            $match
        );

        if (isset($match[1])) {
            return $this->removeExtraIndentation($match[1]);
        }

        return '';
    }

    /**
     * Remove extra indentation from a string.
     *
     * @param string $string
     *
     * @return string
     */
    private function removeExtraIndentation($string)
    {
        $lines = \preg_split('/\\n|\\r\\n?/', $string);

        // determine indentation length
        $indentLen = null;
        for ($i = 0; isset($lines[$i]); ++$i) {
            if ('' !== \trim($lines[$i])) {
                \preg_match('/^\\s*/', $lines[$i], $match);
                $indentLen = \strlen($match[0]);
                break;
            }
        }

        if (null !== $indentLen) {
            // cut each line
            $out = '';
            for (; isset($lines[$i]); ++$i) {
                if (\substr($lines[$i], 0, $indentLen) === $match[0]) {
                    $out .= \substr($lines[$i], $indentLen);
                } else {
                    $out .= $lines[$i];
                }
                $out .= "\n";
            }

            return $out;
        }

        return $string;
    }
}
