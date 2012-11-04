<?php

namespace Imatic\Bundle\ViewBundle\Util;

class String
{
    public static function escape($string)
    {
        return htmlspecialchars($string, ENT_QUOTES);
    }
}
