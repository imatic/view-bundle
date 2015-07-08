<?php

namespace Imatic\Bundle\ViewBundle\Twig\Extension;

use Imatic\Bundle\ViewBundle\Twig\TokenParser\ExampleTokenParser;
use Symfony\Component\Templating\TemplateNameParserInterface;
use Symfony\Component\Config\FileLocatorInterface;

/**
 * Example extension
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
class ExampleExtension extends \Twig_Extension
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
     * {@inheritDoc}
     */
    public function getTokenParsers()
    {
        return [
            new ExampleTokenParser(
                $this->templatingNameParser,
                $this->templatingLocator
            ),
        ];
    }

    /**
     * {@inheritDoc}
     */
    public function getName()
    {
        return 'imatic_view_example';
    }
}
