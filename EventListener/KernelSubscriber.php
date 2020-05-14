<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\EventListener;

use Imatic\Bundle\ViewBundle\Templating\Helper\Layout\LayoutHelper;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Contracts\Translation\TranslatorInterface;

/**
 * Kernel subscriber.
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
class KernelSubscriber implements EventSubscriberInterface
{
    /** @var LayoutHelper */
    private $layoutHelper;
    /** @var TranslatorInterface */
    private $translator;
    /** @var bool */
    private $debug;
    /** @var \Throwable|null */
    private $lastException;

    /**
     * @param LayoutHelper        $layoutHelper
     * @param TranslatorInterface $translator
     * @param bool                $debug
     */
    public function __construct(LayoutHelper $layoutHelper, TranslatorInterface $translator, $debug)
    {
        $this->layoutHelper = $layoutHelper;
        $this->translator = $translator;
        $this->debug = $debug;
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::RESPONSE => 'onKernelResponse',
            KernelEvents::EXCEPTION => 'onKernelException',
        ];
    }

    /**
     * On kernel response.
     *
     * @param ResponseEvent $event
     */
    public function onKernelResponse(ResponseEvent $event)
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

                // exception info (debug only)
                if ($this->debug && $this->lastException) {
                    $this->setExceptionHeader($response, $this->lastException);
                    $this->lastException = null;
                }
            }
        }
    }

    public function onKernelException(ExceptionEvent $event)
    {
        if ($this->debug) {
            $this->lastException = $event->getThrowable();
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
            \json_encode($flashes)
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
                \json_encode($title)
            );
        }
    }

    private function setExceptionHeader(Response $response, \Throwable $exception)
    {
        $info = [
            'className' => \get_class($exception),
            'message' => $exception->getMessage(),
            'file' => $exception->getFile(),
            'line' => $exception->getLine(),
            'trace' => $exception->getTraceAsString(),
        ];

        // make sure all string values are valid UTF-8
        // (error messages coming from the OS may not be UTF-8 encoded)
        \array_walk($info, function (&$value) {
            if (\is_string($value)) {
                $value = \iconv('UTF-8', 'UTF-8//IGNORE', $value);
            }
        });

        $jsonString = \json_encode($info);

        if (false !== $jsonString) {
            $response->headers->set('X-Debug-Exception', $jsonString);
        }
    }
}
