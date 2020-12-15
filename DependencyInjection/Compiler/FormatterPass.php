<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\DependencyInjection\Compiler;

use Imatic\Bundle\ViewBundle\Templating\Helper\Format\FormatHelper;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Reference;
use Symfony\Component\OptionsResolver\Exception\ExceptionInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class FormatterPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container)
    {
        $tagOptionsResolver = $this->getTagOptionsResolver();
        $formatterDef = $container->findDefinition(FormatHelper::class);

        foreach ($container->findTaggedServiceIds('imatic_view.formatter') as $id => $tagAttributes) {
            foreach ($tagAttributes as $attributes) {
                // resolve tag options
                $options = $attributes;
                unset($options['name'], $options['alias']);

                try {
                    $options = $tagOptionsResolver->resolve($options);
                } catch (ExceptionInterface $e) {
                    throw new \RuntimeException(\sprintf('Invalid options for tag "imatic_view.formatter" on service "%s"', $id), 0, $e);
                }

                // register formatter
                $formatterDef->addMethodCall('addFormatter', [
                    $attributes['alias'],
                    new Reference($id),
                    $options,
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
            'null',
        ]);

        return $resolver;
    }
}
