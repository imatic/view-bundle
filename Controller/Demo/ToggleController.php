<?php
namespace Imatic\Bundle\ViewBundle\Controller\Demo;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/toggle")
 */
class ToggleController extends Controller
{
    /**
     * @Route("/")
     */
    public function indexAction()
    {
        return $this->render('@ImaticView/Demo/Toggle/index.html.twig');
    }
}
