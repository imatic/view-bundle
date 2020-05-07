<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Controller\Demo;

use Imatic\Bundle\ViewBundle\Controller\Demo\Helper\TableData;
use Imatic\Bundle\ViewBundle\Controller\Demo\Helper\TestingType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/component")
 */
class ComponentController extends AbstractController
{
    /**
     * @Route("/")
     *
     * @return Response
     */
    public function indexAction()
    {
        return $this->render('@ImaticView/Demo/Component/index.html.twig');
    }

    /**
     * @Route("/panel")
     *
     * @return Response
     */
    public function panelAction()
    {
        return $this->render('@ImaticView/Demo/Component/panel.html.twig');
    }

    /**
     * @Route("/layout")
     *
     * @return Response
     */
    public function layoutAction()
    {
        return $this->render('@ImaticView/Demo/Component/layout.html.twig');
    }

    /**
     * @Route("/grid")
     *
     * @return Response
     */
    public function gridAction()
    {
        $data = new TableData();

        return $this->render('@ImaticView/Demo/Component/grid.html.twig', [
            'items' => $data,
        ]);
    }

    /**
     * @Route("/tabs")
     *
     * @return Response
     */
    public function tabsAction()
    {
        return $this->render('@ImaticView/Demo/Component/tabs.html.twig');
    }

    /**
     * @Route("/form")
     *
     * @return Response
     */
    public function formAction()
    {
        $form = $this->createForm(TestingType::class);

        return $this->render('@ImaticView/Demo/Component/form.html.twig', [
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/form/ajax-choice")
     *
     * @return Response
     */
    public function formAjaxChoiceAction()
    {
        return new JsonResponse([
            ['id' => 123, 'text' => 'Lorem ipsum'],
            ['id' => 456, 'text' => 'Dolor sit amet'],
            ['id' => 789, 'text' => 'Foo bar'],
        ]);
    }

    /**
     * @Route("/show")
     *
     * @return Response
     */
    public function showAction()
    {
        $data = new TableData(1);
        $item = $data->get(1);

        return $this->render('@ImaticView/Demo/Component/show.html.twig', [
            'item' => $item,
        ]);
    }

    /**
     * @Route("/menu")
     *
     * @return Response
     */
    public function menuAction()
    {
        return $this->render('@ImaticView/Demo/Component/menu.html.twig');
    }

    /**
     * @Route("/formatter/{_locale}", defaults={"_locale": ""})
     *
     * @return Response
     */
    public function formatterAction()
    {
        return $this->render('@ImaticView/Demo/Component/formatter.html.twig');
    }
}
