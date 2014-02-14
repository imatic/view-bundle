<?php

namespace Imatic\Bundle\ViewBundle\Templating\Helper\Format;

class FormatHelper implements FormatterInterface
{
    /**
     * @var FormatterInterface[]
     */
    private $formatters;

    public function __construct()
    {
        $this->formatters = [];
    }

    public function addFormatter($name, FormatterInterface $formatter)
    {
        $this->formatters[$name] = $formatter;
    }

    public function format($value, $format, array $options = [])
    {
        if (array_key_exists($format, $this->formatters)) {
            return $this->formatters[$format]->format($value, $format, $options);
        }

        throw new \InvalidArgumentException(sprintf('Formatter "%s" not found', $format));
    }
}