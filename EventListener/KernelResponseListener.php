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

        if (
            !$this->layoutHelper->hasFlashMessages()
            && !$response->isRedirection()
            && !$response->headers->has('X-Flash-Messages')
        ) {
            $flashBag = $this->session->getFlashBag();

            $flashes = [];

            foreach ($flashBag->all() as $type => $messages) {
                for ($i = 0; isset($messages[$i]); ++$i) {
                    $flashes[] = [
                        'type' => $type,
                        'message' => $messages[$i],
                    ];
                }
            }

            $response->headers->set(
                'X-Flash-Messages',
                json_encode($flashes)
            );

        }

        $title = [];

        if ($this->layoutHelper->hasTitle()) {
            $title['title'] = $this->layoutHelper->getTitle();
        }

        if ($this->layoutHelper->hasFullTitle()) {
            $title['fullTitle'] = $this->layoutHelper->getFullTitle();
        }

        if (!empty($title)) {
            $response->headers->set(
                'X-Title',
                json_encode($title)
            );
        }
    }
}
