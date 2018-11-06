<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Tests\Templating\Utils;

use Imatic\Bundle\ViewBundle\Templating\Helper\Html\DataAttributeCollection;
use PHPUnit\Framework\TestCase;

class DataAttributeCollectionTest extends TestCase
{
    public function testConstructorSet()
    {
        $attributes = new DataAttributeCollection(['name' => 'John', 'age' => 30]);

        $this->assertEquals('data-name="John" data-age="30"', $attributes->render());
    }
}
