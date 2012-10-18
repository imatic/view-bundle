<?php

/*
 * Inspired by from https://gist.github.com/2725096
 * More info: https://github.com/symfony/AsseticBundle/issues/82 (but it's still not in assetic or distribution bundle)
 */

namespace Imatic\Bundle\ViewBundle\Composer;

use Symfony\Component\Process\PhpExecutableFinder;
use Symfony\Component\Process\Process;

class ScriptHandler
{
    public static function bowerUpdate($event)
    {
        $options = self::getOptions($event);
        $webDir = $options['symfony-web-dir'];

        $process = new Process('bower update');
        $process->setWorkingDirectory($webDir);
        $process->run(function ($type, $buffer) use ($event) {
            $event->getIO()->write($buffer, false);
        });
    }

    public static function dumpAssets($event)
    {
        $options = self::getOptions($event);
        $appDir = $options['symfony-app-dir'];

        $arguments = array();

        if ($options['assetic-dump-force'])
            $arguments[] = '--force';

        if ($options['assetic-dump-asset-root'] !== null)
            $arguments = escapeshellarg($options['assetic-dump-asset-root']);

        static::executeCommand($event, $appDir, 'assetic:dump' . implode(' ', $arguments));
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