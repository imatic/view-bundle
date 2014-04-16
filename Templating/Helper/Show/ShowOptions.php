<?php

namespace Imatic\Bundle\ViewBundle\Templating\Helper\Show;

use Imatic\Bundle\ViewBundle\Templating\Utils\AbstractOptions;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class ShowOptions extends AbstractOptions
{
    protected function configureOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults([
            'class' => '',
            'actions' => [],
            'translationDomain' => 'messages',
        ]);
        $resolver->setAllowedTypes([
            'class' => 'string',
            'actions' => 'array',
            'translationDomain' => 'string',
        ]);
    }
}
