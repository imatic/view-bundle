<?php

namespace Imatic\Bundle\ViewBundle\Templating\Helper\Format;

interface FormatterInterface
{
    public function format($value, $format, array $options = []);
}