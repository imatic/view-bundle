<?php

namespace Imatic\Bundle\ViewBundle\Templating\Helper\Format;

use Locale;
use DateTime;
use IntlDateFormatter;
use NumberFormatter;

class IntlFormatter implements FormatterInterface
{
    /** @var int[] */
    protected static $intlFormatTypes = [
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

    public function format($value, $format, array $options = [])
    {
        if (null !== $value) {
            return $this->{"format{$format}"}($value, $options);
        }
    }

    protected function formatDate($value, array $options)
    {
        if (!$value instanceof DateTime) {
            $value = new DateTime($value);
        }

        if (isset($options['format'])) {
            // explicit format given
            return $value->format($options['format']);
        } else {
            // use intl
            return $this->intlDateTimeFormat(
                $value,
                isset($options['type']) ? $options['type'] : 'medium',
                'none',
                isset($options['timezone']) ? $options['timezone'] : null,
                isset($options['locale']) ? $options['locale'] : null
            );
        }
    }

    protected function formatDateTime($value, array $options)
    {
        if (!$value instanceof DateTime) {
            $value = new DateTime($value);
        }

        if (isset($options['format'])) {
            // explicit format given
            return $value->format($options['format']);
        } else {
            // use intl
            return $this->intlDateTimeFormat(
                $value,
                isset($options['date_type']) ? $options['date_type'] : 'short',
                isset($options['time_type']) ? $options['time_type'] : 'short',
                isset($options['timezone']) ? $options['timezone'] : null,
                isset($options['locale']) ? $options['locale'] : null
            );
        }
    }

    protected function formatTime($value, array $options)
    {
        if (!$value instanceof DateTime) {
            $value = new DateTime($value);
        }

        if (isset($options['format'])) {
            // explicit format given
            return $value->format($options['format']);
        } else {
            // use intl
            return $this->intlDateTimeFormat(
                $value,
                'none',
                isset($options['type']) ? $options['type'] : 'short',
                isset($options['timezone']) ? $options['timezone'] : null,
                isset($options['locale']) ? $options['locale'] : null
            );
        }
    }

    protected function formatNumber($value, array $options)
    {
        if (isset($options['decimal']) || isset($options['decimalPoint']) || isset($options['thousandSep'])) {
            // use number_format()
            if (isset($options['type'])) {
                throw new \LogicException('The "type" option has no effect when the "decimal", "decimalPoint" or "thousandSep" option is used');
            }

            return number_format(
                $value,
                isset($options['decimal']) ? $options['decimal'] : 0,
                isset($options['decimalPoint']) ? $options['decimalPoint'] : '.',
                isset($options['thousandSep']) ? $options['thousandSep'] : ','
            );
        } else {
            // use number formatter
            if (isset($options['type'])) {
                if (!isset(static::$numberFormatTypes[$options['type']])) {
                    throw new \InvalidArgumentException(sprintf('Invalid number type "%s", valid types are: %s', $options['type'], implode(', ', array_keys(static::$numberFormatTypes))));
                }

                $type = static::$numberFormatTypes[$options['type']];
            } else {
                $type = static::$numberFormatTypes['default'];
            }

            $formatter = new NumberFormatter(
                isset($options['locale']) ? $options['locale'] : Locale::getDefault(),
                $type
            );

            return $formatter->format($value);
        }
    }

    /**
     * @param DateTime    $dateTime
     * @param string      $dateType
     * @param string      $timeType
     * @param mixed       $timezone
     * @param string|null $locale
     * @return string|bool
     */
    protected function intlDateTimeFormat(DateTime $dateTime, $dateType, $timeType, $timezone, $locale)
    {
        if (!isset(static::$intlFormatTypes[$dateType])) {
            throw new \InvalidArgumentException(sprintf('Invalid date type "%s", valid types are: %s', $dateType, implode(', ', array_keys(static::$intlFormatTypes))));
        }
        if (!isset(static::$intlFormatTypes[$dateType])) {
            throw new \InvalidArgumentException(sprintf('Invalid time type "%s", valid types are: %s', $timeType, implode(', ', array_keys(static::$intlFormatTypes))));
        }

        $formatter = new IntlDateFormatter(
            $locale ?: Locale::getDefault(),
            static::$intlFormatTypes[$dateType],
            static::$intlFormatTypes[$timeType],
            $timezone ?: $dateTime->getTimezone()
        );

        return $formatter->format($dateTime);
    }
}
