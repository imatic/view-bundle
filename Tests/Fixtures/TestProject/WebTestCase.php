<?php
namespace Imatic\Bundle\ViewBundle\Tests\Fixtures\TestProject;

use Imatic\Bundle\TestingBundle\Test\WebTestCase as BaseWebTestCase;
use Symfony\Component\HttpKernel\KernelInterface;

class WebTestCase extends BaseWebTestCase
{
    protected static function initData(KernelInterface $kernel)
    {
    }

    /**
     * @return string
     */
    protected static function getKernelClass()
    {
        return 'Imatic\Bundle\ViewBundle\Tests\Fixtures\TestProject\TestKernel';
    }
}
