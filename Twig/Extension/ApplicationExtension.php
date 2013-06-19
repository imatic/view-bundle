<?php

namespace Imatic\Bundle\ViewBundle\Twig\Extension;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Twig_Extension;

class ApplicationExtension extends Twig_Extension
{
    protected $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function getGlobals()
    {
        return array(
            'application' => $this->getApplication()
        );
    }

    public function getApplication()
    {
        return array(
            'name' => $this->container->getParameter('application.name')
        );
    }

    /**
     * Returns the name of the extension.
     *
     * @return string The extension name
     */
    public function getName()
    {
        return 'imatic_view_application';
    }
}
