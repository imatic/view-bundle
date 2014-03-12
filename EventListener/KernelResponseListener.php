<?php

namespace Imatic\Bundle\ViewBundle\EventListener;

use Symfony\Component\HttpKernel\Event\FilterResponseEvent;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Imatic\Bundle\ViewBundle\Templating\Helper\Layout\LayoutHelper;

/**
 * Kernel response listener
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
class KernelResponseListener
{
    /** @var LayoutHelper */
    private $layoutHelper;
    /** @var SessionInterface */
    private $session;

    /**
     * Constructor
     *
     * @param LayoutHelper     $layoutHelper
     * @param SessionInterface $session
     */
    public function __construct(LayoutHelper $layoutHelper, SessionInterface $session)
    {
        $this->layoutHelper = $layoutHelper;
        $this->session = $session;
    }

    /**
     * On kernel response
     *
     * @param FilterResponseEvent $event
     */
    public function onKernelResponse(FilterResponseEvent $event)
    {
        $response = $event->getResponse();

        if (!$this->layoutHelper->hasFlashMessages() && !$response->isRedirection()) {
            $flashBag = $this->session->getFlashBag();

            $flashes = array();
            foreach ($flashBag->all() as $type => $messages) {
                for ($i = 0; isset($messages[$i]); ++$i) {
                    $flashes[] = array(
                        'type' => $type,
                        'message' => $messages[$i],
                    );
                }
            }

            $response->headers->set(
                'X-Flash-Messages',
                json_encode($flashes)
            );

        }

        if ($this->layoutHelper->hasTitle()) {
            $response->headers->set(
                'X-Title',
                $this->layoutHelper->getTitle()
            );
        }

        if ($this->layoutHelper->hasFullTitle()) {
            $response->headers->set(
                'X-Full-Title',
                $this->layoutHelper->getFullTitle()
            );
        }
    }
}
