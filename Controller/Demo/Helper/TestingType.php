<?php

namespace Imatic\Bundle\ViewBundle\Controller\Demo\Helper;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;

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
            'checkbox' => [],
            'file' => [],
            'radio' => [],
            'choice' => [
                ['choices' => $choices, 'expanded' => true, 'multiple' => true],
                ['choices' => $choices, 'expanded' => false, 'multiple' => false],
                ['choices' => $choices, 'expanded' => false, 'multiple' => true],
                ['choices' => $choices, 'expanded' => true, 'multiple' => true],
            ],
            'genemu_jqueryselect2_choice' => ['choices' => $choices],
            'imatic_type_ajax_choice' => [
                ['route' => 'imatic_view_demo_component_formajaxchoice', 'allow_clear' => true, 'data' => 1, 'text_provider' => function ($value) { return 1 == $value ? 'Test initial value' : null; }],
                ['route' => 'imatic_view_demo_component_formajaxchoice', 'multiple' => true],
            ],
            'country' => [],
            'language' => [],
            'locale' => [],
            'timezone' => [],
            'currency' => [],
            'date' => ['data' => new \DateTime('-1 week')],
            'datetime' => ['data' => new \DateTime('-1 week 17:00')],
            'time' => ['data' => new \DateTime('12:00')],
            'birthday' => [],
            'imatic_type_date_range' => [],
            'imatic_type_datetime_range' => [],
            'imatic_type_time_range' => [],
            'imatic_type_range' => [],
            /*'collection' => ['type' => 'imatic_type_date_range', 'data' => [
                ['start' => new \DateTime('-1 week'), 'end' => new \DateTime('+1 week')],
                ['start' => new \DateTime('-2 week'), 'end' => new \DateTime('+2 week')],
            ]],*/

            'collection' => ['type' => new NestedCollectionType(), 'data' => [
                ['name' => 'Example', 'dates' => [new \DateTime('now')]],
            ]],
            //'collection' => ['type' => 'collection', 'options' => ['type' => 'date']],
        ];

        foreach ($types as $type => $options) {
            if (is_int(key($options))) {
                foreach ($options as $subKey => $subOptions) {
                    $builder->add("{$type}_{$subKey}", $type, $subOptions);
                }
            } else {
                $builder->add($type, $type, $options);
            }
        }
    }

    public function getName()
    {
        return 'testing';
    }
}
