<?php

namespace Imatic\Bundle\ViewBundle\Menu;

use Knp\Menu\FactoryInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\SecurityContextInterface;
use Mopa\Bundle\BootstrapBundle\Navbar\AbstractNavbarMenuBuilder;

class NavbarBuilder extends AbstractNavbarMenuBuilder
{
    protected $securityContext;
    protected $isLoggedIn;

    public function __construct(FactoryInterface $factory, SecurityContextInterface $securityContext)
    {
        parent::__construct($factory);

        $this->securityContext = $securityContext;

        $this->isLoggedIn = false;
        if ($this->securityContext->getToken()) {
            $this->isLoggedIn = $this->securityContext->isGranted('IS_AUTHENTICATED_FULLY');
        }
    }

    public function createMainMenu(Request $request)
    {
        $menu = $this->factory->createItem('root');
        $menu->setChildrenAttribute('class', 'nav');
        $this->addDivider($menu, true);

        return $menu;
    }

    public function createMainRightMenu(Request $request)
    {
        $menu = $this->factory->createItem('root');
        $menu->setChildrenAttribute('class', 'nav pull-right');

        $menu->addChild('Settings', array('route' => 'homepage'));
        $menu->addChild('Help', array('route' => 'homepage'));

        $this->addDivider($menu, true);

        if ($this->isLoggedIn) {
            $userMenu = $this->createDropdownMenuItem($menu, $this->securityContext->getToken()->getUser());
            $userMenu->addChild('Profile', array('route' => 'fos_user_profile_show'));
            $userMenu->addChild('Change password', array('route' => 'fos_user_change_password'));
            $this->addDivider($userMenu);
            $userMenu->addChild('Logout', array('route' => 'fos_user_security_logout'));
        } else {
            $menu->addChild('Login', array('route' => 'fos_user_security_login'));
        }

        return $menu;
    }
}
