<?php
namespace Imatic\Bundle\ViewBundle\Controller\Demo;

use Imatic\Bundle\ViewBundle\Controller\Demo\Helper\TableData;
use Imatic\Bundle\ViewBundle\Controller\Demo\Helper\TestingType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as Config;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;

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
     * @Config\Route("/panel")
     * @Config\Template()
     */
    public function panelAction()
    {
        return [];
    }

    /**
     * @Config\Route("/layout")
     * @Config\Template()
     */
    public function layoutAction()
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
     * @Config\Route("/tabs")
     * @Config\Template()
     */
    public function tabsAction()
    {
        return [];
    }

    /**
     * @Config\Route("/form")
     * @Config\Template()
     */
    public function formAction()
    {
        $form = $this->createForm(TestingType::class);

        return ['form' => $form->createView()];
    }

    /**
     * @Config\Route("/form/ajax-choice")
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
     * @Config\Route("/show")
     * @Config\Template()
     */
    public function showAction()
    {
        $data = new TableData(1);
        $item = $data->get(1);

        return ['item' => $item];
    }

    /**
     * @Config\Route("/menu")
     * @Config\Template()
     */
    public function menuAction()
    {
        return [];
    }

    /**
     * @Config\Route("/formatter/{_locale}", defaults={"_locale": ""})
     * @Config\Template()
     */
    public function formatterAction()
    {
        return [];
    }
}
