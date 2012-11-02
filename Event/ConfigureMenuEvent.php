<?php

namespace Imatic\Bundle\ViewBundle\Event;

use Symfony\Component\EventDispatcher\Event;
use Knp\Menu\ItemInterface;
use Imatic\Bundle\ViewBundle\Menu\Factory;

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
     * @var string
     */
    protected $alias;

    /**
     * @param ItemInterface $menu
     * @param Factory $factory
     * @param string $alias
     */
    public function __construct(ItemInterface $menu, Factory $factory, $alias)
    {
        $this->menu = $menu;
        $this->factory = $factory;
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
     * @return string
     */
    public function getAlias()
    {
        return $this->alias;
    }
}