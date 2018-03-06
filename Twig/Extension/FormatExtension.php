<?php

namespace Imatic\Bundle\ViewBundle\Twig\Extension;

use Imatic\Bundle\ViewBundle\Twig\Node\FormatFunctionNode;
use Imatic\Bundle\ViewBundle\Twig\Runtime\FormatRuntime;

class FormatExtension extends \Twig_Extension
{
    public function getFunctions()
    {
        return [
            new \Twig_Function(
                'imatic_view_format',
                [
                    FormatRuntime::class, 'format'
                ],
                [
                    'is_safe' => ['all'],
                    'needs_environment' => true,
                    'node_class' => FormatFunctionNode::class,
                ]
            ),

            new \Twig_Function(
                'imatic_view_render_value',
                [
                    FormatRuntime::class, 'renderValue'
                ],
                [
                    'is_safe' => ['all'],
                    'needs_environment' => true,
                    'node_class' => FormatFunctionNode::class,
                ]
            ),
        ];
    }
}
