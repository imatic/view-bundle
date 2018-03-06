<?php

namespace Imatic\Bundle\ViewBundle\Twig\Extension;

use Imatic\Bundle\ViewBundle\Twig\Runtime\MenuRuntime;

class MenuExtension extends \Twig_Extension
{
    public function getFunctions()
    {
        return [
            new \Twig_Function(
                'imatic_view_menu_render_array',
                [
                    MenuRuntime::class, 'renderArrayMenu'
                ],
                [
                    'is_safe' => ['html']
                ]
            ),
        ];
    }
}
