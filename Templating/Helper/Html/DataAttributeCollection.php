<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Templating\Helper\Html;

use Imatic\Bundle\ViewBundle\Templating\Utils\StringUtil;

class DataAttributeCollection extends AttributeCollection
{
    public function render()
    {
        return $this->attributes ? \implode(' ', \array_map(function ($k, $v) {
            return \sprintf('data-%s="%s"', $k, StringUtil::escape($v));
        }, \array_keys($this->attributes), $this->attributes)) : '';
    }
}
