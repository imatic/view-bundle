<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Templating\Helper\Html;

use Imatic\Bundle\ViewBundle\Templating\Utils\StringUtil;

class HtmlElement
{
    protected static $emptyElements = ['img' => 1, 'hr' => 1, 'br' => 1, 'input' => 1, 'meta' => 1, 'area' => 1, 'embed' => 1, 'keygen' => 1,
        'source' => 1, 'base' => 1, 'col' => 1, 'link' => 1, 'param' => 1, 'basefont' => 1, 'frame' => 1, 'isindex' => 1, 'wbr' => 1, 'command' => 1, 'track' => 1, ];

    /**
     * @var ClassCollection
     */
    protected $classes;

    /**
     * @var DataAttributeCollection
     */
    protected $data;

    /**
     * @var AttributeCollection
     */
    protected $attributes;

    /**
     * @var string
     */
    protected $name;

    /**
     * @var mixed
     */
    protected $value;

    public function __construct($name, $value = null, array $attributes = [])
    {
        $this->setValue($value);
        $this->name = \trim($name);
        $this->attributes = new AttributeCollection($attributes);
        $this->classes = new ClassCollection();
        $this->data = new DataAttributeCollection();
    }

    public function create($name, $value = null, array $attributes = [])
    {
        return new static($name, $value, $attributes);
    }

    public function setValue($value)
    {
        $this->value = $value;
    }

    public function getValue()
    {
        return $this->value;
    }

    public function render()
    {
        $elementString = \trim(\implode(' ', [$this->attributes, $this->classes, $this->data]));
        $elementString = \strlen($elementString) ? ' ' . $elementString : $elementString;

        if ($this->value || !isset(self::$emptyElements[$this->name])) {
            return \sprintf('<%s%s>%s</%s>', $this->name, $elementString, StringUtil::escape($this->value), $this->name);
        }
        return \sprintf('<%s%s>', $this->name, $elementString);
    }

    public function __get($name)
    {
        return $this->attributes->$name;
    }

    public function __set($name, $value)
    {
        $this->attributes->$name = $value;
    }

    public function classes()
    {
        return $this->classes;
    }

    public function data()
    {
        return $this->data;
    }

    public function __toString()
    {
        return (string) $this->render();
    }
}
