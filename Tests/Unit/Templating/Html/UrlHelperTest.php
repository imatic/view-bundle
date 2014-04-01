<?php
namespace Imatic\Bundle\ViewBundle\Tests\Templating\Utils;

use Imatic\Bundle\ViewBundle\Templating\Helper\Html\UrlHelper;

class UrlHelperTest extends \PHPUnit_Framework_TestCase
{
    private $testUrl = 'https://www.example.com/path/file.html?param1=value1&param2[sub1]=valueSub1&param2[sub2]=valueSub2';

    public function testBuildUrlWithArrayOrParameters()
    {
        $htmlHelper = new UrlHelper();

        $components = [
            'scheme' => 'https',
            'host' => 'www.example.com',
            'path' => '/path/file.html',
            'query' => ['param1' => 'value1', 'param2' => ['sub1' => 'valueSub1', 'sub2' => 'valueSub2']]
        ];
        $result = $htmlHelper->buildUrl($components);

        $this->assertEquals($this->testUrl, $result);
    }

    public function testBuildUrlWithStringParameters()
    {
        $htmlHelper = new UrlHelper();

        $components = [
            'scheme' => 'https',
            'host' => 'www.example.com',
            'path' => '/path/file.html',
            'query' => 'param1=value1&param2[sub1]=valueSub1&param2[sub2]=valueSub2'
        ];
        $result = $htmlHelper->buildUrl($components);

        $this->assertEquals($this->testUrl, $result);
    }

    public function testParseUrlParseQueryString()
    {
        $htmlHelper = new UrlHelper();

        $result = $htmlHelper->parseUrl($this->testUrl);

        $this->assertInternalType('array', $result['query']);
        $this->assertArrayHasKey('param1', $result['query']);
        $this->assertEquals('value1', $result['query']['param1']);
    }

    public function testUpdateUrlUpdatesNothingWithEmptyComponents()
    {
        $htmlHelper = new UrlHelper();

        $result = $htmlHelper->updateUrl($this->testUrl, []);

        $this->assertEquals($this->testUrl, $result);
    }

    public function testUpdateUrlUpdatesDomain()
    {
        $htmlHelper = new UrlHelper();

        $result = $htmlHelper->updateUrl($this->testUrl, ['host' => 'example.cz']);
        $expected = 'https://example.cz/path/file.html?param1=value1&param2[sub1]=valueSub1&param2[sub2]=valueSub2';

        $this->assertEquals($expected, $result);
    }

    public function testUpdateUrlUpdatesParameter()
    {
        $htmlHelper = new UrlHelper();

        $result = $htmlHelper->updateUrl($this->testUrl, ['query' => ['param1' => 'anotherValue']]);
        $expected = 'https://www.example.com/path/file.html?param1=anotherValue&param2[sub1]=valueSub1&param2[sub2]=valueSub2';

        $this->assertEquals($expected, $result);
    }

    public function testUpdateUrlUpdatesNestedParameter()
    {
        $htmlHelper = new UrlHelper();

        $result = $htmlHelper->updateUrl($this->testUrl, ['query' => ['param2' => ['sub1' => 'anotherSubParameter']]]);
        $expected = 'https://www.example.com/path/file.html?param1=value1&param2[sub1]=anotherSubParameter&param2[sub2]=valueSub2';

        $this->assertEquals($expected, $result);
    }

    public function testUpdateUrlRemovesParameter()
    {
        $htmlHelper = new UrlHelper();

        $result = $htmlHelper->updateUrl($this->testUrl, ['query' => ['param2' => null]]);
        $expected = 'https://www.example.com/path/file.html?param1=value1';

        $this->assertEquals($expected, $result);
    }
}
