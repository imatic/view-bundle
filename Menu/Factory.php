<?php

namespace Imatic\Bundle\ViewBundle\Menu;

use Knp\Menu\ItemInterface;
use Knp\Menu\NodeInterface;
use Knp\Menu\FactoryInterface;

class Factory implements FactoryInterface
{
    /**
     * @var FactoryInterface
     */
    protected $factory;

    /**
     * @param FactoryInterface $factory
     */
    public function __construct(FactoryInterface $factory)
    {
        $this->factory = $factory;
    }

    /**
     * Creates a menu item
     *
     * @param  string                  $name
     * @param  array                   $options
     * @return \Knp\Menu\ItemInterface
     */
    public function createItem($name, array $options = [])
    {
        return $this->factory->createItem($name, $options);
    }

    /**
     * Create a menu item from a NodeInterface
     *
     * @param  \Knp\Menu\NodeInterface $node
     * @return \Knp\Menu\ItemInterface
     */
    public function createFromNode(NodeInterface $node)
    {
        return $this->factory->createFromNode($node);
    }

    /**
     * Creates a new menu item (and tree if $data['children'] is set).
     *
     * The source is an array of data that should match the output from MenuItem->toArray().
     *
     * @param  array                   $data The array of data to use as a source for the menu tree
     * @return \Knp\Menu\ItemInterface
     */
    public function createFromArray(array $data)
    {
        return $this->factory->createFromArray($data);
    }
}
