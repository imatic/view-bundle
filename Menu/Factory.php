<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Menu;

use Knp\Menu\FactoryInterface;
use Knp\Menu\ItemInterface;
use Knp\Menu\Loader\ArrayLoader;
use Knp\Menu\Loader\LoaderInterface;
use Knp\Menu\Loader\NodeLoader;
use Knp\Menu\NodeInterface;

class Factory implements FactoryInterface
{
    /**
     * @var FactoryInterface
     */
    protected $factory;

    /**
     * @var LoaderInterface
     */
    protected $arrayLoader;

    /**
     * @var LoaderInterface
     */
    protected $nodeLoader;

    /**
     * @param FactoryInterface $factory
     */
    public function __construct(FactoryInterface $factory)
    {
        $this->factory = $factory;

        $this->arrayLoader = new ArrayLoader($factory);
        $this->nodeLoader = new NodeLoader($factory);
    }

    public function createItem($name, array $options = []): ItemInterface
    {
        return $this->factory->createItem($name, $options);
    }

    /**
     * Create a menu item from a NodeInterface.
     *
     * @param NodeInterface $node
     *
     * @return ItemInterface
     */
    public function createFromNode(NodeInterface $node): ItemInterface
    {
        return $this->nodeLoader->load($node);
    }

    /**
     * Creates a new menu item (and tree if $data['children'] is set).
     *
     * The source is an array of data that should match the output from MenuItem->toArray().
     *
     * @param array $data The array of data to use as a source for the menu tree
     *
     * @return ItemInterface
     */
    public function createFromArray(array $data): ItemInterface
    {
        return $this->arrayLoader->load($data);
    }
}
