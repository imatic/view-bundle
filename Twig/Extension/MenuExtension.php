<?php

namespace Imatic\Bundle\ViewBundle\Twig\Extension;

use Imatic\Bundle\ViewBundle\Menu\Factory;
use Twig_Function_Method;
use Twig_Extension;
use Knp\Menu\Renderer\RendererInterface;

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
            'imatic_view_menu_render_array' => new Twig_Function_Method($this, 'renderArrayMenu', ['is_safe' => ['html']])
        ];
    }

    public function renderArrayMenu(array $menu, array $options)
    {
        $menu = $this->factory->createFromArray(['name' => 'root', 'children' => $menu]);

        return $this->renderer->render($menu, $options);
    }

    /**
     * Returns the name of the extension.
     *
     * @return string The extension name
     */
    public function getName()
    {
        return 'imatic_view_menu';
    }
}
