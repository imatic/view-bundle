<?php

namespace Imatic\Bundle\ViewBundle\Menu;

use Knp\Menu\MenuFactory;
use Knp\Menu\ItemInterface;

class Factory extends MenuFactory
{
    /**
     * Creates a root menu item
     *
     * @param string $name
     * @param array $options
     * @return ItemInterface
     */
    public function createRoot($name = 'root', array $options = array())
    {
        $item = $this->createItem($name, $options);
        $item->setChildrenAttribute('class', '%%children_attribute_class%%');

        return $item;
    }
}