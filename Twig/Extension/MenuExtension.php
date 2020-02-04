<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Twig\Extension;

use Imatic\Bundle\ViewBundle\Twig\Runtime\MenuRuntime;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class MenuExtension extends AbstractExtension
{
    public function getFunctions()
    {
        return [
            new TwigFunction(
                'imatic_view_menu_render_array',
                [
                    MenuRuntime::class, 'renderArrayMenu',
                ],
                [
                    'is_safe' => ['html'],
                ]
            ),
        ];
    }
}
