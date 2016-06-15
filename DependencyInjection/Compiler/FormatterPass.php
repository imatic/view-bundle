<?php
namespace Imatic\Bundle\ViewBundle\DependencyInjection\Compiler;

use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Reference;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\OptionsResolver\Exception\ExceptionInterface;

class FormatterPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container)
    {
        $tag = 'imatic_view.formatter';
        $tagOptionsResolver = $this->getTagOptionsResolver();
        $formatterDef = $container->findDefinition('imatic_view.templating.helper.format');

        foreach ($container->findTaggedServiceIds($tag) as $id => $tagAttributes) {
            foreach ($tagAttributes as $attributes) {
                // resolve tag options
                $options = $attributes;
                unset($options['name']);
                unset($options['alias']);

                try {
                    $options = $tagOptionsResolver->resolve($options);
                } catch (ExceptionInterface $e) {
                    throw new \RuntimeException(sprintf('Invalid options for tag "%s" on service "%s"', $tag, $id), 0, $e);
                }

                // process tag options
                if (is_bool($options['is_safe'])) {
                    // BC with <= 3.0.7
                    $options['is_safe'] = $options['is_safe'] ? 'html' : null;
                }

                // register formatter
                $formatterDef->addMethodCall('addFormatter', [
                    $attributes['alias'],
                    new Reference($id),
                    $options
                ]);
            }
        }
    }

    /**
     * @return OptionsResolver
     */
    private function getTagOptionsResolver()
    {
        $resolver = new OptionsResolver();

        $resolver->setDefaults([
            'is_safe' => null,
        ]);
        $resolver->setAllowedTypes('is_safe', [
            'string',
            'NULL',
            'bool', // BC with <= 3.0.7
        ]);

        return $resolver;
    }
}
