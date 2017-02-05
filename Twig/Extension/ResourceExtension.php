<?php

namespace Imatic\Bundle\ViewBundle\Twig\Extension;

use Imatic\Bundle\ViewBundle\Templating\Helper\Resource\ResourceHelper;

class ResourceExtension extends \Twig_Extension
{
    /**
     * @var ResourceHelper
     */
    private $resourceHelper;

    public function __construct(ResourceHelper $resourceHelper)
    {
        $this->resourceHelper = $resourceHelper;
    }

    public function getFunctions()
    {
        return [
            new \Twig_SimpleFunction('imatic_view_resource_create_page_actions', [$this->resourceHelper, 'createPageActionConfiguration']),
            new \Twig_SimpleFunction('imatic_view_resource_create_row_actions', [$this->resourceHelper, 'createRowActionConfiguration']),
        ];
    }
}
