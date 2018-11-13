<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Templating\Helper\Html;

abstract class AbstractCollection implements \ArrayAccess
{
    abstract public function get($name);

    abstract public function set($name, $value);

    abstract public function has($name);

    abstract public function remove($name);

    abstract public function render();

    public function __get($name)
    {
        return $this->get($name);
    }

    public function __set($name, $value)
    {
        return $this->set($name, $value);
    }

    public function __isset($name)
    {
        return $this->has($name);
    }

    public function __unset($name)
    {
        return $this->remove($name);
    }

    public function offsetExists($name)
    {
        return $this->has($name);
    }

    public function offsetGet($name)
    {
        return $this->get($name);
    }

    public function offsetSet($name, $value)
    {
        return $this->set($name, $value);
    }

    public function offsetUnset($name)
    {
        return $this->remove($name);
    }

    public function __toString()
    {
        return (string) $this->render();
    }
}
