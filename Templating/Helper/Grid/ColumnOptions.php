<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Templating\Helper\Grid;

use Imatic\Bundle\ViewBundle\Templating\Utils\AbstractOptions;
use Imatic\Bundle\ViewBundle\Templating\Utils\StringUtil;
use Symfony\Component\OptionsResolver\Options;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ColumnOptions extends AbstractOptions
{
    protected function prepare($options)
    {
        if (\is_string($options)) {
            $options = ['name' => $options];
        }

        return $options;
    }

    protected function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setRequired(['name']);
        $resolver->setDefaults([
            'format' => 'text',
            'formatOptions' => [],
            'class' => '',
            'sortable' => false,
            'label' => function (Options $options) {
                return StringUtil::humanize($options['name']);
            },
            'propertyPath' => function (Options $options) {
                return $options['name'];
            },
        ]);

        $resolver->setAllowedTypes('name', 'string');
        $resolver->setAllowedTypes('format', 'string');
        $resolver->setAllowedTypes('formatOptions', 'array');
        $resolver->setAllowedTypes('class', 'string');
        $resolver->setAllowedTypes('label', 'string');
        $resolver->setAllowedTypes('propertyPath', ['string', 'NULL']);
    }
}
