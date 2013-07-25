<?php

namespace Imatic\Bundle\ViewBundle\Twig\Extension;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Twig_Function_Method;
use Twig_Extension;

class ConfigurationExtension extends Twig_Extension
{
    protected $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function getFunctions()
    {
        return [new \Twig_SimpleFunction('imatic_config_get', [$this, 'getConfig'])];
    }

    public function getConfig($key)
    {
        return $this->container->getParameter($key);
    }

    /**
     * Returns the name of the extension.
     *
     * @return string The extension name
     */
    public function getName()
    {
        return 'imatic_view_configuration';
    }
}
