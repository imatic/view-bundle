<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Controller\Demo;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DemoController extends AbstractController
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
