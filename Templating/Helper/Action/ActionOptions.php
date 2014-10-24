<?php

namespace Imatic\Bundle\ViewBundle\Templating\Helper\Action;

use Imatic\Bundle\ViewBundle\Templating\Utils\AbstractOptions;
use Symfony\Component\OptionsResolver\Options;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

/**
 * @property string label
 * @property string name
 * @property string class
 * @property string type
 * @property array data
 * @property string route
 * @property array routeParams
 * @property string url
 * @property array nested
 * @property string condition
 * @property string tag
 */
class ActionOptions extends AbstractOptions
{
    protected function configureOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults([
            'label' => '',
            'name' => '',
            'class' => '',
            'type' => '',
            'data' => [],
            'route' => '',
            'routeParams' => [],
            'url' => '',
            'nested' => [],
            'condition' => '',
            'tag' => 'a',
        ]);
        $resolver->setAllowedTypes([
            'label' => 'string',
            'name' => 'string',
            'class' => 'string',
            'type' => 'string',
            'data' => 'array',
            'route' => 'string',
            'routeParams' => 'array',
            'url' => 'string',
            'nested' => 'array',
            'condition' => array('string', 'bool'),
            'tag' => 'string',
        ]);
        $resolver->setNormalizers([
            'nested' => function (Options $options, $nested) {
                foreach ($nested as &$nestedAction) {
                    $nestedAction = new static($nestedAction);
                }
                
                return $nested;
            },
        ]);
    }
}
