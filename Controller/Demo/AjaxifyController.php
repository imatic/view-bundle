<?php

namespace Imatic\Bundle\ViewBundle\Controller\Demo;

use Sensio\Bundle\FrameworkExtraBundle\Configuration as Config;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

/**
 * @Config\Route("/ajaxify")
 */
class AjaxifyController extends Controller
{
    /**
     * @Config\Route()
     * @Config\Route("/counter/{counter}")
     * @Config\Template()
     */
    public function indexAction($counter = 0)
    {
        return [
            'current_counter_value' => $counter,
            'next_counter_value' => $counter + 1,
        ];
    }

    /**
     * @Config\Route("/test/ajax")
     * @Config\Template()
     */
    public function ajaxTestAction()
    {
        return [
            'uniqid' => uniqid('', true),
        ];
    }

    /**
     * @Config\Route("/test/form")
     * @Config\Template()
     *
     * @param Request $request
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

        return [
            'name' => $request->request->get('name'),
            'pressed_button' => $pressedButton,
        ];
    }

    /**
     * @Config\Route("/test/modal")
     * @Config\Template()
     */
    public function modalTestAction()
    {
        return [];
    }

    /**
     * @Config\Route("/test/flashes")
     * @Config\Template()
     */
    public function flashesTestAction()
    {
        $flashBag = $this->get('session')->getFlashBag();

        $flashBag->add('success', 'I am a success!');
        $flashBag->add('info', 'I am an information!');
        $flashBag->add('warning', 'I am a warning!');
        $flashBag->add('danger', 'I am a danger!');

        return [];
    }
}
