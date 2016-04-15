<?php

namespace Imatic\Bundle\ViewBundle\Templating\Utils;

class StringUtil
{
    /**
     * @param string $string
     * @return string
     */
    public static function escape($string)
    {
        return htmlspecialchars($string, ENT_QUOTES, 'UTF-8');
    }

    /**
     * @param string $string
     * @return string
     */
    public static function slugify($string)
    {
        $slug = preg_replace('~[^\\pL0-9_]+~u', '-', trim($string, '-'));
        $slug = iconv('utf-8', 'us-ascii//TRANSLIT', $slug);
        $slug = preg_replace('~[^-a-z0-9_]+~', '', strtolower($slug));

        return $slug;
    }

    /**
     * @param string $string
     * @return string
     */
    public static function humanize($string)
    {
        return ucfirst(trim(strtolower(preg_replace(array('/([A-Z])/', '/[_\s]+/'), array('_$1', ' '), $string))));
    }
}
