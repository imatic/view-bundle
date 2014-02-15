<?php

namespace Imatic\Bundle\ViewBundle\Twig\Extension;

use Imatic\Bundle\ViewBundle\Templating\Helper\Grid\GridHelper;
use Twig_Extension;

class ComponentExtension extends Twig_Extension
{
    /**
     * @var GridHelper
     */
    private $gridHelper;

    public function __construct(GridHelper $gridHelper)
    {
        $this->gridHelper = $gridHelper;
    }

    public function getFunctions()
    {
        return [
            new \Twig_SimpleFunction('imatic_view_table_columns', [$this->gridHelper, 'getColumnsOptions']),
            new \Twig_SimpleFunction('imatic_view_table', [$this->gridHelper, 'getTableOptions']),
            new \Twig_SimpleFunction('imatic_view_action', [$this, 'action']),
        ];
    }

    public function action($value)
    {
        return $value;
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
