<?php
namespace Imatic\Bundle\ViewBundle\Tests\Templating\Utils;

use Imatic\Bundle\ViewBundle\Templating\Utils\StringUtil;
use PHPUnit\Framework\TestCase;

class StringUtilTest extends TestCase
{
    public function testEscape()
    {
        $this->assertEquals(
            '&lt;a href=&quot;test&quot;&gt;test&lt;/a&gt;',
            StringUtil::escape('<a href="test">test</a>')
        );
    }

    public function testSlugify()
    {
        $this->assertEquals('lorem-ipsum', StringUtil::slugify('lorem ipsum'));
        $this->assertEquals('internationalization', StringUtil::slugify('Iñtërnâtiônàlizátión'));
    }

    public function testHumanize()
    {
        $this->assertEquals('Lorem ipsum', StringUtil::humanize('loremIpsum'));
        $this->assertEquals('Foo bar', StringUtil::humanize('foo_bar'));
    }
}
