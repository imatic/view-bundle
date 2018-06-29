<?php
namespace Imatic\Bundle\ViewBundle\Controller\Demo;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DemoController extends Controller
{
    /**
     * @Route("/")
     *
     * @return Response
     */
    public function indexAction()
    {
        return $this->render('@ImaticView/Demo/Demo/index.html.twig');
    }
}
