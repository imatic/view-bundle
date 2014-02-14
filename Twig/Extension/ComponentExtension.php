<?php

namespace Imatic\Bundle\ViewBundle\Twig\Extension;

use Twig_Extension;

class ComponentExtension extends Twig_Extension
{
    public function getFunctions()
    {
        return [
            new \Twig_SimpleFunction('imatic_view_table_columns', [$this, 'getTableColumns']),
            new \Twig_SimpleFunction('imatic_view_table', [$this, 'getTable']),
            new \Twig_SimpleFunction('imatic_view_action', [$this, 'action']),
        ];
    }

    public function getTableColumns(array $columns = [])
    {
        if (0 === count($columns)) {
            throw new \InvalidArgumentException('Table must contain some columns');
        }

        foreach ($columns as &$column) {
            if (!array_key_exists('name', $column)) {
                throw new \InvalidArgumentException('Column definition must contain name');
            }
            if (!array_key_exists('format', $column)) {
                $column['format'] = 'text';
            }
            $column['formatOptions'] = [];
            $column['class'] = 'text';
        }

        return $columns;
    }

    public function getTable(array $table = [])
    {
        //    - table: table configuration (caption, class, actions, header, sortable, selectable, rowActions)

        if (!array_key_exists('class', $table)) {
            $table['class'] = 'table table-condensed';
        }
        if (!array_key_exists('actions', $table)) {
            $table['actions'] = [];
        }
        if (!array_key_exists('sortable', $table)) {
            $table['sortable'] = false;
        }
        if (!array_key_exists('selectable', $table)) {
            $table['selectable'] = ['enabled' => false, 'column' => null];
        }
        if (!array_key_exists('rowActions', $table)) {
            $table['rowActions'] = [];
        }

        return $table;
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
