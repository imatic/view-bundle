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
     * @Config\Template()
     */
    public function indexAction()
    {
        return array(
            'value' => uniqid('', true),
        );
    }

    /**
     * @Config\Route("/test/ajax")
     * @Config\Template()
     */
    public function ajaxTestAction()
    {
        return array(
            'value' => uniqid('', true),
        );
    }

    /**
     * @Config\Route("/test/form")
     * @Config\Template()
     *
     * @param Request $request
     */
    public function formTestAction(Request $request)
    {
        return array(
            'name' => $request->request->get('name'),
        );
    }

    /**
     * @Config\Route("/test/modal")
     * @Config\Template()
     */
    public function modalTestAction()
    {
        return array(
        );
    }
}
