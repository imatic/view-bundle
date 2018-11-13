<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Tests\Templating\Utils;

use Imatic\Bundle\ViewBundle\Templating\Helper\Html\ClassCollection;
use PHPUnit\Framework\TestCase;

class ClassCollectionTest extends TestCase
{
    public function testConstructorAdd()
    {
        $classes = new ClassCollection(['aa', 'bb', 'cc']);

        $this->assertEquals('class="aa bb cc"', $classes->render());
    }

    public function testAddOneClass()
    {
        $classes = new ClassCollection();
        $classes->add('uuu');

        $this->assertEquals('class="uuu"', $classes->render());
    }

    public function testAddMultipleClassesAndRemoveOne()
    {
        $classes = new ClassCollection();
        $classes->add('a b c');
        $classes->remove('b');

        $this->assertEquals('class="a c"', $classes->render());
    }

    public function testAddArrayOfClasses()
    {
        $classes = new ClassCollection();
        $classes->add(['d', 'e', 'f']);

        $this->assertEquals('class="d e f"', $classes->render());
    }
}
