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

        foreach ($options['batchActions'] as $key => $action) {
            $options['batchActions'][$key] = new ActionOptions($action);
        }

        foreach ($options['rowActions'] as $key => $action) {
            $options['rowActions'][$key] = new ActionOptions($action);
        }

        return $options;
    }

    protected function configureOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults([
            'actions' => [],
            'rowActions' => [],
            'batchActions' => [],
            'selectable' => false,
            'selectableColumn' => '',
            'attr' => [],
            'translationDomain' => 'messages',
        ]);
        $resolver->setAllowedTypes([
            'actions' => 'array',
            'rowActions' => 'array',
            'batchActions' => 'array',
            'selectable' => 'bool',
            'selectableColumn' => 'string',
            'attr' => 'array',
            'translationDomain' => 'string',
        ]);
    }
}