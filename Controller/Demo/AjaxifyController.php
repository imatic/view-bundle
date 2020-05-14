<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Controller\Demo;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/ajaxify")
 */
class AjaxifyController extends AbstractController
{
    /**
     * @Route("/")
     *
     * @return Response
     */
    public function indexAction()
    {
        return $this->render('@ImaticView/Demo/Ajaxify/index.html.twig');
    }

    /**
     * @Route("/test/ajax")
     *
     * @return Response
     */
    public function ajaxTestAction()
    {
        return $this->render('@ImaticView/Demo/Ajaxify/ajax_test.html.twig', [
            'uniqid' => \uniqid('', true),
        ]);
    }

    /**
     * @Route("/test/form")
     *
     * @param Request $request
     *
     * @return Response
     */
    public function formTestAction(Request $request)
    {
        if ($request->request->has('a')) {
            $pressedButton = 'A';
        } elseif ($request->request->has('b')) {
            $pressedButton = 'B';
        } else {
            $pressedButton = '?';
        }

        return $this->render('@ImaticView/Demo/Ajaxify/form_test.html.twig', [
            'name' => $request->request->get('name'),
            'pressed_button' => $pressedButton,
        ]);
    }

    /**
     * @Route("/test/modal")
     *
     * @return Response
     */
    public function modalTestAction()
    {
        return $this->render('@ImaticView/Demo/Ajaxify/modal_test.html.twig');
    }

    /**
     * @Route("/test/flashes")
     *
     * @return Response
     */
    public function flashesTestAction()
    {
        $flashBag = $this->get('session')->getFlashBag();

        $flashBag->add('success', 'I am a success!');
        $flashBag->add('info', 'I am an information!');
        $flashBag->add('warning', 'I am a warning!');
        $flashBag->add('danger', 'I am a danger!');

        return $this->render('@ImaticView/Demo/Ajaxify/flashes_test.html.twig');
    }
}
