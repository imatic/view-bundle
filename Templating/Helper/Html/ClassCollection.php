<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Templating\Helper\Html;

use Imatic\Bundle\ViewBundle\Templating\Utils\StringUtil;

class ClassCollection extends AbstractCollection
{
    protected $classes;

    public function __construct(array $classes = [])
    {
        foreach ($classes as $value) {
            $this->add($value);
        }
    }

    public function add($name)
    {
        if (\is_string($name)) {
            $name = \explode(' ', $name);
        }

        foreach ($name as $class) {
            $this->classes[$class] = $class;
        }
    }

    public function get($name)
    {
        throw new \LogicException('Cannot call get on ClassCollection');
    }

    public function set($name, $value)
    {
        throw new \LogicException('Cannot call set on ClassCollection');
    }

    public function has($name)
    {
        return \array_key_exists($name, $this->classes);
    }

    public function remove($name)
    {
        unset($this->classes[$name]);
    }

    public function render()
    {
        return $this->classes ? 'class="' . StringUtil::escape(\implode(' ', $this->classes)) . '"' : '';
    }
}
