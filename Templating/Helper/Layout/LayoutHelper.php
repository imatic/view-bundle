<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Templating\Helper\Layout;

use Symfony\Component\HttpFoundation\RequestStack;

/**
 * Layout helper.
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
class LayoutHelper
{
    /** @var RequestStack */
    private $requestStack;
    /** @var string|null */
    private $title;
    /** @var string|null */
    private $fullTitle;

    public function __construct(RequestStack $requestStack)
    {
        $this->requestStack = $requestStack;
    }

    /**
     * See if the layout should be enabled.
     *
     * @return bool
     */
    public function hasLayout()
    {
        $masterRequest = $this->requestStack->getMasterRequest();
        $currentRequest = $this->requestStack->getCurrentRequest();

        if (
            $masterRequest->isXmlHttpRequest()
            || 'off' === $masterRequest->get('_layout')
            || (
                $currentRequest !== $masterRequest
                && !$currentRequest->attributes->has('exception')
                && !$currentRequest->attributes->get('_layout', false)
            )
        ) {
            return false;
        }
        return true;
    }

    /**
     * See if the request comes from inside of a modal dialog.
     *
     * @return bool
     */
    public function isModalDialog()
    {
        return $this->requestStack->getMasterRequest()->headers->has('X-Modal-Dialog');
    }

    /**
     * Get title.
     *
     * @return string|null
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set title.
     *
     * @param string|null $title
     */
    public function setTitle($title)
    {
        $this->title = ('' !== $title ? $title : null);
    }

    /**
     * Check for title.
     *
     * @return bool
     */
    public function hasTitle()
    {
        return null !== $this->title;
    }

    /**
     * Get full title.
     *
     * @return string|null
     */
    public function getFullTitle()
    {
        return $this->fullTitle;
    }

    /**
     * Set full title.
     *
     * @param string|null $fullTitle
     */
    public function setFullTitle($fullTitle)
    {
        $this->fullTitle = ('' !== $fullTitle ? $fullTitle : null);
    }

    /**
     * Check for full title.
     *
     * @return bool
     */
    public function hasFullTitle()
    {
        return null !== $this->fullTitle;
    }
}
