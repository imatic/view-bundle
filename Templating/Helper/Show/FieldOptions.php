<?php

namespace Imatic\Bundle\ViewBundle\Templating\Helper\Show;

use Imatic\Bundle\ViewBundle\Templating\Utils\AbstractOptions;
use Imatic\Bundle\ViewBundle\Templating\Utils\String;
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
                return String::humanize($options['name']);
            },
            'propertyPath' => function (Options $options, $x) {
                return $options['name'];
            }
        ]);
        $resolver->setAllowedTypes([
            'name' => 'string',
            'format' => 'string',
            'formatOptions' => 'array',
            'class' => 'string',
            'label' => 'string',
            'propertyPath' => ['string', 'NULL'],
        ]);
    }
}
