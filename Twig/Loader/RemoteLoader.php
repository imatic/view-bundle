<?php

namespace Imatic\Bundle\ViewBundle\Twig\Loader;

class RemoteLoader implements \Twig_LoaderInterface
{
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
        return "{{ 'template' | upper() }} " . $name . "!";
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
        return true;
    }
}