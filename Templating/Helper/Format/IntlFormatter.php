<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Templating\Helper\Format;

use DateTime;
use IntlDateFormatter;
use Locale;
use NumberFormatter;

class IntlFormatter implements FormatterInterface
{
    /** @var int[] */
    protected static $dateFormatTypes = [
        'none' => IntlDateFormatter::NONE,
        'short' => IntlDateFormatter::SHORT,
        'medium' => IntlDateFormatter::MEDIUM,
        'long' => IntlDateFormatter::LONG,
        'full' => IntlDateFormatter::FULL,
    ];
    /** @var int[] */
    protected static $numberFormatTypes = [
        'default' => NumberFormatter::DEFAULT_STYLE,
        'decimal' => NumberFormatter::DECIMAL,
        'currency' => NumberFormatter::CURRENCY,
        'percent' => NumberFormatter::PERCENT,
        'scientific' => NumberFormatter::SCIENTIFIC,
        'spellout' => NumberFormatter::SPELLOUT,
        'ordinal' => NumberFormatter::ORDINAL,
        'duration' => NumberFormatter::DURATION,
    ];
    /** @var array */
    protected $datePatternOverrides = [
        'cs.date.short' => 'dd.MM.y',
        'cs.datetime.short:short' => 'dd.MM.y H:mm',
        'sk.date.short' => 'dd.MM.y',
        'sk.datetime.short:short' => 'dd.MM.y H:mm',
    ];

    public function addDatePatternOverrides(array $overrides)
    {
        $this->datePatternOverrides = $overrides + $this->datePatternOverrides;
    }

    public function format($value, $format, array $options = [])
    {
        if (null !== $value) {
            return $this->{"format{$format}"}($value, $options);
        }
    }

    protected function formatDate($value, array $options)
    {
        if (!$value instanceof \DateTimeInterface) {
            $value = new DateTime($value);
        }

        if (isset($options['format'])) {
            // explicit format given
            return $value->format($options['format']);
        }
        // use intl
        return $this->intlDateTimeFormat(
            $value,
            isset($options['type']) ? $options['type'] : 'short',
            'none',
            isset($options['timezone']) ? $options['timezone'] : null,
            isset($options['locale']) ? $options['locale'] : null
        );
    }

    protected function formatDateTime($value, array $options)
    {
        if (!$value instanceof \DateTimeInterface) {
            $value = new DateTime($value);
        }

        if (isset($options['format'])) {
            // explicit format given
            return $value->format($options['format']);
        }
        // use intl
        return $this->intlDateTimeFormat(
            $value,
            isset($options['date_type']) ? $options['date_type'] : 'short',
            isset($options['time_type']) ? $options['time_type'] : 'short',
            isset($options['timezone']) ? $options['timezone'] : null,
            isset($options['locale']) ? $options['locale'] : null
        );
    }

    protected function formatTime($value, array $options)
    {
        if (!$value instanceof \DateTimeInterface) {
            $value = new DateTime($value);
        }

        if (isset($options['format'])) {
            // explicit format given
            return $value->format($options['format']);
        }
        // use intl
        return $this->intlDateTimeFormat(
            $value,
            'none',
            isset($options['type']) ? $options['type'] : 'short',
            isset($options['timezone']) ? $options['timezone'] : null,
            isset($options['locale']) ? $options['locale'] : null
        );
    }

    protected function formatNumber($value, array $options)
    {
        if (isset($options['decimal']) || isset($options['decimalPoint']) || isset($options['thousandSep'])) {
            // use number_format()
            return \number_format(
                $value,
                isset($options['decimal']) ? $options['decimal'] : 0,
                isset($options['decimalPoint']) ? $options['decimalPoint'] : '.',
                isset($options['thousandSep']) ? $options['thousandSep'] : ','
            );
        }
        // use number formatter
        if (isset($options['type'])) {
            if (!isset(static::$numberFormatTypes[$options['type']])) {
                throw new \InvalidArgumentException(\sprintf('Invalid number type "%s", valid types are: %s', $options['type'], \implode(', ', \array_keys(static::$numberFormatTypes))));
            }

            $type = static::$numberFormatTypes[$options['type']];
        } else {
            $type = static::$numberFormatTypes['default'];
        }

        $formatter = new NumberFormatter(
            isset($options['locale']) ? $options['locale'] : Locale::getDefault(),
            $type
        );

        if (NumberFormatter::PERCENT === $type) {
            $formatter->setAttribute(NumberFormatter::MULTIPLIER, isset($options['multiplier']) ? $options['multiplier'] : 1);
            $formatter->setTextAttribute(NumberFormatter::POSITIVE_SUFFIX, '%');
            $formatter->setTextAttribute(NumberFormatter::NEGATIVE_SUFFIX, '%');
        }

        if (NumberFormatter::CURRENCY === $type) {
            return $formatter->formatCurrency($value, $options['currency']);
        }
        return $formatter->format($value);
    }

    /**
     * @param \DateTimeInterface $dateTime
     * @param string $dateType
     * @param string $timeType
     * @param mixed $timezone
     * @param string|null $locale
     *
     * @return string|bool
     */
    protected function intlDateTimeFormat(\DateTimeInterface $dateTime, $dateType, $timeType, $timezone, $locale)
    {
        if (!isset(static::$dateFormatTypes[$dateType])) {
            throw new \InvalidArgumentException(\sprintf('Invalid date type "%s", valid types are: %s', $dateType, \implode(', ', \array_keys(static::$dateFormatTypes))));
        }
        if (!isset(static::$dateFormatTypes[$dateType])) {
            throw new \InvalidArgumentException(\sprintf('Invalid time type "%s", valid types are: %s', $timeType, \implode(', ', \array_keys(static::$dateFormatTypes))));
        }
        if (!$locale) {
            $locale = Locale::getDefault();
        }

        $formatter = new IntlDateFormatter(
            $locale,
            static::$dateFormatTypes[$dateType],
            static::$dateFormatTypes[$timeType],
            $timezone ?: $dateTime->getTimezone()
        );

        if ($pattern = $this->getIntlDatePattern($locale, $dateType, $timeType)) {
            $formatter->setPattern($pattern);
        }

        return $formatter->format($dateTime);
    }

    /**
     * @param string $locale
     * @param int    $dateType
     * @param int    $timeType
     *
     * @return string|null
     */
    protected function getIntlDatePattern($locale, $dateType, $timeType)
    {
        $hasDate = 'none' !== $dateType;
        $hasTime = 'none' !== $timeType;

        if ($hasDate && $hasTime) {
            $overrideKey = "{$locale}.datetime.{$dateType}:{$timeType}";
        } elseif ($hasDate) {
            $overrideKey = "{$locale}.date.{$dateType}";
        } elseif ($hasTime) {
            $overrideKey = "{$locale}.time.{$timeType}";
        } else {
            $overrideKey = null;
        }

        if ($overrideKey && isset($this->datePatternOverrides[$overrideKey])) {
            return $this->datePatternOverrides[$overrideKey];
        }
    }
}
