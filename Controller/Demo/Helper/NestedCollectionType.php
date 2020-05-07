<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Controller\Demo\Helper;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;

class NestedCollectionType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name', TextType::class)
            ->add('dates', CollectionType::class, ['entry_type' => DateType::class, 'allow_add' => true, 'allow_delete' => true])
        ;
    }
}
