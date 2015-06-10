<?php

namespace Imatic\Bundle\ViewBundle\Templating\Helper\Grid;

use Imatic\Bundle\ViewBundle\Templating\Utils\AbstractOptions;
use Symfony\Component\OptionsResolver\Options;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class ColumnOptions extends AbstractOptions
{
    protected function prepare($options)
    {
        if (is_string($options)) {
            $options = ['name' => $options];
        }

        return $options;
    }

    protected function configureOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setRequired(['name']);
        $resolver->setDefaults([
            'format' => 'text',
            'formatOptions' => [],
            'class' => '',
            'sortable' => false,
            'label' => function (Options $options) {
                    return $options['name'];
                },
            'propertyPath' => function (Options $options) {
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
