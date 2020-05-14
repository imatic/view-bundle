<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Menu;

class MainMenuBuilder
{
    /**
     * @var ContainerProvider
     */
    protected $provider;

    /**
     * @param ContainerProvider $provider
     */
    public function __construct(ContainerProvider $provider)
    {
        $this->provider = $provider;
    }

    /**
     * @param Factory $factory
     * @param Helper  $helper
     *
     * @return \Knp\Menu\ItemInterface
     */
    public function getMenu($factory, $helper)
    {
        $menu = $factory->createItem('root');

        return $menu;
    }

    /**
     * @param Factory $factory
     * @param Helper  $helper
     *
     * @return \Knp\Menu\ItemInterface
     */
    public function getSideMenu($factory, $helper)
    {
        $menu = $factory->createItem('root');

        if ($helper->isUserLogged()) {
            // Admin menu
            if ($this->provider->has('imatic.admin')) {
                $menu->addChild($this->provider->get('imatic.admin'));
            }
            // User menu - user functions
            if ($this->provider->has('imatic.user')) {
                $menu->addChild($this->provider->get('imatic.user'));
            }
        } else {
            // User menu - login link
            if ($this->provider->has('imatic.user_anon')) {
                $menu->addChild($this->provider->get('imatic.user_anon'));
            }
        }

        return $menu;
    }
}
