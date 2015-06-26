<?php
namespace Imatic\Bundle\ViewBundle\Tests\Util;

use Imatic\Bundle\ViewBundle\Util\Html;

class HtmlTest extends \PHPUnit_Framework_TestCase
{
    public function testClassName()
    {
        $this->assertEquals(
            'lorem ipsum',
            Html::className(['lorem' => true, 'foo' => false, 'ipsum' => true, 'bar' => false])
        );
    }
}
