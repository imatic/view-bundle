<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Templating\Helper\Format;

interface FormatterInterface
{
    /**
     * @param mixed  $value
     * @param string $format
     * @param array  $options
     *
     * @return string|null
     */
    public function format($value, $format, array $options = []);
}
