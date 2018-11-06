<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Templating\Helper\Grid;

class GridHelper
{
    public function getColumnsOptions(array $columns = [])
    {
        if (0 === \count($columns)) {
            throw new \InvalidArgumentException('Table must contain some columns');
        }

        $return = [];
        foreach ($columns as $column) {
            $return[] = new ColumnOptions($column);
        }

        return $return;
    }

    public function getTableOptions(array $table = [])
    {
        return new TableOptions($table);
    }
}
