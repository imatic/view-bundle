<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Templating\Helper\Html;

use Imatic\Bundle\ViewBundle\Templating\Utils\StringUtil;

class HtmlHelper
{
    public function attributes(array $attributes, array $default = [])
    {
        $attributes = \array_merge($default, $attributes);
        $return = [];
        if (isset($attributes['data']) && \is_array($attributes['data'])) {
            $return[] = $this->dataAttributes($attributes['data']);
            unset($attributes['data']);
        }
        $return[] = (new AttributeCollection($attributes))->render();

        return \implode(' ', $return);
    }

    public function dataAttributes($attributes, array $default = [])
    {
        $attributes = \array_merge($default, $attributes);

        return (new DataAttributeCollection($attributes))->render();
    }

    /**
     * @deprecated use StringUtil::unescape() instead
     *
     * @param string $html
     *
     * @return string
     */
    public function unescape($html)
    {
        return StringUtil::unescape($html);
    }
}
