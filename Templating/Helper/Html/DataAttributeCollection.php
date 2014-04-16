<?php

namespace Imatic\Bundle\ViewBundle\Templating\Helper\Html;

class DataAttributeCollection extends AttributeCollection
{
    public function render()
    {
        return $this->attributes ? implode(' ', array_map(function ($k, $v) {
            return sprintf('data-%s="%s"', $k, $v);
        }, array_keys($this->attributes), $this->attributes)) : '';
    }
}
