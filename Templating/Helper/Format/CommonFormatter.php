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
        return $value;
    }

    public function formatPhone($value, array $options = [])
    {
        return sprintf('<a href="callto:%s">%s</a>', $value, $value);
    }

    public function formatEmail($value, array $options = [])
    {
        return sprintf('<a href="mailto:%s">%s</a>', $value, $value);
    }

    public function formatUrl($value, array $options = [])
    {
        return sprintf('<a href="%s">%s</a>', $value, $value);
    }

    public function formatBoolean($value, array $options = [])
    {
        $key = $value ? 'yes' : 'no';
        $text = $this->translator->trans($key, [], 'ImaticViewBundle');

        return sprintf('<span title="%s" class="%s"></span>', $text, $key);
    }
}