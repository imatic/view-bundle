<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Tests\Integration\Twig\Loader;

use Imatic\Bundle\ViewBundle\Tests\Fixtures\TestProject\WebTestCase;
use Imatic\Bundle\ViewBundle\Twig\Loader\RemoteLoader;
use Twig\Environment;

class RemoteLoaderTest extends WebTestCase
{
    protected function setUp(): void
    {
        static::createClient();
    }

    public function testRemoteLoaderTtl()
    {
        $remoteFile = \sys_get_temp_dir() . '/remote_layout.html';

        \file_put_contents($remoteFile, 'v1');

        $this->registerTemplate($remoteFile, 1); // TTL = 1 second

        $twig = $this->getTwig();

        $this->assertSame('v1', $twig->render('remote_layout'));

        \file_put_contents($remoteFile, 'v2');

        \sleep(2); // move to next time bucket

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

    private function getTwig(): Environment
    {
        return self::getContainer()->get('twig');
    }

    private function getRemoteLoader(): RemoteLoader
    {
        return self::getContainer()->get('Imatic\Bundle\ViewBundle\Twig\Loader\RemoteLoader');
    }
}
