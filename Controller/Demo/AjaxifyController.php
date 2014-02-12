<?php

namespace Imatic\Bundle\ViewBundle\Controller\Demo;

use Sensio\Bundle\FrameworkExtraBundle\Configuration as Config;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

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
     * @Config\Route("/ajax-test")
     * @Config\Template()
     */
    public function ajaxTestAction()
    {
        return array(
            'value' => uniqid('', true),
        );
    }

    /**
     * @Config\Route("/ajax-test2")
     * @Config\Template()
     */
    public function ajaxTest2Action()
    {
        return array(
            'value' => uniqid('', true),
        );
    }
}
