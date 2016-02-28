<?php

namespace Imatic\Bundle\ViewBundle\Templating\Helper\Format;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\PropertyAccess\PropertyAccess;
use Symfony\Component\PropertyAccess\PropertyAccessor;
use Symfony\Component\PropertyAccess\Exception\UnexpectedTypeException;

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
     * @var OptionsResolver
     */
    private $resolver;

    /**
     * @var ContainerInterface
     */
    private $container;

    /**
     * @var PropertyAccessor
     */
    private $accessor;

    public function __construct(ContainerInterface $container)
    {
        // need a container instance, because circular reference
        $this->container = $container;

        $this->accessor = PropertyAccess::createPropertyAccessor();

        $this->formatters = [];
        $this->formaterOptions = [];

        $this->resolver = new OptionsResolver();
        $this->resolver->setDefaults([
            'is_safe' => false,
        ]);
        $this->resolver->setAllowedTypes('is_safe', 'bool');
    }

    public function addFormatter($name, FormatterInterface $formatter, array $options = [])
    {
        $this->formatters[$name] = $formatter;
        $this->formaterOptions[$name] = $this->resolver->resolve($options);
    }

    public function format($value, $format = null, array $options = [])
    {
        if (null === $format) {
            $format = $this->guessFormat($value);
        }

        if (!empty($options['template'])) {
            return $this->container->get('templating')->render(
                $options['template'],
                array_merge(
                    $options,
                    ['value' => $value, 'options' => $options, 'format' => $format]
                )
            );
        }

        if (!array_key_exists($format, $this->formatters)) {
            throw new \InvalidArgumentException(sprintf('Formatter "%s" not found', $format));
        }

        // escape the value unless the current format is marked as "is_safe"
        // following values will not escaped: NULL, integer, float, boolean
        if (
            !$this->formaterOptions[$format]['is_safe']
            && null !== $value
            && (!is_scalar($value) || is_string($value))
        ) {
            $value = htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        }

        return $this->formatters[$format]->format($value, $format, $options);
    }

    public function renderValue($objectOrArray, $propertyPath, $format = null, array $options = [])
    {
        if (is_array($objectOrArray) && $propertyPath && $propertyPath[0] !== '[') {
            $propertyPath = sprintf('[%s]', $propertyPath);
        }

        if (null === $propertyPath) {
            $value = $objectOrArray;
        } else {
            try {
                $value = $this->accessor->getValue($objectOrArray, $propertyPath);
                $options['object'] = $objectOrArray;
            } catch (UnexpectedTypeException $e) {
                // the property path could not be reached
                $value = null;
            }
        }

        if (!empty($options['collection']) && true === $options['collection']) {
            unset($options['collection']);
            $propertyPath = null;
            if (!empty($options['propertyPath'])) {
                $propertyPath = $options['propertyPath'];
            }

            return $this->container->get('templating')->render('ImaticViewBundle:Field:collection.html.twig', [
                'value' => $value,
                'options' => $options,
                'format' => $format,
                'propertyPath' => $propertyPath,
            ]);
        } else {
            return $this->format($value, $format, $options);
        }
    }

    protected function guessFormat($value)
    {
        $format = null;
        $type = gettype($value);

        switch ($type) {
            case 'boolean':
                $format = 'boolean';
                break;
            case 'integer':
            case 'double':
                $format = 'number';
                break;
            case 'string':
            case 'NULL':
            case 'resource':
                $format = 'text';
                break;
            case 'object':
                if ($value instanceof \DateTime) {
                    $format = 'datetime';
                } else {
                    $format = 'text';
                }
                break;
        }

        if (null === $format) {
            throw new \RuntimeException(sprintf(
                'Could not guess format for a value of type "%s". Please provide a format.',
                $type
            ));
        }

        return $format;
    }
}
