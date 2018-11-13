<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Templating\Helper\Show;

use Imatic\Bundle\ViewBundle\Templating\Utils\AbstractOptions;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ShowOptions extends AbstractOptions
{
    protected function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'class' => '',
            'actions' => [],
            'translationDomain' => 'messages',
        ]);

        $resolver->setAllowedTypes('class', 'string');
        $resolver->setAllowedTypes('actions', 'array');
        $resolver->setAllowedTypes('translationDomain', 'string');
    }
}
