<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Tests\Templating\Utils;

use Imatic\Bundle\ViewBundle\Templating\Helper\Html\UrlHelper;
use PHPUnit\Framework\TestCase;

class UrlHelperTest extends TestCase
{
    private $testUrl = 'https://www.example.com/path/file.html?param1=value1&param2%5Bsub1%5D=valueSub1&param2%5Bsub2%5D=valueSub2';

    public function testBuildUrlWithArrayOrParameters()
    {
        $urlHelper = new UrlHelper();

        $components = [
            'scheme' => 'https',
            'host' => 'www.example.com',
            'path' => '/path/file.html',
            'query' => ['param1' => 'value1', 'param2' => ['sub1' => 'valueSub1', 'sub2' => 'valueSub2']],
        ];
        $result = $urlHelper->buildUrl($components);

        $this->assertEquals($this->testUrl, $result);
    }

    public function testBuildUrlWithStringParameters()
    {
        $urlHelper = new UrlHelper();

        $components = [
            'scheme' => 'https',
            'host' => 'www.example.com',
            'path' => '/path/file.html',
            'query' => 'param1=value1&param2%5Bsub1%5D=valueSub1&param2%5Bsub2%5D=valueSub2',
        ];
        $result = $urlHelper->buildUrl($components);

        $this->assertEquals($this->testUrl, $result);
    }

    public function testParseUrlParseQueryString()
    {
        $urlHelper = new UrlHelper();

        $result = $urlHelper->parseUrl($this->testUrl);

        $this->assertIsArray($result['query']);
        $this->assertArrayHasKey('param1', $result['query']);
        $this->assertEquals('value1', $result['query']['param1']);
    }

    public function testUpdateUrlUpdatesNothingWithEmptyComponents()
    {
        $urlHelper = new UrlHelper();

        $result = $urlHelper->updateUrl($this->testUrl, []);

        $this->assertEquals($this->testUrl, $result);
    }

    public function testUpdateUrlUpdatesDomain()
    {
        $urlHelper = new UrlHelper();

        $result = $urlHelper->updateUrl($this->testUrl, ['host' => 'example.cz']);
        $expected = 'https://example.cz/path/file.html?param1=value1&param2%5Bsub1%5D=valueSub1&param2%5Bsub2%5D=valueSub2';

        $this->assertEquals($expected, $result);
    }

    public function testUpdateUrlUpdatesParameter()
    {
        $urlHelper = new UrlHelper();

        $result = $urlHelper->updateUrl($this->testUrl, ['query' => ['param1' => 'anotherValue']]);
        $expected = 'https://www.example.com/path/file.html?param1=anotherValue&param2%5Bsub1%5D=valueSub1&param2%5Bsub2%5D=valueSub2';

        $this->assertEquals($expected, $result);
    }

    public function testUpdateUrlUpdatesNestedParameter()
    {
        $urlHelper = new UrlHelper();

        $result = $urlHelper->updateUrl($this->testUrl, ['query' => ['param2' => ['sub1' => 'anotherSubParameter']]]);
        $expected = 'https://www.example.com/path/file.html?param1=value1&param2%5Bsub1%5D=anotherSubParameter&param2%5Bsub2%5D=valueSub2';

        $this->assertEquals($expected, $result);
    }

    public function testUpdateUrlRemovesParameter()
    {
        $urlHelper = new UrlHelper();

        $result = $urlHelper->updateUrl($this->testUrl, ['query' => ['param2' => null]]);
        $expected = 'https://www.example.com/path/file.html?param1=value1';

        $this->assertEquals($expected, $result);
    }
}
