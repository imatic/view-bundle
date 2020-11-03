<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Twig\Loader;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Twig\Error\LoaderError;
use Twig\Loader\LoaderInterface;
use Twig\Source;

/**
 * Remote loader.
 */
class RemoteLoader implements LoaderInterface
{
    /** @var ContainerInterface */
    private $container;
    /** @var array map of remote templates */
    private $templates;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    /**
     * Add a remote template.
     *
     * @param string $name
     * @param string $url
     * @param int    $ttl
     * @param array  $blocks
     * @param array  $metadata
     */
    public function addTemplate($name, $url, $ttl, array $blocks, array $metadata)
    {
        $this->templates[$name] = [
            'url' => $url,
            'ttl' => $ttl,
            'blocks' => $blocks,
            'metadata' => $metadata,
            'checked_ttl' => false,
            'checking_ttl' => false,
        ];
    }

    public function exists($name)
    {
        return isset($this->templates[$name]);
    }

    public function getSource($name)
    {
        $this->ensureExists($name);

        // fetch source
        $e = null;
        try {
            $source = \file_get_contents($this->templates[$name]['url']);
        } catch (\Exception $e) {
        }
        if ($e || false === $source) {
            throw new LoaderError(
                \sprintf(
                    'Could not load remote template "%s" from URL "%s"',
                    $name,
                    $this->templates[$name]['url']
                ),
                -1,
                null,
                $e
            );
        }

        // convert placeholders to blocks
        $source = $this->placeholdersToBlocks($this->templates[$name]['blocks'], $source);

        // add metadata variable
        $metadata = $this->getMetadata($name);
        $source = \sprintf('{%% set _remote = %s %%}', \json_encode($metadata)) . $source;

        return $source;
    }

    public function getCacheKey($name): string
    {
        $this->ensureExists($name);

        if (
            !$this->container->get('twig')->isAutoReload()
            && !$this->templates[$name]['checked_ttl']
            && !$this->templates[$name]['checking_ttl']
        ) {
            $this->templates[$name]['checking_ttl'] = true;
            $this->checkCacheFileTtl($name);
            $this->templates[$name]['checking_ttl'] = false;
            $this->templates[$name]['checked_ttl'] = true;
        }

        return $name;
    }

    public function isFresh($name, $time): bool
    {
        // this method is called only if env->isAutoReload() == TRUE
        $this->ensureExists($name);

        return \time() - $time < $this->templates[$name]['ttl'];
    }

    private function getCacheFilename($name)
    {
        $twig = $this->container->get('twig');
        $key = $twig->getCache(false)->generateKey($name, $twig->getTemplateClass($name));

        return !$key ? false : $key;
    }

    /**
     * Check cache file TTL.
     *
     * This method is called only if env->isAutoReload() == FALSE
     *
     * @param string $name
     */
    private function checkCacheFileTtl($name)
    {
        if (
            false !== ($cacheFile = $this->getCacheFilename($name))
            && \is_file($cacheFile)
            && \time() - \filemtime($cacheFile) >= $this->templates[$name]['ttl']
        ) {
            // remove expired cache file
            \unlink($cacheFile);
        }
    }

    /**
     * Make sure the given template is a known remote template.
     *
     * @param string $name
     *
     * @throws LoaderError
     */
    private function ensureExists($name)
    {
        if (!isset($this->templates[$name])) {
            throw new LoaderError(\sprintf('Template "%s" is not a known remote template', $name));
        }
    }

    /**
     * Convert placeholders to blocks in the source.
     *
     * @param array  $blocks
     * @param string $source
     *
     * @return string
     */
    private function placeholdersToBlocks(array $blocks, $source)
    {
        $usedBlockMap = [];
        $placeholderToBlockMap = [];

        $pattern = '';
        $first = true;
        foreach ($blocks as $blockName => $block) {
            $first ? $first = false : $pattern .= '|';
            $pattern .= \preg_quote($block['placeholder'], '/');

            $placeholderToBlockMap[$block['placeholder']] = $blockName;
        }

        return \preg_replace_callback(
            \sprintf('/(%s)/', $pattern),
            function (array $match) use ($placeholderToBlockMap, &$usedBlockMap) {
                $blockName = $placeholderToBlockMap[$match[0]];

                if (isset($usedBlockMap[$blockName])) {
                    return $this->createRepeatedPlaceholderBlockSyntax($blockName);
                }
                $usedBlockMap[$blockName] = true;

                return $this->createPlaceholderBlockSyntax($blockName);
            },
            $source
        );
    }

    /**
     * Create placeholder block syntax.
     *
     * @param string $blockName
     *
     * @return string
     */
    private function createPlaceholderBlockSyntax($blockName)
    {
        return \sprintf('{%% block %s %%}{%% endblock %%}', $blockName);
    }

    /**
     * Create repeated placeholder block syntax.
     *
     * @param string $blockName
     *
     * @return string
     */
    private function createRepeatedPlaceholderBlockSyntax($blockName)
    {
        return \sprintf('{{ block("%s") }}', $blockName);
    }

    /**
     * Get template metadata array.
     *
     * @param string $name template name
     *
     * @return string
     */
    private function getMetadata($name)
    {
        $this->ensureExists($name);

        return
            ['url' => $this->templates[$name]['url']]
            + $this->templates[$name]['metadata'];
    }

    public function getSourceContext($name): Source
    {
        return new Source($this->getSource($name), $name);
    }
}
