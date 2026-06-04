<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Tests\Integration\Twig\Extension;

use Imatic\Bundle\ViewBundle\Tests\Fixtures\TestProject\WebTestCase;
use PHPUnit\Framework\Attributes\DataProvider;

class FormatExtensionTest extends WebTestCase
{
    protected function setUp(): void
    {
        static::createClient();
    }

    #[DataProvider('imaticViewFormatProvider')]
    public function testImaticViewFormat($expectedResult, $template)
    {
        $this->assertSame(
            $expectedResult,
            $this->getTwig()->render($template)
        );
    }

    public static function imaticViewFormatProvider()
    {
        return [
            [
                '5',
                '@AppImaticView/FormatExtension/imatic_view_format/number.html.twig',
            ],
            [
                '&lt;b&gt;bold&lt;/b&gt;',
                '@AppImaticView/FormatExtension/imatic_view_format/html.html.twig',
            ],
        ];
    }

    /**
     * @return \Twig_Environment
     */
    private function getTwig()
    {
        return self::getContainer()->get('twig');
    }
}
