<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Tests\Fixtures\TestProject;

use Imatic\Testing\Test\WebTestCase as BaseWebTestCase;

class WebTestCase extends BaseWebTestCase
{
    /**
     * @return string
     */
    protected static function getKernelClass()
    {
        return 'Imatic\Bundle\ViewBundle\Tests\Fixtures\TestProject\TestKernel';
    }
}
