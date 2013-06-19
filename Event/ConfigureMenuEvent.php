<?php

namespace Imatic\Bundle\ViewBundle\Event;

use Imatic\Bundle\ViewBundle\Menu\Factory;
use Imatic\Bundle\ViewBundle\Menu\Helper;
use Knp\Menu\ItemInterface;
use Symfony\Component\EventDispatcher\Event;

/**
 * Configure menu event
 */
class ConfigureMenuEvent extends Event
{
    /**
     * @var ItemInterface
     */
    protected $menu;
    /**
     * @var Factory
     */
    protected $factory;
    /**
     * @var Helper
     */
    protected $helper;
    /**
     * @var string
     */
    protected $alias;

    /**
     * @param ItemInterface $menu
     * @param Factory       $factory
     * @param Helper        $helper
     * @param string        $alias
     */
    public function __construct(ItemInterface $menu, Factory $factory, Helper $helper, $alias)
    {
        $this->menu = $menu;
        $this->factory = $factory;
        $this->helper = $helper;
    }

    /**
     * @return ItemInterface
     */
    public function getMenu()
    {
        return $this->menu;
    }

    /**
     * @return Factory
     */
    public function getFactory()
    {
        return $this->factory;
    }

    /**
     * @return Helper
     */
    public function getHelper()
    {
        return $this->helper;
    }

    /**
     * @return string
     */
    public function getAlias()
    {
        return $this->alias;
    }
}
