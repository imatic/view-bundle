<?php

namespace Imatic\Bundle\ViewBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Imatic\Bundle\ViewBundle\DependencyInjection\Compiler\MenuPass;

class ImaticViewBundle extends Bundle
{
    public function getParent()
    {
        return 'TwigBundle';
    }

    public function build(ContainerBuilder $container)
    {
        parent::build($container);

        $container->addCompilerPass(new MenuPass());
    }
}
