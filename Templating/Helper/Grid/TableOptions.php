<?php

namespace Imatic\Bundle\ViewBundle\Templating\Helper\Grid;

use Imatic\Bundle\ViewBundle\Templating\Helper\Action\ActionOptions;
use Imatic\Bundle\ViewBundle\Templating\Utils\AbstractOptions;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class TableOptions extends AbstractOptions
{
    protected function configure(array $options)
    {
        foreach ($options['actions'] as $key => $action) {
            $options['actions'][$key] = new ActionOptions($action);
        }

        foreach ($options['rowActions'] as $key => $action) {
            $options['rowActions'][$key] = new ActionOptions($action);
        }

        return $options;
    }

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