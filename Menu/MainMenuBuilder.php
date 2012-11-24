<?php

namespace Imatic\Bundle\ViewBundle\Menu;

use Imatic\Bundle\ViewBundle\Menu\Factory;
use Imatic\Bundle\ViewBundle\Menu\Helper;

class MainMenuBuilder
{
    /**
     * @param Factory $factory
     * @param Helper $helper
     * @return \Knp\Menu\ItemInterface
     */
    public function getMenu($factory, $helper)
    {
        $menu = $factory->createRoot();

        return $menu;
    }

    /**
     * @param Factory $factory
     * @param Helper $helper
     * @return \Knp\Menu\ItemInterface
     */
    public function getSideMenu($factory, $helper)
    {
        $menu = $factory->createRoot();
        $menu->addChild('Settings', array('uri' => 'fos_user_login'));
        $menu->addChild('Help', array('route' => 'homepage'));

        return $menu;
    }
}