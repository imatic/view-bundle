<?php

namespace Imatic\Bundle\ViewBundle\Menu;

use Imatic\Bundle\ViewBundle\Menu\Factory;
use Symfony\Component\Security\Core\SecurityContextInterface;
use Symfony\Component\Translation\TranslatorInterface;

class MainMenuBuilder
{
    /**
     * @var SecurityContextInterface
     */
    protected $securityContext;
    /**
     * @var TranslatorInterface
     */
    protected $translator;
    /**
     * @var boolean
     */
    protected $loggedIn;

    /**
     * @param SecurityContextInterface $securityContext
     * @param TranslatorInterface $translator
     */
    public function __construct(SecurityContextInterface $securityContext, TranslatorInterface $translator)
    {
        $this->securityContext = $securityContext;
        $this->translator = $translator;
        $this->isLoggedIn = false;
        if ($this->securityContext->getToken()) {
            $this->isLoggedIn = $this->securityContext->isGranted('IS_AUTHENTICATED_FULLY');
        }
    }

    /**
     * @param Factory $factory
     * @return \Knp\Menu\ItemInterface
     */
    public function getMenu($factory)
    {
        $menu = $factory->createRoot();

        return $menu;
    }

    /**
     * @param Factory $factory
     * @return \Knp\Menu\ItemInterface
     */
    public function getSideMenu($factory)
    {
        $menu = $factory->createRoot();
        $menu->addChild('Settings', array('route' => 'homepage'));
        $menu->addChild('Help', array('route' => 'homepage'));

        return $menu;
    }
}