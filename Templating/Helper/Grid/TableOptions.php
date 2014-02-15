<?php

namespace Imatic\Bundle\ViewBundle\Templating\Helper\Grid;

use Imatic\Bundle\ViewBundle\Templating\Utils\AbstractOptions;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class TableOptions extends AbstractOptions
{
    protected function configureOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults([
            'class' => '',
            'actions' => [],
            'rowActions' => [],
            'sortable' => false,
            'selectable' => false,
            'selectableColumn' => '',
        ]);
        $resolver->setAllowedTypes([
            'class' => 'string',
            'actions' => 'array',
            'rowActions' => 'array',
            'sortable' => 'bool',
            'selectable' => 'bool',
            'selectableColumn' => 'string',
        ]);
    }
}