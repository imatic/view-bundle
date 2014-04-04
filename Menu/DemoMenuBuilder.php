<?php

namespace Imatic\Bundle\ViewBundle\Menu;

class DemoMenuBuilder
{
    /**
     * @param  Factory $factory
     * @param  Helper $helper
     * @return \Knp\Menu\ItemInterface
     */
    public function getMenu(Factory $factory, Helper $helper)
    {
        // Create root item
        $menu = $factory->createItem('root');

        // Add menu items
        $menu->addChild('Home', ['route' => 'imatic_view_demo_demo_index']);
        $componentIndex = $menu->addChild('Components', ['uri' => '#']);
        $helper->setDropdown($componentIndex);
        $componentIndex->addChild($factory->createItem('Basic', ['route' => 'imatic_view_demo_component_index']));
        $componentIndex->addChild($factory->createItem('Layout', ['route' => 'imatic_view_demo_component_layout']));
        $componentIndex->addChild($factory->createItem('Panel', ['route' => 'imatic_view_demo_component_panel']));
        $componentIndex->addChild($factory->createItem('Grid', ['route' => 'imatic_view_demo_component_grid']));
        $componentIndex->addChild($factory->createItem('Form', ['route' => 'imatic_view_demo_component_form']));
        $componentIndex->addChild($factory->createItem('Show', ['route' => 'imatic_view_demo_component_show']));
        $componentIndex->addChild($factory->createItem('Tabs', ['route' => 'imatic_view_demo_component_tabs']));
        $componentIndex->addChild($factory->createItem('Menu', ['route' => 'imatic_view_demo_component_menu']));

        $javaScriptIndex = $menu->addChild('JavaScript', array('uri' => '#'));
        $helper->setDropdown($javaScriptIndex);
        $javaScriptIndex->addChild('Ajaxify', array('route' => 'imatic_view_demo_ajaxify_index'));
        $javaScriptIndex->addChild('Toggle', array('route' => 'imatic_view_demo_toggle_index'));

        return $menu;
    }

    /**
     * @param  Factory $factory
     * @param  Helper $helper
     * @return \Knp\Menu\ItemInterface
     */
    public function getSubMenu(Factory $factory, Helper $helper)
    {
        $menu = $this->getNormalMenu($factory, $helper);
        $products = $menu->getChild('Products');

        // Add header
        $helper->addHeader($products, 'Products A');
        // Set submenu for products
        $helper->setSubmenu($products);
        $products->addChild('Product 1', array('route' => 'homepage'));
        $products->addChild('Product 2', array('route' => 'homepage'));
        $products->addChild('Product 3', array('route' => 'homepage'));
        // Add header
        $helper->addHeader($products, 'Products B');
        $products->addChild('Product 4', array('route' => 'homepage'));
        $products->addChild('Product 5', array('route' => 'homepage'));
        $products->addChild('Product 6', array('route' => 'homepage'));

        return $menu;
    }

    /**
     * @param  Factory $factory
     * @param  Helper $helper
     * @return \Knp\Menu\ItemInterface
     */
    public function getNormalMenu(Factory $factory, Helper $helper)
    {
        // Create root item
        $menu = $factory->createItem('root');

        // Add menu items
        $menu->addChild('Home', array('route' => 'homepage'));
        $menu->addChild('About', array('route' => 'homepage'))->setCurrent(true);
        $products = $menu->addChild('Products', array('route' => 'homepage'));
        $menu->addChild('Reference', array('route' => 'homepage'))->setAttribute('class', 'disabled');
        // Add vertical divider
        $helper->addDivider($menu, true);
        $contact = $menu->addChild('Contact', array('route' => 'homepage'));

        // Set badge for products
        $helper->setBadge($products, 2, 'important', true);

        // Set dropdown menu for contact
        $helper->setDropdown($contact);
        $contact->addChild('Test 1', array('route' => 'homepage'));
        $contact->addChild('Test')->setAttribute('class', 'nav-header');
        $contact->addChild('Test 2', array('route' => 'homepage'));
        // Add horizontal divider
        $helper->addDivider($contact);
        $contact->addChild('Test 3', array('uri' => 'http://www.imatic.cz'));

        return $menu;
    }
}
