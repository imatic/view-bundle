<?php

namespace Imatic\Bundle\ViewBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

/**
 * @Route("/imatic/view/demo")
 */
class DemoController extends Controller
{
    /**
     * @Route()
     * @Template()
     */
    public function indexAction()
    {
        return array();
    }

    /**
     * @Route("/component")
     * @Template()
     */
    public function componentAction()
    {
        return array();
    }

    /**
     * @Route("/component/ajax-test")
     * @Template()
     */
    public function ajaxTestAction()
    {
        return array(
            'value' => uniqid('', true),
        );
    }
}
