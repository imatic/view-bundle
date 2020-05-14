<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

/**
 * This is the class that validates and merges configuration from your app/config files.
 *
 * To learn more see {@link http://symfony.com/doc/current/cookbook/bundles/extension.html#cookbook-bundles-extension-config-class}
 */
class Configuration implements ConfigurationInterface
{
    public function getConfigTreeBuilder()
    {
        $treeBuilder = new TreeBuilder('imatic_view');
        $rootNode = $treeBuilder->getRootNode();

        $rootNode
            ->children()
                ->arrayNode('formatters')
                    ->children()
                        ->arrayNode('intl')
                            ->children()
                                ->arrayNode('date_pattern_overrides')
                                    ->prototype('variable')->end()
                                ->end()
                            ->end()
                        ->end()
                    ->end()
                ->end()
                ->arrayNode('templates')
                    ->canBeUnset(true)
                    ->children()
                        ->arrayNode('remote')
                            ->useAttributeAsKey('name')
                            ->prototype('array')
                                ->children()
                                    ->scalarNode('name')->cannotBeEmpty()->end()
                                    ->scalarNode('url')->cannotBeEmpty()->end()
                                    ->scalarNode('ttl')->defaultValue(24 * 60 * 60)->end()
                                    ->arrayNode('blocks')
                                        ->useAttributeAsKey('name')
                                        ->prototype('array')
                                            ->children()
                                                ->scalarNode('name')->cannotBeEmpty()->end()
                                                ->scalarNode('placeholder')->cannotBeEmpty()->end()
                                            ->end()
                                        ->end()
                                    ->end()
                                    ->arrayNode('metadata')
                                        ->prototype('variable')
                                    ->end()
                                ->end()
                            ->end()
                        ->end()
                    ->end()
                ->end()
            ->end()
        ;

        return $treeBuilder;
    }
}
