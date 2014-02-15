<?php

namespace Imatic\Bundle\ViewBundle\Templating\Helper\Show;

use Imatic\Bundle\ViewBundle\Templating\Utils\AbstractOptions;
use Symfony\Component\OptionsResolver\Options;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class FieldOptions extends AbstractOptions
{
    protected function configureOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setRequired(['name']);
        $resolver->setDefaults([
            'format' => 'text',
            'formatOptions' => [],
            'class' => '',
            'label' => function (Options $options) {
                    return $options['name'];
                }
        ]);
        $resolver->setAllowedTypes([
            'name' => 'string',
            'format' => 'string',
            'formatOptions' => 'array',
            'class' => 'string',
            'label' => 'string',
        ]);
    }
}