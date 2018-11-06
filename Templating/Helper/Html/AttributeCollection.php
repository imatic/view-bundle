<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Templating\Helper\Html;

use Imatic\Bundle\ViewBundle\Templating\Utils\StringUtil;

class AttributeCollection extends AbstractCollection
{
    protected $attributes;

    public function __construct(array $attributes = [])
    {
        foreach ($attributes as $name => $value) {
            $this->set($name, $value);
        }
    }

    public function get($name)
    {
        if ($this->has($name)) {
            return $this->attributes[$name];
        }

        return '';
    }

    public function set($name, $value)
    {
        if (\is_array($value)) {
            $value = \implode(' ', $value);
        }
        if (\is_bool($value)) {
            if ($value) {
                $value = $name;
            } else {
                $this->remove($name);

                return;
            }
        }
        $this->attributes[$name] = $value;
    }

    public function has($name)
    {
        return \array_key_exists($name, $this->attributes);
    }

    public function remove($name)
    {
        unset($this->attributes[$name]);
    }

    public function render()
    {
        return $this->attributes ? \implode(' ', \array_map(function ($k, $v) {
            return \sprintf('%s="%s"', $k, StringUtil::escape($v));
        }, \array_keys($this->attributes), $this->attributes)) : '';
    }
}
