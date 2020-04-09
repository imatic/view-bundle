<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route()
 */
class DefaultController extends AbstractController
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
