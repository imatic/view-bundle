<?php

namespace Imatic\Bundle\ViewBundle\Templating\Helper\Format;

class TwigFormatter implements FormatterInterface
{
    /**
     * @var \Twig_Environment
     */
    private $twig;

    public function __construct(\Twig_Environment $twig)
    {
        $this->twig = $twig;
    }

    public function format($value, $format, array $options = [])
    {
        $method = 'format' . ucfirst($format);

        return $this->$method($value, $options);
    }

    protected function formatDate($value, array $options)
    {
        if ($value === null) {
            return null;
        }

        return twig_date_format_filter(
            $this->twig,
            $value,
//            $this->getOption($options, 'format'),
            'd.m.Y',
            $this->getOption($options, 'timezone')
        );
    }

    protected function formatDateTime($value, array $options)
    {
        if ($value === null) {
            return null;
        }

        return twig_date_format_filter(
            $this->twig,
            $value,
//            $this->getOption($options, 'format'),
            'd.m.Y H:i:s',
            $this->getOption($options, 'timezone')
        );
    }

    protected function formatTime($value, array $options)
    {
        if ($value === null) {
            return null;
        }

        return twig_date_format_filter(
            $this->twig,
            $value,
//            $this->getOption($options, 'format'),
            'H:i:s',
            $this->getOption($options, 'timezone')
        );
    }

    protected function formatNumber($value, array $options)
    {
        if ($value === null) {
            return null;
        }

        return twig_number_format_filter(
            $this->twig,
            $value,
            $this->getOption($options, 'decimal'),
            $this->getOption($options, 'decimalPoint'),
            $this->getOption($options, 'thousandSep')
        );
    }

    protected function getOption($options, $option)
    {
        return array_key_exists($option, $options) ? $options[$option] : null;
    }
}
