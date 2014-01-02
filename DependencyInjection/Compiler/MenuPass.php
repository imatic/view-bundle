<?php
namespace Imatic\Bundle\ViewBundle\DependencyInjection\Compiler;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;

/**
 * Menu pass
 */
class MenuPass implements CompilerPassInterface
{
    /**
     * {@inheritdoc}
     */
    public function process(ContainerBuilder $container)
    {
        $definition = $container->getDefinition('imatic_view.menu.provider_container');

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
