<?php

namespace Imatic\Bundle\ViewBundle\Menu;

use Knp\Menu\FactoryInterface;
use Knp\Menu\NodeInterface;
use Knp\Menu\ItemInterface;
use Imatic\Bundle\ViewBundle\Util\String;

class Factory implements FactoryInterface
{
    protected $factory;

    public function __construct(FactoryInterface $factory)
    {
        $this->factory = $factory;
    }

    /**
     * Creates a menu item
     *
     * @param string $name
     * @param array $options
     * @return ItemInterface
     */
    public function createItem($name, array $options = array())
    {
        return $this->factory->createItem($name, $options);
    }

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

    /**
     * Adds a vertical/horizontal divider
     *
     * @param ItemInterface $item
     * @param bool $vertical
     * @return ItemInterface
     */
    public function addDivider(ItemInterface $item, $vertical = false)
    {
        $class = $vertical ? 'divider-vertical' : 'divider';
        return $item->addChild('divider_' . rand())
            ->setLabel('')
            ->setAttribute('class', $class);
    }

    /**
     * Creates a drop down menu
     *
     * @param ItemInterface $rootItem
     * @param string $title
     * @return ItemInterface
     */
    public function createDropdown(ItemInterface $rootItem, $title)
    {
        $dropdown = $rootItem
            ->addChild($title, array('uri' => '#'))
            ->setLinkattribute('class', 'dropdown-toggle')
            ->setLinkattribute('data-toggle', 'dropdown')
            ->setAttribute('class', 'dropdown')
            ->setChildrenAttribute('class', 'dropdown-menu');

        $dropdown->setLabel($dropdown->getLabel() . '<span class="caret"></span>');
        $dropdown->setExtra('safe_label', true);

        return $dropdown;
    }

    public function setBadge(ItemInterface $item, $content, $type = null, $right = null)
    {
        $badge = sprintf(' <span class="badge badge-%s %s">%s</span>', $type, $right ? ' pull-right' : '', $content);
        $item
            ->setExtra('safe_label', true)
            ->setLabel(String::escape($item->getLabel()) . $badge);
    }

    public function setIcon(ItemInterface $item, $icon, $right = null)
    {
        $icon = sprintf('<i class="icon-%s pull-%s"></i>', $icon, $right ? 'right' : 'left');
        $item
            ->setExtra('safe_label', true)
            ->setLabel(String::escape($item->getLabel()) . $icon);
    }

    /**
     * Create a menu item from a NodeInterface
     *
     * @param \Knp\Menu\NodeInterface $node
     * @return \Knp\Menu\ItemInterface
     */
    public function createFromNode(NodeInterface $node)
    {
        $this->factory->createFromNode($node);
    }

    /**
     * Creates a new menu item (and tree if $data['children'] is set).
     *
     * The source is an array of data that should match the output from MenuItem->toArray().
     *
     * @param  array $data The array of data to use as a source for the menu tree
     * @return \Knp\Menu\ItemInterface
     */
    public function createFromArray(array $data)
    {
        $this->factory->createFromArray($data);
    }
}