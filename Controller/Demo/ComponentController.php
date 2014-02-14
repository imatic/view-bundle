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
     * @Config\Route("/grid")
     * @Config\Template()
     */
    public function gridAction()
    {
        $data = new TableData();

        return ['items' => $data];
    }
}
