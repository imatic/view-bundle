<?php

namespace Imatic\Bundle\ViewBundle\Twig\Loader;

use Twig_LoaderInterface;
use Twig_ExistsLoaderInterface;
use Twig_Error_Loader;

/**
 * Remote loader
 */
class RemoteLoader implements Twig_LoaderInterface, Twig_ExistsLoaderInterface
{
    /** @var array map of remote templates */
    private $templates;

    /**
     * Add remote template
     *
     * @param string $name
     * @param string $url
     * @param int    $ttl
     * @param array  $blocks
     * @param array  $metadata
     */
    public function addTemplate($name, $url, $ttl, array $blocks, array $metadata)
    {
        $this->templates[$name] = array(
            'url' => $url,
            'ttl' => $ttl,
            'blocks' => $blocks,
            'metadata' => $metadata,
        );
    }

    /**
     * Check if we have the source code of a template, given its name.
     *
     * @param string $name The name of the template to check if we can load
     *
     * @return boolean If the template source code is handled by this loader or not
     */
    public function exists($name)
    {
        return isset($this->templates[$name]);
    }

    /**
     * Gets the source code of a template, given its name.
     *
     * @param string $name The name of the template to load
     *
     * @return string The template source code
     *
     * @throws \Twig_Error_Loader When $name is not found
     */
    public function getSource($name)
    {
        $this->ensureExists($name);

        // fetch source
        $source = file_get_contents($this->templates[$name]['url']);
        if (false === $source) {
            throw new Twig_Error_Loader(sprintf('Could not load remote template "%s"', $name));
        }

        // convert placeholders to blocks
        $source = $this->placeholdersToBlocks($this->templates[$name]['blocks'], $source);

        // add metadata variable
        $metadata = $this->getMetadata($name);
        $source = sprintf('{%% set _remote = %s %%}', json_encode($metadata)) . $source;

        return $source;
    }

    /**
     * Gets the cache key to use for the cache for a given template name.
     *
     * @param string $name The name of the template to load
     *
     * @return string The cache key
     *
     * @throws \Twig_Error_Loader When $name is not found
     */
    public function getCacheKey($name)
    {
        $this->ensureExists($name);

        return $name;
    }

    /**
     * Returns true if the template is still fresh.
     *
     * @param string $name The template name
     * @param timestamp $time The last modification time of the cached template
     *
     * @return Boolean true if the template is fresh, false otherwise
     *
     * @throws \Twig_Error_Loader When $name is not found
     */
    public function isFresh($name, $time)
    {
        $this->ensureExists($name);

        return time() - $time < $this->templates[$name]['ttl'];
    }

    /**
     * Make sure the given template is a known remote template
     *
     * @param string $name
     * @throws Twig_Error_loader
     */
    private function ensureExists($name)
    {
        if (!$this->exists($name)) {
            throw new Twig_Error_Loader(sprintf('Template "%s" is not a known remote template', $name));
        }
    }

    /**
     * Convert placeholders to blocks in the source
     *
     * @param array  $blocks
     * @param string $source
     * @return string
     */
    private function placeholdersToBlocks(array $blocks, $source)
    {
        $usedBlockMap = array();
        $placeholderToBlockMap = array();

        $pattern = '';
        $first = true;
        foreach ($blocks as $blockName => $block) {
            $first ? $first = false : $pattern .= '|';
            $pattern .= preg_quote($block['placeholder'], '/');
            
            $placeholderToBlockMap[$block['placeholder']] = $blockName;
        }

        return preg_replace_callback(
            sprintf('/(%s)/', $pattern),
            function (array $match) use ($placeholderToBlockMap, &$usedBlockMap) {
                $blockName = $placeholderToBlockMap[$match[0]];

                if (isset($usedBlockMap[$blockName])) {
                    return $this->createRepeatedPlaceholderBlockSyntax($blockName);
                } else {
                    $usedBlockMap[$blockName] = true;

                    return $this->createPlaceholderBlockSyntax($blockName);
                }
            },
            $source
        );
    }

    /**
     * Create placeholder block syntax
     *
     * @param string $blockName
     * @return string
     */
    private function createPlaceholderBlockSyntax($blockName)
    {
        return sprintf('{%% block %s %%}{%% endblock %%}', $blockName);
    }

    /**
     * Create repeated placeholder block syntax
     *
     * @param string $blockName
     * @return string
     */
    private function createRepeatedPlaceholderBlockSyntax($blockName)
    {
        return sprintf('{{ block("%s") }}', $blockName);
    }

    /**
     * Get template metadata array
     *
     * @param string $name template name
     * @return string
     */
    private function getMetadata($name)
    {
        $this->ensureExists($name);

        return
            array('url' => $this->templates[$name]['url'])
            + $this->templates[$name]['metadata']
        ;
    }
}