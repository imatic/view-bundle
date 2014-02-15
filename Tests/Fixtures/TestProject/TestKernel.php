<?php
namespace Imatic\Bundle\ViewBundle\Tests\Fixtures\TestProject;

use Imatic\Bundle\TestingBundle\Test\TestKernel as BaseTestKernel;

class TestKernel extends BaseTestKernel
{
    /**
     * {@inheritdoc}
     */
    public function registerBundles()
    {
        $parentBundles = parent::registerBundles();

        $bundles = [
            new \Symfony\Bundle\WebProfilerBundle\WebProfilerBundle(),
            new \Knp\Bundle\MenuBundle\KnpMenuBundle(),
            new \Sensio\Bundle\FrameworkExtraBundle\SensioFrameworkExtraBundle(),
            new \Symfony\Bundle\AsseticBundle\AsseticBundle(),
            new \Mopa\Bundle\BootstrapBundle\MopaBootstrapBundle(),

            new \Imatic\Bundle\ViewBundle\ImaticViewBundle(),
            new \Imatic\Bundle\ViewBundle\Tests\Fixtures\TestProject\ImaticViewBundle\AppImaticViewBundle(),
        ];

        return array_merge($parentBundles, $bundles);
    }
}
