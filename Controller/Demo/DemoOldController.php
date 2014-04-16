<?php

namespace Imatic\Bundle\ViewBundle\Controller\Demo;

use Sensio\Bundle\FrameworkExtraBundle\Configuration as Config;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * @Config\Route("/old")
 */
class DemoOldController extends Controller
{
    /**
     * @Config\Route()
     * @Config\Template()
     */
    public function indexAction()
    {
        return [];
    }
}
