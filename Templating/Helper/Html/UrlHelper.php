<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Templating\Helper\Html;

class UrlHelper
{
    public function updateUrl($url, array $components)
    {
        $parsedUrl = $this->parseUrl($url);

        $merged = \array_replace_recursive($parsedUrl, $components);

        return $this->buildUrl($merged);
    }

    public function updateSorterUrl($url, $column, $direction, $componentId = null)
    {
        $column = $this->fixColumn($column);

        // reset previous sorter
        $url = $this->updateUrl($url, [
            'query' => $this->buildQueryArray(
                ['sorter' => null, 'page' => null],
                $componentId
            ),
        ]);

        return $this->updateUrl($url, [
            'query' => $this->buildQueryArray(
                ['sorter' => [$column => $direction]],
                $componentId
            ),
        ]);
    }

    public function updateFilterUrl($url, $componentId = null)
    {
        return $this->updateUrl($url, [
            'query' => $this->buildQueryArray(
                ['filter' => null, 'page' => 1],
                $componentId
            ),
        ]);
    }

    public function updatePagerUrl($url, $page, $componentId = null)
    {
        return $this->updateUrl($url, [
            'query' => $this->buildQueryArray(
                ['page' => $page],
                $componentId
            ),
        ]);
    }

    public function parseUrl($url)
    {
        $components = \parse_url($url);
        if (isset($components['query'])) {
            \parse_str($components['query'], $components['query']);
        }

        return $components;
    }

    public function buildUrl($components)
    {
        $scheme = isset($components['scheme']) ? $components['scheme'] . '://' : '';
        $host = isset($components['host']) ? $components['host'] : '';
        $port = isset($components['port']) ? ':' . $components['port'] : '';
        $user = isset($components['user']) ? $components['user'] : '';
        $pass = isset($components['pass']) ? ':' . $components['pass'] : '';
        $pass = ($user || $pass) ? "$pass@" : '';
        $path = isset($components['path']) ? $components['path'] : '';
        $query = isset($components['query']) ? '?' . (\is_array($components['query']) ? \http_build_query($components['query']) : $components['query']) : '';
        $fragment = isset($components['fragment']) ? '#' . $components['fragment'] : '';

        return $scheme . $user . $pass . $host . $port . $path . $query . $fragment;
    }

    private function buildQueryArray(array $query, $componentId = null)
    {
        return null !== $componentId ? [$componentId => $query] : $query;
    }

    private function fixColumn($column)
    {
        return \trim($column, '[]');
    }
}
