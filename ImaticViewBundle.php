<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle;

use Imatic\Bundle\ViewBundle\DependencyInjection\Compiler\AddExpressionLanguageProvidersPass;
use Imatic\Bundle\ViewBundle\DependencyInjection\Compiler\FormatterPass;
use Imatic\Bundle\ViewBundle\DependencyInjection\Compiler\MenuPass;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\HttpKernel\Bundle\Bundle;

class ImaticViewBundle extends Bundle
{
    public function getParent()
    {
        return 'TwigBundle';
    }

    public function build(ContainerBuilder $container)
    {
        parent::build($container);

        $container->addCompilerPass(new MenuPass());
        $container->addCompilerPass(new FormatterPass());
        $container->addCompilerPass(new AddExpressionLanguageProvidersPass());
    }
}
