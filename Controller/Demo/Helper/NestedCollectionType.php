<?php

namespace Imatic\Bundle\ViewBundle\Controller\Demo\Helper;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;

class NestedCollectionType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name', 'text')
            ->add('dates', 'collection', ['type' => 'date'])
        ;
    }

    public function getName()
    {
        return 'nested_collection';
    }
}
