<?php

namespace Imatic\Bundle\ViewBundle\Templating\Helper\Format;

use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use Symfony\Component\PropertyAccess\PropertyAccess;

class FormatHelper implements FormatterInterface
{
    /**
     * @var FormatterInterface[]
     */
    private $formatters;

    /**
     * @var array
     */
    private $formaterOptions;

    /**
     * @var OptionsResolverInterface
     */
    private $resolver;

    public function __construct()
    {
        $this->formatters = [];
        $this->formaterOptions = [];

        $this->resolver = new OptionsResolver();
        $this->resolver->setDefaults([
            'is_safe' => false,
        ]);
        $this->resolver->setAllowedTypes([
            'is_safe' => 'bool'
        ]);
    }

    public function addFormatter($name, FormatterInterface $formatter, array $options = [])
    {
        $this->formatters[$name] = $formatter;
        $this->formaterOptions[$name] = $this->resolver->resolve($options);
    }

    public function format($value, $format, array $options = [])
    {
        if (!array_key_exists($format, $this->formatters)) {
            throw new \InvalidArgumentException(sprintf('Formatter "%s" not found', $format));
        }

        if (!$this->formaterOptions[$format]['is_safe']) {
            $value = htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        }

        return $this->formatters[$format]->format($value, $format, $options);
    }

    public function renderValue($objectOrArray, $propertyPath, $format, array $options = [])
    {
        $accessor = PropertyAccess::createPropertyAccessor();
        $value = $accessor->getValue($objectOrArray, $propertyPath);

        if (is_null($value)) {
            if (!empty($options['template'])) {
                // todo: Implement template etc..
                throw new \Exception('Not implemented:(');
            } else {
                return null;
            }
        }

        return $this->format($value, $format, $options);
    }
}