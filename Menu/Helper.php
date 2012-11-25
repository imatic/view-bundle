<?php

namespace Imatic\Bundle\ViewBundle\Menu;

use Knp\Menu\ItemInterface;
use Imatic\Bundle\ViewBundle\Util\String;
use Symfony\Component\Security\Core\SecurityContextInterface;
use Symfony\Component\Translation\TranslatorInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class Helper
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
     * @param SecurityContextInterface $securityContext
     * @param TranslatorInterface $translator
     */
    public function __construct(SecurityContextInterface $securityContext, TranslatorInterface $translator)
    {
        $this->securityContext = $securityContext;
        $this->translator = $translator;
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
     * Adds a menu header
     *
     * @param ItemInterface $item
     * @param $text
     * @return ItemInterface
     */
    public function addHeader(ItemInterface $item, $text)
    {
        return $item->addChild('header_' . rand())
            ->setLabel($text)
            ->setAttribute('class', 'nav-header');
    }

    /**
     * Creates a drop down menu item from item
     *
     * @param ItemInterface $dropDownItem
     */
    public function setDropdown(ItemInterface $dropDownItem)
    {
        $dropDownItem
            ->setUri('#')
            ->setLinkattribute('class', 'dropdown-toggle')
            ->setLinkattribute('data-toggle', 'dropdown')
            ->setAttribute('class', 'dropdown')
            ->setChildrenAttribute('class', 'dropdown-menu');

        $dropDownItem->setLabel($dropDownItem->getLabel() . '<span class="caret"></span>');
        $dropDownItem->setExtra('safe_label', true);
    }

    /**
     * Creates a sub menu item from item
     *
     * @param ItemInterface $item
     */
    public function setSubmenu(ItemInterface $item)
    {
        $item->setChildrenAttribute('class', 'nav nav-list');
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
     * Translates the given choice message by choosing a translation according to a number.
     *
     * @param string  $id         The message id
     * @param integer $number     The number to use to find the indice of the message
     * @param array   $parameters An array of parameters for the message
     * @param string  $domain     The domain for the message
     * @param string  $locale     The locale
     *
     * @return string The translated string
     */
    public function transChoice($id, $number, array $parameters = array(), $domain = null, $locale = null)
    {
        $this->transChoice($id, $number, $parameters, $domain, $locale);
    }

    /**
     * Translates the given message.
     *
     * @param string $id         The message id
     * @param array  $parameters An array of parameters for the message
     * @param string $domain     The domain for the message
     * @param string $locale     The locale
     *
     * @return string The translated string
     */
    public function trans($id, array $parameters = array(), $domain = null, $locale = null)
    {
        return $this->translator->trans($id, $parameters, $domain, $locale);
    }

    /**
     * Returns the current locale.
     *
     * @return string The locale
     */
    public function getLocale()
    {
        $this->translator->getLocale();
    }

    /**
     * Returns true if current user is logged
     *
     * @return bool
     */
    public function isUserLogged()
    {
        $logged = false;
        if ($this->securityContext->getToken()) {
            $logged = $this->securityContext->isGranted('IS_AUTHENTICATED_FULLY');
        }

        return $logged;
    }

    /**
     * @return null|UserInterface
     */
    public function getUser()
    {
        $user = null;
        if ($this->securityContext->getToken()) {
            $user = $this->securityContext->getToken()->getUser();
        }

        return $user;
    }

    /**
     * Checks if the attributes are granted against the current authentication token and optionally supplied object.
     *
     * @param array $attributes
     * @param mixed $object
     *
     * @return Boolean
     */
    public function isUserGranted($attributes, $object = null)
    {
        return $this->securityContext->isGranted($attributes, $object);
    }
}