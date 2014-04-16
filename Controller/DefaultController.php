<?php

namespace Imatic\Bundle\ViewBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration as Config;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * @Config\Route()
 */
class DefaultController extends Controller
{
    /**
     * @Config\Route("/", name="homepage")
     * @Config\Template()
     */
    public function indexAction()
    {
        return [];
    }
}
