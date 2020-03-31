<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Twig\Extension;

use Imatic\Bundle\ViewBundle\Twig\Node\FormatFunctionNode;
use Imatic\Bundle\ViewBundle\Twig\Runtime\FormatRuntime;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class FormatExtension extends AbstractExtension
{
    public function getFunctions()
    {
        return [
            new TwigFunction(
                'imatic_view_format',
                [
                    FormatRuntime::class, 'format',
                ],
                [
                    'is_safe' => ['all'],
                    'needs_environment' => true,
                    'node_class' => FormatFunctionNode::class,
                ]
            ),

            new TwigFunction(
                'imatic_view_render_value',
                [
                    FormatRuntime::class, 'renderValue',
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
