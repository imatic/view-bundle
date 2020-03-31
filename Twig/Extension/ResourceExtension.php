<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Twig\Extension;

use Imatic\Bundle\ViewBundle\Templating\Helper\Resource\ResourceHelper;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class ResourceExtension extends AbstractExtension
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
            new TwigFunction('imatic_view_resource_create_page_actions', [$this->resourceHelper, 'createPageActionConfiguration']),
            new TwigFunction('imatic_view_resource_create_row_actions', [$this->resourceHelper, 'createRowActionConfiguration']),
            new TwigFunction('imatic_view_resource_create_batch_actions', [$this->resourceHelper, 'createBatchActionConfiguration']),
            new TwigFunction('imatic_view_resource_filter_available_actions', [$this->resourceHelper, 'filterAvailableActions']),
            new TwigFunction('imatic_view_resource_create_headline', [$this->resourceHelper, 'createHeadline']),
            new TwigFunction('imatic_view_resource_create_action', [$this->resourceHelper, 'createActionConfiguration']),
        ];
    }
}
