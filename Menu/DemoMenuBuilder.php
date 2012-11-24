<?php

namespace Imatic\Bundle\ViewBundle\Menu;

use Imatic\Bundle\ViewBundle\Menu\Factory;
use Imatic\Bundle\ViewBundle\Menu\Helper;

class DemoMenuBuilder
{
    /**
     * @param Factory $factory
     * @param Helper $helper
     * @return \Knp\Menu\ItemInterface
     */
    public function getMenu(Factory $factory, Helper $helper)
    {
        $menu = $factory->createRoot();

        $menu->addChild('Home', array('route' => 'homepage'));
        $menu->addChild('About', array('route' => 'homepage'))->setCurrent(true);
        $products = $menu->addChild('Products', array('route' => 'homepage'));
        $helper->setBadge($products, 2, 'important', true);
        $menu->addChild('Reference', array('route' => 'homepage'))->setAttribute('class', 'disabled');
        $helper->addDivider($menu, true);
        $contact = $helper->createDropdown($menu, 'Contact');
        $contact->addChild('Test 1', array('route' => 'homepage'));
        $contact->addChild('Test')->setAttribute('class', 'nav-header');
        $contact->addChild('Test 2', array('route' => 'homepage'));
        $helper->addDivider($contact);
        $contact->addChild('Test 3', array('route' => 'homepage'));

        return $menu;
    }
}