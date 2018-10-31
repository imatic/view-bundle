<?php
namespace Imatic\Bundle\ViewBundle\Tests\Unit\Templating\Helper\Format;

use Imatic\Bundle\ViewBundle\Templating\Helper\Format\FormatHelper;
use PHPUnit\Framework\TestCase;
use stdClass;

class FormatHelperTest extends TestCase
{
    private $formatHelper;

    protected function setUp()
    {
        $container = $this->createMock('Symfony\Component\DependencyInjection\ContainerInterface');

        $formatter = $this->createMock('Imatic\Bundle\ViewBundle\Templating\Helper\Format\FormatterInterface');
        $formatter->expects($this->any())
            ->method('format')
            ->willReturnCallback(function ($value) {
                return $value;
            });

        $this->formatHelper = new FormatHelper($container);
        $this->formatHelper->addFormatter('text', $formatter);
    }

    public function testRenderValueShouldWorkWithArrays()
    {
        $data = [
            'name' => 'jmeno',
            'surname' => 'prijmeni',
        ];

        $this->assertEquals('jmeno', $this->formatHelper->renderValue($data, 'name'));
        $this->assertEquals('jmeno', $this->formatHelper->renderValue($data, '[name]'));
    }

    public function testRenderValueShouldWorkWithObjects()
    {
        $data = new stdClass();
        $data->name = 'jmeno';
        $data->surname = 'prijmeni';

        $this->assertEquals('jmeno', $this->formatHelper->renderValue($data, 'name'));
    }
}
