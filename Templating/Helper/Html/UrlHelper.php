<?php

namespace Imatic\Bundle\ViewBundle\Templating\Helper\Html;

class UrlHelper
{
    public function updateUrl($url, array $components)
    {
        $parsedUrl = $this->parseUrl($url);

        $merged = array_replace_recursive($parsedUrl, $components);

        return $this->buildUrl($merged);
    }

    public function updateSorterUrl($url, $column, $direction)
    {
        $column = $this->fixColumn($column);

        // reset previous sorter
        $url = $this->updateUrl($url, ['query' => ['sorter' => null, 'page' => null]]);

        return $this->updateUrl($url, ['query' => ['sorter' => [$column => $direction]]]);
    }

    public function updateFilterUrl($url)
    {
        return $this->updateUrl($url, ['query' => ['filter' => null, 'page' => 1]]);
    }

    public function updatePagerUrl($url, $page)
    {
        return $this->updateUrl($url, ['query' => ['page' => $page]]);
    }

    public function parseUrl($url)
    {
        $components = parse_url($url);
        if (isset($components['query'])) {
            $qs = $components['query'];
            parse_str($qs, $components['query']);
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
        $query = isset($components['query']) ? '?' . (is_array($components['query']) ? urldecode(http_build_query($components['query'])) : $components['query']) : '';
        $fragment = isset($components['fragment']) ? '#' . $components['fragment'] : '';

        return $scheme . $user . $pass . $host . $port . $path . $query . $fragment;
    }

    private function fixColumn($column)
    {
        return trim($column, '[]');
    }
}
