<?php

namespace Imatic\Bundle\ViewBundle\Templating\Utils;

use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

abstract class AbstractOptions
{
    private $options;

    public function __construct(array $options = [])
    {
        $resolver = new OptionsResolver();
        $this->configureOptions($resolver);

        $this->options = $resolver->resolve($options);
    }

    public function __get($name)
    {
        if (!$this->__isset($name)) {
            throw new \InvalidArgumentException(sprintf('Option "%s" not exists in class "%s"', $name, get_class($this)));
        }

        return $this->options[$name];
    }

    public function __isset($name)
    {
        return array_key_exists($name, $this->options);
    }

    abstract protected function configureOptions(OptionsResolverInterface $resolver);
}