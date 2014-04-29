<?php

namespace Imatic\Bundle\ViewBundle\Composer;

use Symfony\Component\Process\PhpExecutableFinder;
use Symfony\Component\Process\Process;
use AppKernel;

class ScriptHandler
{
    /**
     * @param \Composer\Script\CommandEvent $event
     */
    public static function bowerMerge($event)
    {
        $event->getIO()->write('bower merge...');

        if (is_file('./bower.json')) {
            self::doBowerMerge($event->getIO());
        } else {
            $event->getIO()->write('<error>bower.json was not found</error>');
        }
    }

    /**
     * @param \Composer\IO\IOInterface $io
     */
    private static function doBowerMerge($io)
    {
        // boot kernel
        require_once './app/AppKernel.php';
        $kernel = new AppKernel('dev', true);
        $kernel->boot();

        // parse project bower.json
        $appBower = self::parseBowerFile('bower.json');
        $bundleComponents = [];

        // merge and resolve dependencies from bundles
        $appBower['dependencies'] = self::resolveBowerDependencies(
            $io,
            $kernel->getBundles(),
            $appBower['dependencies'],
            $bundleComponents
        );

        // print info about project components
        $io->write("<comment>App components (not found in bundles)</comment>");
        $projectLevelComponents = array_diff(array_keys($appBower['dependencies']), $bundleComponents);
        if (!empty($projectLevelComponents)) {
            foreach ($projectLevelComponents as $component) {
                $io->write("\t{$component} [{$appBower['dependencies'][$component]}]");
            }
        } else {
            $io->write("\tNone");
        }

        // dump merged bower file
        $io->write('Dumping bower.json');
        self::dumpBowerFile('./bower.json', $appBower);
        
    }

    /**
     * @param \Composer\IO\IOInterface $io
     * @param array                    $bundles
     * @param array                    $dependencies
     * @param array|null               &$foundComponents
     * @return array
     */
    private static function resolveBowerDependencies($io, array $bundles, array $dependencies = [], array &$foundComponents = null)
    {
        foreach ($bundles as $bundle) {
            $bowerFile = sprintf('%s/bower.json', $bundle->getPath());
            if (is_file($bowerFile)) {
                $io->write("<comment>{$bundle->getName()}:</comment>");

                // parse and compute diff
                $bundleBower = self::parseBowerFile($bowerFile);
                foreach (array_keys($bundleBower['dependencies']) as $component) {
                    $foundComponents[] = $component;
                }
                $diff = array_diff_assoc($bundleBower['dependencies'], $dependencies);

                // print diff info
                if (!empty($diff)) {
                    foreach ($diff as $component => $version) {
                        $operation = isset($dependencies[$component]) ? '<comment>CHANGED</comment>': '<info>ADDED</info>';

                        $io->write("\t{$operation} {$component} [{$dependencies[$component]} => {$version}]");
                    }
                } else {
                    $io->write("\tNo changes");
                }

                // merge
                $dependencies = $diff + $dependencies;
            }
        }

        return $dependencies;
    }

    /**
     * @param string $filePath
     * @return mixed
     */
    private static function parseBowerFile($filePath)
    {
        $data = json_decode(file_get_contents($filePath), true);

        if (JSON_ERROR_NONE !== json_last_error()) {
            throw new \RuntimeException(sprintf('Error while parsing JSON file "%s"', $filePath));
        }

        if (!isset($data['name'], $data['dependencies'])|| !is_array($data['dependencies'])) {
            throw new \RuntimeException(sprintf('Invalid structure of JSON file "%s"', $filePath));
        }

        return $data;
    }

    /**
     * @param string $filePath
     * @param mixed  $data
     */
    private static function dumpBowerFile($filePath, $data)
    {
        $jsonString = json_encode($data, JSON_PRETTY_PRINT);

        if (false === $jsonString) {
            throw new \RuntimeException(sprintf('Error while dumping JSON file "%s"', $filePath));
        }

        file_put_contents($filePath, $jsonString);
    }

    /**
     * @param \Composer\Script\CommandEvent $event
     */
    public static function bowerInstall($event)
    {
        $event->getIO()->write('bower install...');
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
        $event->getIO()->write('npm install...');
        $process = new Process('npm install');
        $process->setTimeout(240);
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

        $arguments = [];
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
        $options = array_merge([
            'assetic-dump-asset-root' => null,
            'assetic-dump-force' => false,
        ], $event->getComposer()->getPackage()->getExtra());

        return $options;
    }
}
