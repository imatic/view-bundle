<?php declare(strict_types=1);
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
        // https://travis-ci.org/imatic/view-bundle/builds/451436649?utm_source=github_status&utm_medium=notification
        $this->markTestSkipped('Does not work with Travis');

        $this->assertEquals('lorem-ipsum', StringUtil::slugify('lorem ipsum'));
        $this->assertEquals('internationalization', StringUtil::slugify('Iñtërnâtiônàlizátión'));
    }

    public function testHumanize()
    {
        $this->assertEquals('Lorem ipsum', StringUtil::humanize('loremIpsum'));
        $this->assertEquals('Foo bar', StringUtil::humanize('foo_bar'));
    }
}
