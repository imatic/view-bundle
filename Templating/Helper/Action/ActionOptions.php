<?php

namespace Imatic\Bundle\ViewBundle\Templating\Helper\Action;

use Imatic\Bundle\ViewBundle\Templating\Utils\AbstractOptions;
use Symfony\Component\OptionsResolver\Options;
use Symfony\Component\OptionsResolver\OptionsResolver;

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
    protected function configureOptions(OptionsResolver $resolver)
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
        $resolver->setAllowedTypes('label', 'string');
        $resolver->setAllowedTypes('name', 'string');
        $resolver->setAllowedTypes('class', 'string');
        $resolver->setAllowedTypes('type', 'string');
        $resolver->setAllowedTypes('data', 'array');
        $resolver->setAllowedTypes('route', 'string');
        $resolver->setAllowedTypes('routeParams', 'array');
        $resolver->setAllowedTypes('url', 'string');
        $resolver->setAllowedTypes('nested', 'array');
        $resolver->setAllowedTypes('condition', ['string', 'bool']);
        $resolver->setAllowedTypes('tag', 'string');
        $resolver->setNormalizer(
            'nested', function (Options $options, $nested) {
            foreach ($nested as &$nestedAction) {
                $nestedAction = new static($nestedAction);
            }

            return $nested;
        }
        );
    }
}
