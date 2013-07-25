<?php

namespace Imatic\Bundle\ViewBundle\Composer;

use Symfony\Component\Process\PhpExecutableFinder;
use Symfony\Component\Process\Process;

class ScriptHandler
{
    /**
     * @param \Composer\Script\CommandEvent $event
     */
    public static function updateConfig($event)
    {
        $options = self::getOptions($event);
        static::updateNodeConfig($event, $options);
    }

    /**
     * @param \Composer\Script\CommandEvent $event
     */
    public static function bowerInstall($event)
    {
        $event->getIO()->write('bower install...' . PHP_EOL, false);
        $bin = sprintf('node_modules%s.bin%sbower', DIRECTORY_SEPARATOR, DIRECTORY_SEPARATOR);
        $process = new Process($bin . ' install');
        $process->setTimeout(240);
        $process->run(function ($type, $buffer) use ($event) {
            $event->getIO()->write($buffer, false);
        });
    }

    /**
     * @param \Composer\Script\CommandEvent $event
     */
    public static function npmInstall($event)
    {
        $event->getIO()->write('npm install...' . PHP_EOL, false);
        $process = new Process('npm install');
        $process->run(function ($type, $buffer) use ($event) {
            $event->getIO()->write($buffer, false);
        });
    }

    /*
     * Inspired by from https://gist.github.com/2725096
     * More info: https://github.com/symfony/AsseticBundle/issues/82
     */

    public static function dumpAssets($event)
    {
        $options = self::getOptions($event);
        $appDir = $options['symfony-app-dir'];

        $arguments = array();
        $arguments[] = '-e=prod';

        if ($options['assetic-dump-force'])
            $arguments[] = '--force';

        if ($options['assetic-dump-asset-root'] !== null)
            $arguments = escapeshellarg($options['assetic-dump-asset-root']);

        static::executeCommand($event, $appDir, 'assetic:dump ' . implode(' ', $arguments));
    }

    protected static function executeCommand($event, $appDir, $cmd)
    {
        $phpFinder = new PhpExecutableFinder;
        $php = escapeshellarg($phpFinder->find());
        $console = escapeshellarg($appDir . '/console');
        if ($event->getIO()->isDecorated()) {
            $console .= ' --ansi';
        }

        $process = new Process($php . ' ' . $console . ' ' . $cmd);
        $process->run(function ($type, $buffer) use ($event) {
            $event->getIO()->write($buffer, false);
        });
    }

    protected static function getOptions($event)
    {
        $options = array_merge(array(
            'assetic-dump-asset-root' => null,
            'assetic-dump-force' => false,
        ), $event->getComposer()->getPackage()->getExtra());

        return $options;
    }
}
