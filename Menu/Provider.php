<?php

namespace Imatic\Bundle\ViewBundle\Menu;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Knp\Menu\ItemInterface;
use Knp\Menu\Provider\MenuProviderInterface;
use Imatic\Bundle\ViewBundle\Event\ConfigureMenuEvent;
use Imatic\Bundle\ViewBundle\Event\ViewEvents;

class Provider implements MenuProviderInterface
{
    /**
     * @var ContainerInterface
     */
    protected $container;

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
     */
    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
        $this->menuInfoCollection = array();
        $this->menuCollection = array();
    }

    /**
     * @param string $alias Menu alias
     * @param array $info Menu info (service ID, method name)
     * @return void
     */
    public function addService($alias, $info)
    {
        $this->menuInfoCollection[$alias] = $info;
    }

    /**
     * Retrieves a menu by its name
     *
     * @param string $name
     * @param array $options
     * @return \Knp\Menu\ItemInterface
     * @throws \InvalidArgumentException if the menu does not exists
     */
    function get($name, array $options = array())
    {
        if (!isset($this->menuCollection[$name])) {
            if (!isset($this->menuInfoCollection[$name])) {
                throw new \InvalidArgumentException(sprintf('The menu "%s" is not defined.', $name));
            }

            $menuInfo = $this->menuInfoCollection[$name];
            $service = $menuInfo['id'];
            $method = isset($menuInfo['method']) ? $menuInfo['method'] : 'getMenu';
            $factory = $this->container->get('imatic_view.menu.factory');
            $menu = $this->container->get($service)->$method($factory);

            $event = new ConfigureMenuEvent($menu, $factory, $name);
            $this->container->get('event_dispatcher')->dispatch('imatic_view.configure_menu.' . $name, $event);

            $this->menuCollection[$name] = $menu;
        }

        return $this->menuCollection[$name];
    }

    /**
     * Checks whether a menu exists in this provider
     *
     * @param string $name
     * @param array $options
     * @return bool
     */
    function has($name, array $options = array())
    {
        return isset($this->menuInfoCollection[$name]);
    }
}