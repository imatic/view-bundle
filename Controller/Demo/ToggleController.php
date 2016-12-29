<?php

namespace Imatic\Bundle\ViewBundle\Controller\Demo;

use Sensio\Bundle\FrameworkExtraBundle\Configuration as Config;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * @Config\Route("/toggle")
 */
class ToggleController extends Controller
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
