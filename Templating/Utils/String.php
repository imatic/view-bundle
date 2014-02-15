<?php
namespace Imatic\Bundle\ViewBundle\Templating\Util;

class String
{
    /**
     * @param string $string
     * @return string
     */
    public static function escape($string)
    {
        return htmlspecialchars($string, ENT_QUOTES);
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
}