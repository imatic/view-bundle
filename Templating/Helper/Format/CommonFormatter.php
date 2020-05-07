<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Templating\Helper\Format;

use Imatic\Bundle\ViewBundle\Templating\Utils\StringUtil;
use Symfony\Contracts\Translation\TranslatorInterface;

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
        $value = StringUtil::escape($value);

        if (isset($options['convert_newlines']) && $options['convert_newlines']) {
            $value = \nl2br($value, false);
        }

        return $value;
    }

    public function formatHtml($value, array $options = [])
    {
        return $value;
    }

    public function formatPhone($value, array $options = [])
    {
        $value = StringUtil::escape($value);

        return \sprintf('<a href="callto:%s">%s</a>', $value, $value);
    }

    public function formatEmail($value, array $options = [])
    {
        $value = StringUtil::escape($value);

        return \sprintf(
            '<a href="mailto:%s">%s</a>',
            $value,
            isset($options['text']) ? StringUtil::escape($options['text']) : $value
        );
    }

    public function formatUrl($value, array $options = [])
    {
        $value = StringUtil::escape($value);

        return \sprintf(
            '<a href="%s">%s</a>',
            $value,
            isset($options['text']) ? StringUtil::escape($options['text']) : $value
        );
    }

    public function formatBoolean($value, array $options = [])
    {
        $key = $value ? 'yes' : 'no';

        return \sprintf(
            '<span title="%s" class="%s"></span>',
            StringUtil::escape($this->translator->trans($key, [], 'ImaticViewBundle')),
            $key
        );
    }

    public function formatFilesize($value, array $options = [])
    {
        $value = (string) $value;
        $decimals = isset($options['decimals']) ? $options['decimals'] : 2;

        $size = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        $factor = \floor((\strlen($value) - 1) / 3);

        return \sprintf("%.{$decimals}f", $value / \pow(1024, $factor)) . (isset($size[$factor]) ? $size[$factor] : '');
    }

    public function formatTranslatable($value, array $options)
    {
        return $this->translator->trans(
            isset($options['prefix']) ? $options['prefix'] . $value : $value,
            isset($options['params']) ? $options['params'] : [],
            $options['domain'],
            isset($options['locale']) ? $options['locale'] : null
        );
    }
}
