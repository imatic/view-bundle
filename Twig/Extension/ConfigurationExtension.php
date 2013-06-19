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
        return array(
            'imatic_view_config_get' => new Twig_Function_Method($this, 'getConfig')
        );
    }

    public function getConfig($key)
    {
        $key = sprintf("imatic_view.%s", $key);

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
