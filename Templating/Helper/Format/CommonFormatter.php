<?php

namespace Imatic\Bundle\ViewBundle\Templating\Helper\Format;

use Symfony\Component\Translation\TranslatorInterface;
use Imatic\Bundle\ViewBundle\Templating\Utils\StringUtil;

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
        if (null !== $value) {
            return $this->{"format{$format}"}($value, $options);
        }
    }

    public function formatText($value, array $options = [])
    {
        if (isset($options['convert_newlines']) && $options['convert_newlines']) {
            return nl2br($value, false);
        }

        return $value;
    }

    public function formatHtml($value, array $options = [])
    {
        return $value;
    }

    public function formatPhone($value, array $options = [])
    {
        return sprintf('<a href="callto:%s">%s</a>', $value, $value);
    }

    public function formatEmail($value, array $options = [])
    {
        if (isset($options['text'])) {
            $text = StringUtil::escape($options['text']);
        } else {
            $text = $value;
        }

        return sprintf('<a href="mailto:%s">%s</a>', $value, $text);
    }

    public function formatUrl($value, array $options = [])
    {
        return sprintf('<a href="%s">%s</a>', $value, isset($options['text']) ? StringUtil::escape($options['text']) : $value);
    }

    public function formatBoolean($value, array $options = [])
    {
        $key = $value ? 'yes' : 'no';
        $text = $this->translator->trans($key, [], 'ImaticViewBundle');

        return sprintf('<span title="%s" class="%s"></span>', $text, $key);
    }

    /**
     * @deprecated use "url" formatter with "text" option instead
     */
    public function formatLink($value, array $options = [])
    {
        return sprintf('<a href="%s">%s</a>', StringUtil::escape($options['url']), StringUtil::escape($options['name']));
    }

    public function formatFilesize($value, array $options = [])
    {
        $value = (string) $value;
        $decimals = isset($options['decimals']) ? $options['decimals'] : 2;

        $size = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        $factor = floor((strlen($value) - 1) / 3);

        return sprintf("%.{$decimals}f", $value / pow(1024, $factor)) . (isset($size[$factor]) ? $size[$factor] : '');
    }

    public function formatTranslatable($value, array $options)
    {
        if (isset($options['prefix'])) {
            $key = $options['prefix'] . $value;
        } else {
            $key = $value;
        }

        return StringUtil::escape($this->translator->trans(
            $key,
            isset($options['params']) ? $options['params'] : [],
            $options['domain'],
            isset($options['locale']) ? $options['locale'] : null
        ));
    }
}
