<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\DependencyInjection\Compiler;

use Imatic\Bundle\ViewBundle\Menu\ContainerProvider;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;

class MenuPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container)
    {
        $definition = $container->getDefinition(ContainerProvider::class);

        foreach ($container->findTaggedServiceIds('imatic_view.menu') as $id => $tags) {
            foreach ($tags as $attributes) {
                if (empty($attributes['alias'])) {
                    throw new \InvalidArgumentException(\sprintf('The alias is not defined in the "imatic_menu.menu" tag for the service "%s"', $id));
                }

                $definition->addMethodCall('addService', [$attributes['alias'], \array_merge($attributes, ['id' => $id])]);
            }
        }
    }
}
