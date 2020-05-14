<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Menu;

use Imatic\Bundle\ViewBundle\Templating\Utils\StringUtil;
use Knp\Menu\ItemInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationCredentialsNotFoundException;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

class Helper
{
    /**
     * @var TranslatorInterface
     */
    protected $translator;
    /**
     * @var Security
     */
    private $security;

    /**
     * @param TranslatorInterface $translator
     * @param Security            $security
     */
    public function __construct(TranslatorInterface $translator, Security $security)
    {
        $this->translator = $translator;
        $this->security = $security;
    }

    /**
     * Creates a drop down menu item from item.
     *
     * @param ItemInterface $dropDownItem
     * @param string        $aligment
     */
    public function setDropdown(ItemInterface $dropDownItem, string $aligment = null)
    {
        $dropDownItem
            ->setUri('#')
            ->setAttribute('class', 'dropdown')
            ->setLinkAttribute('class', 'dropdown-toggle')
            ->setLinkAttribute('data-toggle', 'dropdown')
        ;

        if ($aligment) {
            $dropDownItem->setExtra('alignment', $aligment);
        }
    }

    public function setBadge(ItemInterface $item, $content, $type = null)
    {
        $badge = \sprintf(' <span class="badge badge-%s">%s</span>', $type ?? 'light', $content);
        $item
            ->setExtra('safe_label', true)
            ->setLabel(StringUtil::escape($item->getLabel()) . $badge)
        ;
    }

    public function setIcon(ItemInterface $item, $icon)
    {
        $icon = \sprintf('<i class="imatic-view-menu-icon fas fa-%s"></i> ', $icon);
        $item
            ->setExtra('safe_label', true)
            ->setLabel($icon . StringUtil::escape($item->getLabel()))
        ;
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
    public function trans($id, array $parameters = [], $domain = null, $locale = null): string
    {
        return $this->translator->trans($id, $parameters, $domain, $locale);
    }

    /**
     * Returns the current locale.
     *
     * @return string The locale
     */
    public function getLocale(): string
    {
        return $this->translator->getLocale();
    }

    /**
     * Returns true if current user is logged.
     *
     * @return bool
     */
    public function isUserLogged(): bool
    {
        try {
            return $this->security->isGranted('IS_AUTHENTICATED_REMEMBERED');
        } catch (AuthenticationCredentialsNotFoundException $e) {
            return false;
        }
    }

    /**
     * @return null|UserInterface
     */
    public function getUser(): ?UserInterface
    {
        return $this->security->getUser();
    }

    /**
     * Checks if the attributes are granted against the current authentication token and optionally supplied object.
     *
     * @param mixed $attributes
     * @param mixed $subject
     *
     * @return bool
     */
    public function isUserGranted($attributes, $subject = null): bool
    {
        try {
            return $this->security->isGranted($attributes, $subject);
        } catch (AuthenticationCredentialsNotFoundException $e) {
            return false;
        }
    }
}
