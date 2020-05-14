<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Menu;

use Knp\Menu\ItemInterface;

class DemoMenuBuilder
{
    /**
     * @param Factory $factory
     * @param Helper  $helper
     *
     * @return ItemInterface
     */
    public function getMenu(Factory $factory, Helper $helper)
    {
        // Create root item
        $menu = $factory->createItem('root');

        // Add menu items
        $menu->addChild('Home', ['route' => 'imatic_view_demo_demo_index']);
        $componentIndex = $menu->addChild('Components');
        $helper->setDropdown($componentIndex);
        $componentIndex->addChild($factory->createItem('Basic', ['route' => 'imatic_view_demo_component_index']));
        $componentIndex->addChild($factory->createItem('Layout', ['route' => 'imatic_view_demo_component_layout']));
        $componentIndex->addChild($factory->createItem('Panel', ['route' => 'imatic_view_demo_component_panel']));
        $componentIndex->addChild($factory->createItem('Grid', ['route' => 'imatic_view_demo_component_grid']));
        $componentIndex->addChild($factory->createItem('Form', ['route' => 'imatic_view_demo_component_form']));
        $componentIndex->addChild($factory->createItem('Show', ['route' => 'imatic_view_demo_component_show']));
        $componentIndex->addChild($factory->createItem('Tabs', ['route' => 'imatic_view_demo_component_tabs']));
        $componentIndex->addChild($factory->createItem('Menu', ['route' => 'imatic_view_demo_component_menu']));
        $componentIndex->addChild($factory->createItem('Formatter', ['route' => 'imatic_view_demo_component_formatter']));

        $javaScriptIndex = $menu->addChild('JavaScript');
        $helper->setDropdown($javaScriptIndex);
        $javaScriptIndex->addChild('Ajaxify', ['route' => 'imatic_view_demo_ajaxify_index']);
        $javaScriptIndex->addChild('Toggle', ['route' => 'imatic_view_demo_toggle_index']);

        return $menu;
    }

    /**
     * @param Factory $factory
     * @param Helper  $helper
     *
     * @return ItemInterface
     */
    public function getSubMenu(Factory $factory, Helper $helper)
    {
        // Create root item
        $menu = $factory->createItem('root');

        $products = $menu->addChild('Products', ['route' => 'homepage']);
        $helper->setBadge($products, 2, 'secondary');

        // Add menu items
        $menu->addChild('Products A');
        $menu->addChild('Product 1', ['route' => 'homepage']);
        $menu->addChild('Product 2', ['route' => 'homepage']);
        $menu->addChild('Product 3', ['route' => 'homepage'])->setCurrent(true);

        $menu->addChild('Products B');
        $menu->addChild('Product 4', ['route' => 'homepage']);
        $menu->addChild('Product 5', ['route' => 'homepage']);
        $menu->addChild('Product 6', ['route' => 'homepage']);

        return $menu;
    }

    /**
     * @param Factory $factory
     * @param Helper  $helper
     *
     * @return ItemInterface
     */
    public function getNormalMenu(Factory $factory, Helper $helper)
    {
        // Create root item
        $menu = $factory->createItem('root');

        // Add menu items
        $menu->addChild('Home', ['route' => 'homepage']);
        $menu->addChild('About', ['route' => 'homepage'])->setCurrent(true);

        $products = $menu->addChild('Products', ['route' => 'homepage']);
        // Set badge for products
        $helper->setBadge($products, 2, 'secondary');

        $menu->addChild('Reference', ['route' => 'homepage'])->setLinkAttribute('class', 'disabled');
        $contact = $menu->addChild('Contact', ['route' => 'homepage']);

        // Set dropdown menu for contact
        $helper->setDropdown($contact);
        $contact->addChild('Test 1', ['route' => 'homepage']);
        $contact->addChild('Test')->setLabelAttribute('class', 'nav-header');
        $contact
            ->addChild('Test 2', ['route' => 'homepage'])
            ->setAttribute('divider', true)
        ;

        $item = $contact->addChild('Test 3', ['uri' => 'http://www.imatic.cz']);

        $helper->setIcon($item, 'file-alt');

        return $menu;
    }
}
