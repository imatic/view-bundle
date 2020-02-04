<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Tests\Fixtures\TestProject;

use Imatic\Testing\Test\TestKernel as BaseTestKernel;

class TestKernel extends BaseTestKernel
{
    public function registerBundles()
    {
        $parentBundles = parent::registerBundles();

        $bundles = [
            new \Symfony\Bundle\WebProfilerBundle\WebProfilerBundle(),
            new \Knp\Bundle\MenuBundle\KnpMenuBundle(),
            new \Imatic\Bundle\FormBundle\ImaticFormBundle(),
            new \Imatic\Bundle\ViewBundle\ImaticViewBundle(),
            new \Imatic\Bundle\ViewBundle\Tests\Fixtures\TestProject\ImaticViewBundle\AppImaticViewBundle(),
        ];

        return \array_merge($parentBundles, $bundles);
    }

    public function getProjectDir()
    {
        return __DIR__;
    }
}
