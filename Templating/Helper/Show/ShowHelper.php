<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Templating\Helper\Show;

class ShowHelper
{
    public function getFieldsOptions(array $fields = [])
    {
        if (0 === \count($fields)) {
            throw new \InvalidArgumentException('Show must contain some fields');
        }

        $return = [];
        foreach ($fields as $field) {
            $return[] = new FieldOptions($field);
        }

        return $return;
    }

    public function getShowOptions(array $table = [])
    {
        return new ShowOptions($table);
    }
}
