<?php

namespace Imatic\Bundle\ViewBundle\Twig\Extension;

use Imatic\Bundle\ViewBundle\Menu\Factory;
use Knp\Menu\Renderer\RendererInterface;
use Twig_Extension;

class MenuExtension extends Twig_Extension
{
    /**
     * @var Factory
     */
    protected $factory;
    /**
     * @var RendererInterface
     */
    protected $renderer;

    /**
     * @param Factory           $factory
     * @param RendererInterface $renderer
     */
    public function __construct(Factory $factory, RendererInterface $renderer)
    {
        $this->factory = $factory;
        $this->renderer = $renderer;
    }

    public function getFunctions()
    {
        return [
            new \Twig_Function('imatic_view_menu_render_array', [$this, 'renderArrayMenu'], ['is_safe' => ['html']]),
        ];
    }

    public function renderArrayMenu(array $menu, array $options)
    {
        $menu = $this->factory->createFromArray(['name' => 'root', 'children' => $menu]);

        return $this->renderer->render($menu, $options);
    }
}
