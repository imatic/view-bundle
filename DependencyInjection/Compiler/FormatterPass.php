<?php
namespace Imatic\Bundle\ViewBundle\DependencyInjection\Compiler;

use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Reference;

class FormatterPass implements CompilerPassInterface
{
    /**
     * @param ContainerBuilder $container
     */
    public function process(ContainerBuilder $container)
    {
        $formatters = $container->findTaggedServiceIds('imatic_view.formatter');
        $formatterDef = $container->findDefinition('imatic_view.templating.helper.format');

        foreach ($formatters as $id => $tagAttributes) {
            foreach ($tagAttributes as $attributes) {
                $formatterDef->addMethodCall('addFormatter', [
                    $attributes['alias'],
                    new Reference($id),
                ]);
            }
        }
    }
}
