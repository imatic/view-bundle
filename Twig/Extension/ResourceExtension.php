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
            new \Twig_Function('imatic_view_resource_create_page_actions', [$this->resourceHelper, 'createPageActionConfiguration']),
            new \Twig_Function('imatic_view_resource_create_row_actions', [$this->resourceHelper, 'createRowActionConfiguration']),
            new \Twig_Function('imatic_view_resource_create_batch_actions', [$this->resourceHelper, 'createBatchActionConfiguration']),
            new \Twig_Function('imatic_view_resource_filter_available_actions', [$this->resourceHelper, 'filterAvailableActions']),
            new \Twig_Function('imatic_view_resource_create_headline', [$this->resourceHelper, 'createHeadline']),
            new \Twig_Function('imatic_view_resource_create_action', [$this->resourceHelper, 'createActionConfiguration']),
        ];
    }
}