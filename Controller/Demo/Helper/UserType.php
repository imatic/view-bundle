<?php

namespace Imatic\Bundle\ViewBundle\Controller\Demo\Helper;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class UserType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name')
            ->add('age', 'integer')
            ->add('active', 'checkbox')
            ->add('lastOnline', 'datetime')
            ->add('phone')
            ->add('email', 'email')
            ->add('url', 'url')
            ->add('save', 'submit');
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'Imatic\Bundle\ViewBundle\Controller\Demo\Helper\User',
        ));
    }

    public function getName()
    {
        return 'user';
    }
}