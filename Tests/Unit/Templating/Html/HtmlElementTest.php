<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Tests\Templating\Utils;

use Imatic\Bundle\ViewBundle\Templating\Helper\Html\HtmlElement;
use PHPUnit\Framework\TestCase;

class HtmlElementTest extends TestCase
{
    public function testSimplePairRender()
    {
        $element = new HtmlElement('a');

        $this->assertEquals('<a></a>', $element->render());
    }

    public function testSimpleUnpairRender()
    {
        $element = new HtmlElement('img');

        $this->assertEquals('<img>', $element->render());
    }

    public function testCtorAttributeRender()
    {
        $element = new HtmlElement('a', 'text', ['href' => 'index.html', 'title' => 'Index']);

        $this->assertEquals('<a href="index.html" title="Index">text</a>', $element->render());
    }

    public function testFull()
    {
        $element = new HtmlElement('a');
        $element->href = 'test.html';
        $element->classes()->add('aa bb');
        $element->data()->set('target', 'modal');

        $this->assertEquals('<a href="test.html" class="aa bb" data-target="modal"></a>', $element->render());
    }
}
