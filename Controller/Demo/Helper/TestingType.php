<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Controller\Demo\Helper;

use Imatic\Bundle\FormBundle\Form\Type\AjaxChoiceType;
use Imatic\Bundle\FormBundle\Form\Type\DateRangeType;
use Imatic\Bundle\FormBundle\Form\Type\DateTimeRangeType;
use Imatic\Bundle\FormBundle\Form\Type\RangeType;
use Imatic\Bundle\FormBundle\Form\Type\TimeRangeType;
use Imatic\Bundle\FormBundle\ImaticFormBundle;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\BirthdayType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\CountryType;
use Symfony\Component\Form\Extension\Core\Type\CurrencyType;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\LanguageType;
use Symfony\Component\Form\Extension\Core\Type\LocaleType;
use Symfony\Component\Form\Extension\Core\Type\MoneyType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\PercentType;
use Symfony\Component\Form\Extension\Core\Type\RadioType;
use Symfony\Component\Form\Extension\Core\Type\SearchType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TimeType;
use Symfony\Component\Form\Extension\Core\Type\TimezoneType;
use Symfony\Component\Form\Extension\Core\Type\UrlType;
use Symfony\Component\Form\FormBuilderInterface;

class TestingType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $imaticFormBundle = \class_exists(ImaticFormBundle::class);

        $choices = ['One', 'Two'];
        $types = [
            'text' => ['type' => TextType::class],
            'textarea' => ['type' => TextareaType::class],
            'email' => ['type' => EmailType::class],
            'money' => ['type' => MoneyType::class],
            'number' => ['type' => NumberType::class],
            'password' => ['type' => PasswordType::class],
            'percent' => ['type' => PercentType::class],
            'search' => ['type' => SearchType::class],
            'url' => ['type' => UrlType::class],
            'checkbox' => ['type' => CheckboxType::class],
            'file' => ['type' => FileType::class],
            'radio' => ['type' => RadioType::class],
            'choice' => ['choices' => $choices, 'expanded' => false, 'multiple' => false, 'type' => ChoiceType::class],
            'choice_multi' => ['choices' => $choices, 'expanded' => false, 'multiple' => true, 'type' => ChoiceType::class],
            'choice_expanded' => ['choices' => $choices, 'expanded' => true, 'multiple' => false, 'type' => ChoiceType::class],
            'choice_expanded_multi' => ['choices' => $choices, 'expanded' => true, 'multiple' => true, 'type' => ChoiceType::class],
        ];

        if ($imaticFormBundle) {
            $types += [
               'choice_not_rich' => ['choices' => $choices, 'expanded' => false, 'multiple' => false, 'rich' => false, 'type' => ChoiceType::class],
               'imatic_type_ajax_choice' => ['type' => AjaxChoiceType::class, 'route' => 'imatic_view_demo_component_formajaxchoice', 'allow_clear' => true, 'data' => 1, 'text_provider' => function ($value) {
                   return 1 === $value ? 'Test initial value' : null;
               }],
               'imatic_type_ajax_choice_multi' => ['type' => AjaxChoiceType::class, 'route' => 'imatic_view_demo_component_formajaxchoice', 'multiple' => true],
            ];
        }

        $types += [
            'country' => ['type' => CountryType::class],
            'language' => ['type' => LanguageType::class],
            'locale' => ['type' => LocaleType::class],
            'timezone' => ['type' => TimezoneType::class],
            'currency' => ['type' => CurrencyType::class],
            'date' => ['data' => new \DateTime('-1 week'), 'type' => DateType::class],
            'datetime' => ['data' => new \DateTime('-1 week 17:00'), 'type' => DateTimeType::class],
            'time' => ['data' => new \DateTime('12:00'), 'type' => TimeType::class],
            'birthday' => ['type' => BirthdayType::class],
        ];

        if ($imaticFormBundle) {
            $types += [
                'imatic_type_date_range' => ['type' => DateRangeType::class],
                'imatic_type_datetime_range' => ['type' => DateTimeRangeType::class],
                'imatic_type_time_range' => ['type' => TimeRangeType::class],
                'imatic_type_range' => ['type' => RangeType::class],
                'collection_a' => [
                    'type' => CollectionType::class,
                    'entry_type' => NestedCollectionType::class,
                    'allow_add' => true,
                    'allow_delete' => true,
                    'data' => [['name' => 'Example', 'dates' => [new \DateTime('now')]]],
                ],
                'collection_b' => [
                    'type' => CollectionType::class,
                    'entry_type' => DateType::class,
                    'data' => [new \DateTime('+1 week'), new \DateTime('+2 weeks')],
                ],
                'collection_c' => [
                    'type' => CollectionType::class,
                    'entry_type' => FileType::class,
                    'allow_add' => true,
                    'allow_delete' => true,
                ]
            ];
        }

        $defaultOptions = ['required' => false];

        foreach ($types as $name => $options) {
            $type = $options['type'];
            unset($options['type']);
            $builder->add($name, $type, $options + $defaultOptions);
        }
    }
}
