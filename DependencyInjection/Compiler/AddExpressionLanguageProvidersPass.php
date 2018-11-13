<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\DependencyInjection\Compiler;

use Imatic\Bundle\ViewBundle\Templating\Helper\Condition\ExpressionLanguage;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Reference;

/**
 * Registers the expression language providers.
 */
class AddExpressionLanguageProvidersPass implements CompilerPassInterface
{
    public const EXPRESSION_LANGUAGE_PROVIDER_TAG = 'imatic_view.expression_language_provider';

    /**
     * @param ContainerBuilder $container
     *
     * @SuppressWarnings(PHPMD.UnusedLocalVariables)
     */
    public function process(ContainerBuilder $container)
    {
        $definition = $container->findDefinition(ExpressionLanguage::class);

        foreach ($container->findTaggedServiceIds(self::EXPRESSION_LANGUAGE_PROVIDER_TAG) as $id => $attributes) {
            $definition->addMethodCall('registerProvider', [new Reference($id)]);
        }
    }
}
