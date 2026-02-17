<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Tests\Fixtures\TestProject;

use Imatic\Testing\Test\TestKernel as BaseTestKernel;
use Symfony\Component\Clock\ClockInterface;
use Symfony\Component\Clock\MockClock;
use Symfony\Component\DependencyInjection\ContainerBuilder;

class TestKernel extends BaseTestKernel
{
    public function registerBundles(): iterable
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

    public function getProjectDir(): string
    {
        return __DIR__;
    }

    protected function build(ContainerBuilder $container)
    {
        parent::build($container);

        $container->register(ClockInterface::class, MockClock::class)
            ->setPublic(true)
        ;
    }
}
