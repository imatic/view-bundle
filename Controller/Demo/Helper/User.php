<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Controller\Demo\Helper;

class User
{
    public function __construct(array $data)
    {
        foreach ($data as $k => $v) {
            $this->$k = $v;
        }
    }

    public function __toString()
    {
        return (string) $this->name;
    }
}
