<?php

namespace Imatic\Bundle\ViewBundle\Twig\Extension;

use Imatic\Bundle\ViewBundle\Twig\TokenParser\ExampleTokenParser;

/**
 * Example extension
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
class ExampleExtension extends \Twig_Extension
{
    /**
     * {@inheritDoc}
     */
    public function getTokenParsers()
    {
        return array(
            new ExampleTokenParser(),
        );
    }

    /**
     * {@inheritDoc}
     */
    public function getName()
    {
        return 'imatic_view_example';
    }
}
