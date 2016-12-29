<?php

namespace Imatic\Bundle\ViewBundle\Tests\Templating\Utils;

use Imatic\Bundle\ViewBundle\Templating\Helper\Html\AttributeCollection;

class AttributeCollectionTest extends \PHPUnit_Framework_TestCase
{
    public function testConstructorSet()
    {
        $attributes = new AttributeCollection(['name' => 'John', 'age' => 30]);

        $this->assertEquals('name="John" age="30"', $attributes->render());
    }

    public function testSet()
    {
        $attributes = new AttributeCollection();
        $attributes->name = 'Andy';

        $this->assertEquals('name="Andy"', $attributes->render());
    }

    public function testGet()
    {
        $attributes = new AttributeCollection();
        $attributes->name = 'Andy';

        $this->assertEquals('Andy', $attributes->name);
    }

    public function testHas()
    {
        $attributes = new AttributeCollection();
        $attributes->name = 'Andy';

        $this->assertEquals(true, isset($attributes->name));
    }

    public function testRemove()
    {
        $attributes = new AttributeCollection();
        $attributes->name = 'Andy';

        $this->assertEquals(true, isset($attributes->name));

        unset($attributes->name);

        $this->assertEquals(false, isset($attributes->name));
    }
}
