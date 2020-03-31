<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Twig\Extension;

use Imatic\Bundle\ViewBundle\Twig\TokenParser\ExampleTokenParser;
use Twig\Extension\AbstractExtension;

/**
 * Example extension.
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
class ExampleExtension extends AbstractExtension
{
    public function getTokenParsers()
    {
        return [
            new ExampleTokenParser(),
        ];
    }
}
