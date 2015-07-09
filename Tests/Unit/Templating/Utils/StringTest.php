<?php
namespace Imatic\Bundle\ViewBundle\Tests\Templating\Utils;

use Imatic\Bundle\ViewBundle\Templating\Utils\String;

class StringTest extends \PHPUnit_Framework_TestCase
{
    public function testEscape()
    {
        $this->assertEquals(
            '&lt;a href=&quot;test&quot;&gt;test&lt;/a&gt;',
            String::escape('<a href="test">test</a>')
        );
    }

    public function testSlugify()
    {
        $this->assertEquals('lorem-ipsum', String::slugify('lorem ipsum'));
        $this->assertEquals('internationalization', String::slugify('Iñtërnâtiônàlizátiøn'));
    }

    public function testHumanize()
    {
        $this->assertEquals('Lorem ipsum', String::humanize('loremIpsum'));
        $this->assertEquals('Foo bar', String::humanize('foo_bar'));
    }
}
