<?php

namespace Imatic\Bundle\ViewBundle\EventListener;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\HttpKernel\Event\FilterResponseEvent;
use Symfony\Component\Translation\TranslatorInterface;
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
    /** @var TranslatorInterface */
    private $translator;

    public function __construct(LayoutHelper $layoutHelper, TranslatorInterface $translator)
    {
        $this->layoutHelper = $layoutHelper;
        $this->translator = $translator;
    }

    /**
     * On kernel response
     *
     * @param FilterResponseEvent $event
     */
    public function onKernelResponse(FilterResponseEvent $event)
    {
        if ($event->isMasterRequest()) {
            $request = $event->getRequest();
            $response = $event->getResponse();

            if ($request->isXmlHttpRequest() && !$response->isRedirection()) {
                // flash messages
                if ($request->hasSession() && !$response->headers->has('X-Flash-Messages')) {
                    $this->setFlashMessageHeader($response, $request->getSession());
                }

                // title, fullTitle
                $this->setTitleHeaders($response);
            }
        }
    }

    private function setFlashMessageHeader(Response $response, SessionInterface $session)
    {
        $flashBag = $session->getFlashBag();

        $flashes = [];

        foreach ($flashBag->all() as $type => $messages) {
            for ($i = 0; isset($messages[$i]); ++$i) {
                $flashes[] = [
                    'type' => $type,
                    'message' => $this->translator->trans($messages[$i], [], 'messages'),
                ];
            }
        }

        $response->headers->set(
            'X-Flash-Messages',
            json_encode($flashes)
        );
    }

    private function setTitleHeaders(Response $response)
    {
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
