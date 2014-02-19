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
}
