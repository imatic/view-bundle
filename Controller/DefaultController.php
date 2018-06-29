<?php
namespace Imatic\Bundle\ViewBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route()
 */
class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     *
     * @return Response
     */
    public function indexAction()
    {
        return $this->render('@ImaticView/Default/index.html.twig');
    }
}
