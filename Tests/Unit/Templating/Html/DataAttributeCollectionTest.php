<?php
namespace Imatic\Bundle\ViewBundle\Tests\Templating\Utils;

use Imatic\Bundle\ViewBundle\Templating\Helper\Html\DataAttributeCollection;

class DataAttributeCollectionTest extends \PHPUnit_Framework_TestCase
{
    public function testConstructorSet()
    {
        $attributes = new DataAttributeCollection(['name' => 'John', 'age' => 30]);

        $this->assertEquals('data-name="John" data-age="30"', $attributes->render());
    }
}
