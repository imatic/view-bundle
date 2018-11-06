<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Templating\Helper\Grid;

use Imatic\Bundle\ViewBundle\Templating\Helper\Action\ActionOptions;
use Imatic\Bundle\ViewBundle\Templating\Utils\AbstractOptions;
use Symfony\Component\OptionsResolver\OptionsResolver;

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

        foreach ($options['exports'] as $key => $action) {
            $options['exports'][$key] = new ActionOptions($action);
        }

        return $options;
    }

    protected function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'actions' => [],
            'rowActions' => [],
            'batchActions' => [],
            'selectable' => false,
            'selectableColumn' => '',
            'attr' => [],
            'translationDomain' => 'messages',
            'exports' => [],
        ]);

        $resolver->setAllowedTypes('actions', 'array');
        $resolver->setAllowedTypes('rowActions', 'array');
        $resolver->setAllowedTypes('batchActions', 'array');
        $resolver->setAllowedTypes('selectable', 'bool');
        $resolver->setAllowedTypes('selectableColumn', 'string');
        $resolver->setAllowedTypes('attr', 'array');
        $resolver->setAllowedTypes('translationDomain', 'string');
        $resolver->setAllowedTypes('exports', 'array');
    }
}
