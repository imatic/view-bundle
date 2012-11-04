<?php

namespace Imatic\Bundle\ViewBundle\Menu;

use Imatic\Bundle\ViewBundle\Menu\Factory;
use Symfony\Component\Security\Core\SecurityContextInterface;
use Symfony\Component\Translation\TranslatorInterface;

class DemoMenuBuilder
{
    /**
     * @param Factory $factory
     * @return \Knp\Menu\ItemInterface
     */
    public function getMenu($factory)
    {
        $menu = $factory->createRoot();

        $menu->addChild('Home', array('route' => 'homepage'));
        $menu->addChild('About', array('route' => 'homepage'))->setCurrent(true);
        $products = $menu->addChild('Products', array('route' => 'homepage'));
        $factory->setBadge($products, 2, 'important', true);
        $menu->addChild('Reference', array('route' => 'homepage'))->setAttribute('class', 'disabled');
        $factory->addDivider($menu, true);
        $contact = $factory->createDropdown($menu, 'Contact');
        $contact->addChild('Test 1', array('route' => 'homepage'));
        $contact->addChild('Test')->setAttribute('class', 'nav-header');
        $contact->addChild('Test 2', array('route' => 'homepage'));
        $factory->addDivider($contact);
        $contact->addChild('Test 3', array('route' => 'homepage'));

        return $menu;
    }
}