<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Twig\Runtime;

use Imatic\Bundle\ViewBundle\Menu\Factory;
use Knp\Menu\Renderer\RendererInterface;

class MenuRuntime
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
     * @param Factory $factory
     * @param RendererInterface $renderer
     */
    public function __construct(Factory $factory, RendererInterface $renderer)
    {
        $this->factory = $factory;
        $this->renderer = $renderer;
    }

    public function renderArrayMenu(array $menu, array $options)
    {
        $menu = $this->factory->createFromArray(['name' => 'root', 'children' => $menu]);

        return $this->renderer->render($menu, $options);
    }
}
