<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Twig\Extension;

use Imatic\Bundle\ViewBundle\Twig\TokenParser\ExampleTokenParser;

/**
 * Example extension.
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
class ExampleExtension extends \Twig_Extension
{
    public function getTokenParsers()
    {
        return [
            new ExampleTokenParser(),
        ];
    }
}
