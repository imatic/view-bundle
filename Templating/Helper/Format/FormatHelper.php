<?php

namespace Imatic\Bundle\ViewBundle\Templating\Helper\Format;

use Symfony\Component\DependencyInjection\ContainerInterface;
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

    /**
     * @var ContainerInterface
     */
    private $container;

    public function __construct(ContainerInterface $container)
    {
        // need a container instance, because circular reference
        $this->container = $container;

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
        if (is_null($propertyPath)) {
            $value = $objectOrArray;
        } else {
            $value = $accessor->getValue($objectOrArray, $propertyPath);
            $options['object'] = $objectOrArray;
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
        } elseif (!empty($options['template'])) {
            return $this->container->get('templating')->render($options['template'], array_merge($options, ['value' => $value, 'options' => $options, 'format' => $format]));
        } elseif (is_null($value)) {
            return null;
        } else {
            return $this->format($value, $format, $options);
        }
    }
}
