<?php

namespace Imatic\Bundle\ViewBundle\Templating\Helper\Format;

use Symfony\Component\Translation\TranslatorInterface;

class CommonFormatter implements FormatterInterface
{
    /**
     * @var TranslatorInterface
     */
    private $translator;

    public function __construct(TranslatorInterface $translator)
    {
        $this->translator = $translator;
    }

    public function format($value, $format, array $options = [])
    {
        $method = 'format' . ucfirst($format);

        return $this->$method($value, $options);
    }

    public function formatText($value, array $options = [])
    {
        if (isset($options['convert_newlines']) && $options['convert_newlines']) {
            return nl2br($value);
        }

        return $value;
    }

    public function formatPhone($value, array $options = [])
    {
        if ($value === null) {
            return null;
        }

        return sprintf('<a href="callto:%s">%s</a>', $value, $value);
    }

    public function formatEmail($value, array $options = [])
    {
        if ($value === null) {
            return null;
        }

        if (isset($options['text'])) {
            $text = $options['text'];
        } else {
            $text = $value;
        }

        return sprintf('<a href="mailto:%s">%s</a>', $value, $text);
    }

    public function formatUrl($value, array $options = [])
    {
        if ($value === null) {
            return null;
        }

        return sprintf('<a href="%s">%s</a>', $value, $value);
    }

    public function formatBoolean($value, array $options = [])
    {
        if ($value === null) {
            return null;
        }

        $key = $value ? 'yes' : 'no';
        $text = $this->translator->trans($key, [], 'ImaticViewBundle');

        return sprintf('<span title="%s" class="%s"></span>', $text, $key);
    }

    public function formatLink($value, array $options = [])
    {
        if ($value === null) {
            return null;
        }

        $url = $options['url'];
        $name = $options['name'];

        return sprintf('<a href="%s">%s</a>', $url, $name);
    }

    public function formatFilesize($value, array $options = [])
    {
        $value = (string) $value;
        $decimals = isset($options['decimals']) ? $options['decimals'] : 2;

        $size = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        $factor = floor((strlen($value) - 1) / 3);

        return sprintf("%.{$decimals}f", $value / pow(1024, $factor)) . (isset($size[$factor]) ? $size[$factor] : '');
    }
}
