<?php

namespace Imatic\Bundle\ViewBundle\Controller\Demo\Helper;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class TestingType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $choices = ['One', 'Two'];
        $types = [
            'text' => [],
            'textarea' => [],
            'email' => [],
            'integer' => [],
            'money' => [],
            'number' => [],
            'password' => [],
            'percent' => [],
            'search' => [],
            'url' => [],
            'choice1' => ['choices' => $choices, '_type' => 'choice', 'expanded' => true, 'multiple' => true],
            'choice2' => ['choices' => $choices, '_type' => 'choice', 'expanded' => false, 'multiple' => false],
            'choice3' => ['choices' => $choices, '_type' => 'choice', 'expanded' => false, 'multiple' => true],
            'choice4' => ['choices' => $choices, '_type' => 'choice', 'expanded' => true, 'multiple' => true],
            'country' => [],
            'language' => [],
            'locale' => [],
            'timezone' => [],
            'currency' => [],
            'date' => [],
            'datetime' => [],
            'time' => [],
            'birthday' => [],
            'checkbox' => [],
            'file' => [],
            'radio' => [],
            'collection' => ['type' => 'datetime', 'data' => ['today' => new \DateTime(), 'tomorow' => new \DateTime('+1 day')]],
        ];

        foreach ($types as $typeName => $typeOptions) {
            $type = isset($typeOptions['_type']) ? $typeOptions['_type'] : $typeName;
            unset($typeOptions['_type']);
            $builder->add($typeName, $type, $typeOptions);
        }
    }

    public function getName()
    {
        return 'testing';
    }
}
