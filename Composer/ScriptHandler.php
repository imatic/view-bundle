<?php

namespace Imatic\Bundle\ViewBundle\Composer;

use Symfony\Component\Process\PhpExecutableFinder;
use Symfony\Component\Process\Process;

class ScriptHandler
{
    /**
     * @param string $path
     * @return boolean
     */
    public static function detectNodeBin($path)
    {
        \ob_start();
        \system(\escapeshellcmd($path) . ' -v');
        $output = \ob_get_clean();

        if (\preg_match('/^v\d/', $output) && \realpath($path)) {
            return $path;
        }
        return false;
    }

    /**
     * @param string $path
     * @return boolean
     */
    public static function detectNodeModuleDir($path)
    {
        if (\is_dir($path) && \preg_match('/node_modules$/', $path)) {
            return $path;
        }
        return false;
    }

    /**
     * @param \Composer\IO\IOInterface $io
     * @param string $question
     * @param string $error
     * @param string $validatorMethod
     * @return bool
     */
    public static function askFor($io, $question, $error, $validatorMethod)
    {
        if ($return = $io->askAndValidate(
            '<question>' . $question . ':</question>',
            array(__CLASS__, $validatorMethod)
        )
        ) {
            return $return;
        } else {
            $io->write('<error>' . $error . '</error>');
            static::askFor($io, $question, $error, $validatorMethod);
        }
    }

    /**
     * @param \Composer\Script\CommandEvent $event
     * @param array $options
     */
    public static function updateNodeConfig($event, $options)
    {
        $io = $event->getIO();

        $configFile = $options['symfony-app-dir'] . '/config/parameters.yml';
        $configContent = file_get_contents($configFile);
        $configContentOrig = $configContent;

        if (strpos($configContent, '$node.bin$')) {
            $io->write('');
            $io->write('<error>Configuration node.bin is not set in ' . $configFile . '</error>');
            $value = static::askFor(
                $io,
                'Please provide full path to the node binary',
                'Filled path is not valid node.js binary',
                'detectNodeBin');
            $configContent = str_replace('$node.bin$', $value, $configContent);
        }

        if (strpos($configContent, '$node.modules.path$')) {
            $io->write('');
            $io->write('<error>Configuration node.modules.path is not set in ' . $configFile . '</error>');
            $value = static::askFor(
                $io,
                'Please provide full path to the global node modules directory',
                'Filled path is not valid node modules directory',
                'detectNodeModuleDir');
            $configContent = str_replace('$node.modules.path$', $value, $configContent);
        }

        if ($configContent != $configContentOrig) {
            file_put_contents($configFile, $configContent);
            $io->write('');
            $io->write('<info>' . $configFile . '</info> updated!');
        }
    }

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

    /*
     * Inspired by from https://gist.github.com/2725096
     * More info: https://github.com/symfony/AsseticBundle/issues/82
     */

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