<?php
namespace Imatic\Bundle\ViewBundle\DependencyInjection\Compiler;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;

class MenuPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container)
    {
        $definition = $container->getDefinition('imatic_view.menu.provider');

        foreach ($container->findTaggedServiceIds('imatic_view.menu') as $id => $tags) {
            foreach ($tags as $attributes) {
                if (empty($attributes['alias'])) {
                    throw new \InvalidArgumentException(sprintf('The alias is not defined in the "imatic_menu.menu" tag for the service "%s"', $id));
                }
                $definition->addMethodCall('addService', array($attributes['alias'], array_merge($attributes, array('id' => $id))));
            }
        }
    }
}
