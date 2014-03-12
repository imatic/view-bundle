<?php

namespace Imatic\Bundle\ViewBundle\Templating\Helper\Layout;

use Symfony\Component\HttpFoundation\RequestStack;

/**
 * Layout helper
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

    /**
     * Constructor
     *
     * @param RequestStack $requestStack
     */
    public function __construct(RequestStack $requestStack)
    {
        $this->requestStack = $requestStack;
    }

    /**
     * See if the layout should be enabled
     *
     * @return bool
     */
    public function hasLayout()
    {
        $request = $this->requestStack->getMasterRequest();

        if (
            $request->isXmlHttpRequest()
            || 'off' === $request->get('_layout')
         ) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * See if flash messages are handled by headers
     *
     * @return bool
     */
    public function hasFlashMessages()
    {
        return $this->hasLayout();
    }

    /**
     * Get title
     *
     * @return string|null
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Check for title
     *
     * @return bool
     */
    public function hasTitle()
    {
        return null !== $this->title;
    }

    /**
     * Set title
     * @param string|null $title
     */
    public function setTitle($title)
    {
        $this->title = ('' !== $title ? $title : null);
    }

    /**
     * Get full title
     *
     * @return string|null
     */
    public function getFullTitle()
    {
        return $this->fullTitle;
    }

    /**
     * Check for full title
     *
     * @return bool
     */
    public function hasFullTitle()
    {
        return null !== $this->fullTitle;
    }

    /**
     * Set full title
     * @param string|null $fullTitle
     */
    public function setFullTitle($fullTitle)
    {
        $this->fullTitle = ('' !== $fullTitle ? $fullTitle : null);
    }
}
