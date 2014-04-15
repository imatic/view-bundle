<?php

namespace Imatic\Bundle\ViewBundle\DependencyInjection\Compiler;

use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;

/**
 * Form pass
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
class FormPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container)
    {
        $customTemplate = 'ImaticViewBundle:Form:mopa_bootstrap_fields.html.twig';

        // check if mopa bootstrap templating is active
        if (($template = $container->getParameter('mopa_bootstrap.form.templating')) !== false) {
            $resources = $container->getParameter('twig.form.resources');

            // insert custom template after the mopa bootstrap
            // template to override some of its blocks
            if (($key = array_search($template, $resources)) !== false) {
                array_splice($resources, ++$key, 0, $customTemplate);

                $container->setParameter('twig.form.resources', $resources);
            }
        }
    }
}
