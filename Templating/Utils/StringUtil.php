<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Templating\Utils;

class StringUtil
{
    /**
     * Escape a string for use in HTML 5 code.
     *
     * @param string $string
     *
     * @return string
     */
    public static function escape($string)
    {
        return \htmlspecialchars((string) $string, ENT_HTML5 | ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }

    /**
     * Unescape a HTML 5 encoded string.
     *
     * @param string $html
     *
     * @return string
     */
    public static function unescape($html)
    {
        return \htmlspecialchars_decode($html, ENT_HTML5 | ENT_QUOTES);
    }

    /**
     * @param string $string
     *
     * @return string
     */
    public static function slugify($string)
    {
        $slug = \preg_replace('~[^\\pL0-9_]+~u', '-', \trim($string, '-'));
        $slug = \iconv('utf-8', 'us-ascii//TRANSLIT', $slug);
        $slug = \preg_replace('~[^-a-z0-9_]+~', '', \strtolower($slug));

        return $slug;
    }

    /**
     * @param string $string
     *
     * @return string
     */
    public static function humanize($string)
    {
        return \ucfirst(\trim(\strtolower(\preg_replace(['/([A-Z])/', '/[_\s]+/'], ['_$1', ' '], $string))));
    }
}
