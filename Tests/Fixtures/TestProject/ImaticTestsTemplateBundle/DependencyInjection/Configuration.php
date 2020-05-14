<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Tests\Fixtures\TestProject\ImaticViewBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

class Configuration implements ConfigurationInterface
{
    /**
     * {@inheritDoc}
     */
    public function getConfigTreeBuilder()
    {
        $treeBuilder = new TreeBuilder('app_imatic_view');
        $rootNode = $treeBuilder->getRootNode();

        return $treeBuilder;
    }
}
