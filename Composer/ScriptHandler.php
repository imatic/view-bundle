<?php

namespace Imatic\Bundle\ViewBundle\Composer;

use Symfony\Component\Process\Process;

class ScriptHandler
{
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
}
