<?php

namespace Imatic\Bundle\ViewBundle\Twig\Extension;

use Imatic\Bundle\ViewBundle\Templating\Helper\Action\ActionHelper;
use Imatic\Bundle\ViewBundle\Templating\Helper\Grid\GridHelper;
use Imatic\Bundle\ViewBundle\Templating\Helper\Show\ShowHelper;
use Twig_Extension;

class ComponentExtension extends Twig_Extension
{
    /**
     * @var GridHelper
     */
    private $gridHelper;

    /**
     * @var ShowHelper
     */
    private $showHelper;

    /**
     * @var ActionHelper
     */
    private $actionHelper;

    public function __construct(GridHelper $gridHelper, ShowHelper $showHelper, ActionHelper $actionHelper)
    {
        $this->gridHelper = $gridHelper;
        $this->showHelper = $showHelper;
        $this->actionHelper = $actionHelper;
    }

    public function getFunctions()
    {
        return [
            new \Twig_SimpleFunction('imatic_view_table_columns', [$this->gridHelper, 'getColumnsOptions']),
            new \Twig_SimpleFunction('imatic_view_table', [$this->gridHelper, 'getTableOptions']),
            new \Twig_SimpleFunction('imatic_view_show_fields', [$this->showHelper, 'getFieldsOptions']),
            new \Twig_SimpleFunction('imatic_view_show', [$this->showHelper, 'getShowOptions']),
            new \Twig_SimpleFunction('imatic_view_action', [$this->actionHelper, 'getActionOptions']),
            new \Twig_SimpleFunction('imatic_view_action_create', [$this->actionHelper, 'create']),
        ];
    }

    /**
     * Returns the name of the extension.
     *
     * @return string The extension name
     */
    public function getName()
    {
        return 'imatic_view_component';
    }
}
