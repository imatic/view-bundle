<?php
namespace Imatic\Bundle\ViewBundle\Menu;

use Imatic\Bundle\ViewBundle\Event\ConfigureMenuEvent;
use Knp\Menu\ItemInterface;
use Knp\Menu\Provider\MenuProviderInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

class ContainerProvider implements MenuProviderInterface
{
    /**
     * @var ContainerInterface
     */
    protected $container;

    /**
     * @var Factory
     */
    protected $factory;

    /**
     * @var Helper
     */
    protected $helper;

    /**
     * @var array
     */
    protected $menuInfoCollection;

    /**
     * @var array
     */
    protected $menuCollection;

    /**
     * @param ContainerInterface $container
     * @param Factory            $factory
     * @param Helper             $helper
     */
    public function __construct(ContainerInterface $container, Factory $factory, Helper $helper)
    {
        $this->container = $container;
        $this->factory = $factory;
        $this->helper = $helper;

        $this->menuInfoCollection = [];
        $this->menuCollection = [];
    }

    /**
     * @param string $alias Menu alias
     * @param array  $info  Menu info (service ID, method name)
     */
    public function addService($alias, $info)
    {
        $this->menuInfoCollection[$alias] = $info;
    }

    /**
     * Retrieves a menu by its name.
     *
     * @param string $name
     * @param array  $options
     *
     * @return ItemInterface
     *
     * @throws \InvalidArgumentException if the menu does not exists
     */
    public function get($name, array $options = [])
    {
        if (!isset($this->menuCollection[$name])) {
            if (!isset($this->menuInfoCollection[$name])) {
                throw new \InvalidArgumentException(\sprintf('The menu "%s" is not defined.', $name));
            }

            $menuInfo = $this->menuInfoCollection[$name];
            $service = $menuInfo['id'];
            $method = isset($menuInfo['method']) ? $menuInfo['method'] : 'getMenu';
            $menu = $this->container->get($service)->$method($this->factory, $this->helper);

            $event = new ConfigureMenuEvent($menu, $this->factory, $this->helper, $name);
            $this->container->get('event_dispatcher')->dispatch('imatic_view.configure_menu.' . $name, $event);

            $this->menuCollection[$name] = $menu;
        }

        return $this->menuCollection[$name];
    }

    /**
     * Checks whether a menu exists in this provider.
     *
     * @param string $name
     * @param array  $options
     *
     * @return bool
     */
    public function has($name, array $options = [])
    {
        return isset($this->menuInfoCollection[$name]);
    }
}
