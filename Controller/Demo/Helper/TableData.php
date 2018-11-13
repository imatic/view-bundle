<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Controller\Demo\Helper;

class TableData implements \IteratorAggregate
{
    private $data;

    private $total;

    private $limit;

    private $offset;

    public function __construct($total = 100)
    {
        $this->total = $total;
        $this->data = [];

        $this->limit = 20;
        $this->offset = 0;

        $this->generate();
    }

    public function generate()
    {
        for ($i = 1; $i <= $this->total; ++$i) {
            $this->data[$i] = new User([
                'id' => $i,
                'name' => 'User ' . $i,
                'age' => \rand(15, 80),
                'active' => $i % 2 === 0,
                'lastOnline' => new \DateTime(),
                'phone' => 123456789,
                'email' => 'user-' . $i . '@example.com',
                'url' => 'http://www.example.com',
            ]);
        }
    }

    public function slice($limit, $offset = null)
    {
        $this->limit = $limit;
        if ($offset) {
            $this->offset = $offset;
        }
    }

    public function getData()
    {
        return \array_slice($this->data, $this->offset, $this->limit);
    }

    public function getIterator()
    {
        return new \ArrayIterator($this->getData());
    }

    public function get($key)
    {
        return $this->data[$key];
    }
}
