<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Tests\Integration\Twig\Loader;

use Imatic\Bundle\ViewBundle\Tests\Fixtures\TestProject\WebTestCase;
use Imatic\Bundle\ViewBundle\Twig\Loader\RemoteLoader;
use Symfony\Component\Clock\ClockInterface;
use Symfony\Component\Clock\MockClock;
use Symfony\Contracts\Cache\CacheInterface;
use Twig\Environment;

class RemoteLoaderTest extends WebTestCase
{
    protected function setUp(): void
    {
        static::createClient();
        self::getContainer()->get(CacheInterface::class)->clear();
    }

    public function testTemplateTtl()
    {
        $remoteFile = \sys_get_temp_dir() . '/remote_layout.html';
        \file_put_contents($remoteFile, 'v1');

        $this->registerTemplate($remoteFile, 999); // TTL in seconds

        $twig = $this->getTwig();

        $this->assertSame('v1', $twig->render('remote_layout'));

        \file_put_contents($remoteFile, 'v2');

        $this->getClock()->sleep(500); // wait less than TTL

        // still v1 since TTL has not expired yet
        $this->assertSame('v1', $twig->render('remote_layout'));

        $this->getClock()->sleep(500); // wait longer than TTL

        // v2 after TTL expires
        $this->assertSame('v2', $twig->render('remote_layout'));
    }

    private function registerTemplate(string $file, int $ttl)
    {
        $loader = $this->getRemoteLoader();
        $loader->addTemplate(
            'remote_layout',
            'file://' . $file,
            $ttl,
            ['content' => ['placeholder' => '{{ content }}']],
            []
        );
    }

    private function getClock(): ClockInterface
    {
        $clock = self::getContainer()->get(ClockInterface::class);
        \assert($clock instanceof MockClock);
        return $clock;
    }

    private function getTwig(): Environment
    {
        return self::getContainer()->get('twig');
    }

    private function getRemoteLoader(): RemoteLoader
    {
        return self::getContainer()->get('Imatic\Bundle\ViewBundle\Twig\Loader\RemoteLoader');
    }
}
