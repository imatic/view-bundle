<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Controller\Demo;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/toggle")
 */
class ToggleController extends AbstractController
{
    /**
     * @Route("/")
     */
    public function indexAction()
    {
        return $this->render('@ImaticView/Demo/Toggle/index.html.twig');
    }
}
