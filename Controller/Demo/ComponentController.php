<?php

namespace Imatic\Bundle\ViewBundle\Controller\Demo;

use Imatic\Bundle\ViewBundle\Controller\Demo\Helper\TableData;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as Config;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * @Config\Route("/component")
 */
class ComponentController extends Controller
{
    /**
     * @Config\Route()
     * @Config\Template()
     */
    public function indexAction()
    {
        return [];
    }

    /**
     * @Config\Route("/grid")
     * @Config\Template()
     */
    public function gridAction()
    {
        $data = new TableData();

        return ['items' => $data];
    }

    /**
     * @Config\Route("/form")
     * @Config\Template()
     */
    public function formAction()
    {
        return [];
    }

    /**
     * @Config\Route("/show")
     * @Config\Template()
     */
    public function showAction()
    {
        return [];
    }
}
