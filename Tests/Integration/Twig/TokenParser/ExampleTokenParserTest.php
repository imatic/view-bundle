<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Tests\Integration\Twig\TokenParser;

use Imatic\Bundle\ViewBundle\Tests\Fixtures\TestProject\WebTestCase;

class ExampleTokenParserTest extends WebTestCase
{
    protected function setUp(): void
    {
        static::createClient();
    }

    public function testExample()
    {
        $this->assertSame(
            <<<'HTML'
<div class="example"><div class="preview"><div data-role="container">
    I am a container
</div>
</div><pre class="source django"><code>&lt;div data-role=&quot;container&quot;&gt;
    I am a container
&lt;/div&gt;
</code></pre></div>
HTML
            ,
            $this->getTwig()->render('@AppImaticView/TokenParser/exampleTokenParser.html.twig')
        );
    }

    /**
     * @return \Twig_Environment
     */
    private function getTwig()
    {
        return self::$container->get('twig');
    }
}
