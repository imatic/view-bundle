<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\DependencyInjection;

use Imatic\Bundle\ViewBundle\Templating\Helper\Format\IntlFormatter;
use Imatic\Bundle\ViewBundle\Twig\Loader\RemoteLoader;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Loader;
use Symfony\Component\HttpKernel\DependencyInjection\Extension;

/**
 * This is the class that loads and manages your bundle configuration.
 *
 * To learn more see {@link http://symfony.com/doc/current/cookbook/bundles/extension.html}
 */
class ImaticViewExtension extends Extension
{
    public function load(array $configs, ContainerBuilder $container)
    {
        $configuration = new Configuration();
        $config = $this->processConfiguration($configuration, $configs);

        $loader = new Loader\XmlFileLoader($container, new FileLocator(__DIR__ . '/../Resources/config'));
        $loader->load('services.xml');

        if (!empty($config['templates']['remote'])) {
            $remoteLoaderDefinition = $container->getDefinition(RemoteLoader::class);

            foreach ($config['templates']['remote'] as $remoteTemplateName => $remoteTemplate) {
                $remoteLoaderDefinition->addMethodCall('addTemplate', [
                    $remoteTemplateName,
                    $remoteTemplate['url'],
                    $remoteTemplate['ttl'],
                    isset($remoteTemplate['blocks']) ? $remoteTemplate['blocks'] : [],
                    isset($remoteTemplate['metadata']) ? $remoteTemplate['metadata'] : [],
                ]);
            }
        }

        if (!empty($config['formatters']['intl']['date_pattern_overrides'])) {
            $container
                ->getDefinition(IntlFormatter::class)
                ->addMethodCall('addDatePatternOverrides', [$config['formatters']['intl']['date_pattern_overrides']])
            ;
        }
    }
}
