<?php
namespace Imatic\Bundle\ViewBundle\Tests\Integration\Twig\Extension;

use Imatic\Bundle\ViewBundle\Tests\Fixtures\TestProject\WebTestCase;

class FormatExtensionTest extends WebTestCase
{
    protected function setUp()
    {
        static::createClient();
    }

    /**
     * @dataProvider imaticViewFormatProvider
     */
    public function testImaticViewFormat($expectedResult, $template)
    {
        $this->assertSame(
            $expectedResult,
            $this->getTwig()->render($template)
        );
    }

    public function imaticViewFormatProvider()
    {
        return [
            [
                '5',
                'AppImaticViewBundle:FormatExtension:imatic_view_format/number.html.twig',
            ],
            [
                '&lt;b&gt;bold&lt;/b&gt;',
                'AppImaticViewBundle:FormatExtension:imatic_view_format/html.html.twig',
            ],
        ];
    }

    /**
     * @return \Twig_Environment
     */
    private function getTwig()
    {
        return self::$container->get('twig');
    }
}
