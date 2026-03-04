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
    const TEMPLATE_TTL = 'remote_ttl';
    const TEMPLATE_BLOCK = 'remote_block';
    const TEMPLATE_ERROR = 'remote_error';

    protected function setUp(): void
    {
        static::createClient();
        self::getContainer()->get(CacheInterface::class)->clear();
    }

    public function testTemplatePlaceholders()
    {
        $file = \sys_get_temp_dir() . '/' . self::TEMPLATE_BLOCK;
        \file_put_contents($file, '<h1>%%title%%</h1>%%content%%'); // template with placeholders

        $this->registerTemplate(self::TEMPLATE_BLOCK, $file);

        // Tests/Fixtures/TestProject/templates/remote_block.html.twig
        $template = $this->getTwig()->render(self::TEMPLATE_BLOCK . '.html.twig');

        $this->assertStringContainsString('<h1>Page title</h1>', $template);
        $this->assertStringContainsString('<p>Page content</p>', $template);
        $this->assertStringNotContainsString('%%', $template);
    }

    public function testTemplateTtl()
    {
        $file = \sys_get_temp_dir() . '/' . self::TEMPLATE_TTL;
        \file_put_contents($file, 'v1');

        $this->registerTemplate(self::TEMPLATE_TTL, $file, 999); // TTL in seconds

        $twig = $this->getTwig();

        $this->assertSame('v1', $twig->render(self::TEMPLATE_TTL));

        \file_put_contents($file, 'v2');

        $this->getClock()->sleep(500); // wait less than TTL

        // still v1 since TTL has not expired yet
        $this->assertSame('v1', $twig->render(self::TEMPLATE_TTL));

        $this->getClock()->sleep(500); // wait longer than TTL

        // v2 after TTL expires
        $this->assertSame('v2', $twig->render(self::TEMPLATE_TTL));
    }

    public function testInitialLoadError()
    {
        $file = \sys_get_temp_dir() . '/' . self::TEMPLATE_ERROR;
        \file_put_contents($file, 'v1');

        $this->registerTemplate(self::TEMPLATE_ERROR, $file);

        // Simulate load error by deleting the file
        \unlink($file);

        $this->expectException(\Twig\Error\LoaderError::class);

        $twig = $this->getTwig();
        $twig->render(self::TEMPLATE_ERROR);
    }

    public function testExpireWithError()
    {
        $file = \sys_get_temp_dir() . '/' . self::TEMPLATE_ERROR;
        \file_put_contents($file, 'v1');

        $this->registerTemplate(self::TEMPLATE_ERROR, $file, 300);

        $twig = $this->getTwig();

        // Initial load to cache the template
        $twig->render(self::TEMPLATE_ERROR);

        \unlink($file);

        $this->getClock()->sleep(400);

        $this->assertSame('v1', $twig->render(self::TEMPLATE_ERROR));
    }

    private function registerTemplate(string $name, string $file, int $ttl = 86400): void
    {
        $loader = $this->getRemoteLoader();
        $loader->addTemplate(
            $name,
            'file://' . $file,
            $ttl,
            [
                'title' => ['placeholder' => '%%title%%'],
                'content' => ['placeholder' => '%%content%%'],
            ],
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
