<?php
namespace Imatic\Bundle\ViewBundle\Util;

class Html
{
    /**
     * @param bool[] $classes
     * @return string
     */
    public static function className(array $classes)
    {
        return implode(' ', array_keys(array_filter($classes)));
    }
}