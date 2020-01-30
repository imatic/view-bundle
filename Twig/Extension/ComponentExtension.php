<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Twig\Extension;

use Imatic\Bundle\ViewBundle\Templating\Helper\Action\ActionHelper;
use Imatic\Bundle\ViewBundle\Templating\Helper\Grid\GridHelper;
use Imatic\Bundle\ViewBundle\Templating\Helper\Show\ShowHelper;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class ComponentExtension extends AbstractExtension
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
            new TwigFunction('imatic_view_table_columns', [$this->gridHelper, 'getColumnsOptions']),
            new TwigFunction('imatic_view_table', [$this->gridHelper, 'getTableOptions']),
            new TwigFunction('imatic_view_show_fields', [$this->showHelper, 'getFieldsOptions']),
            new TwigFunction('imatic_view_show', [$this->showHelper, 'getShowOptions']),
            new TwigFunction('imatic_view_action', [$this->actionHelper, 'getActionOptions']),
            new TwigFunction('imatic_view_action_create', [$this->actionHelper, 'create']),
        ];
    }
}
