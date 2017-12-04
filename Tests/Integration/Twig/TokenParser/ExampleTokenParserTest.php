<?php
namespace Imatic\Bundle\ViewBundle\Tests\Integration\Twig\TokenParser;

use Imatic\Bundle\ViewBundle\Tests\Fixtures\TestProject\WebTestCase;

class ExampleTokenParserTest extends WebTestCase
{
    private $container;

    protected function setUp()
    {
        parent::setUp();
        $this->container = static::createClient()->getContainer();
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
            $this->getTwig()->render('AppImaticViewBundle:TokenParser:exampleTokenParser.html.twig')
        );
    }

    /**
     * @return \Twig_Environment
     */
    private function getTwig()
    {
        return $this->container->get('twig');
    }
}
