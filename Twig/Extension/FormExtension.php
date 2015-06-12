<?php

namespace Imatic\Bundle\ViewBundle\Twig\Extension;

use Symfony\Bridge\Twig\Form\TwigRendererInterface;
use Symfony\Component\Form\FormView;
use Twig_Extension;
use Twig_Function_Method;

class FormExtension extends Twig_Extension
{
    /** @var TwigRendererInterface */
    private $renderer;
    /** @var int */
    private $prototypeRenderUidSeq = 0;

    public function __construct(TwigRendererInterface $renderer)
    {
        $this->renderer = $renderer;
    }

    public function getFunctions()
    {
        return [
            'imatic_view_form_javascript_prototype' => new Twig_Function_Method(
                $this,
                'renderFormJavascriptPrototype',
                [
                    'needs_context' => true,
                    'is_safe' => ['html']
                ]
            ),
        ];
    }

    /**
     * @param array    $context
     * @param FormView $rootForm
     * @throws \InvalidArgumentException if the given root form has no prototype
     * @return string javascript array
     */
    public function renderFormJavascriptPrototype(array $context, FormView $rootForm)
    {
        if (!isset($rootForm->vars['prototype'])) {
            throw new \InvalidArgumentException('The given root form view has no prototype');
        }

        $stack = [
            // FormView $prototype, string $prototypeName, string[] $parentPrototypeNames
            [$rootForm->vars['prototype'], $rootForm->vars['prototype']->vars['name'], []],
        ];
        
        $output = '[';
        $counter = 0;

        while (list($prototype, $prototypeName, $parentPrototypeNames) = array_pop($stack)) {
            try {
                // the "unique_block_prefix" must be changed to prevent messing
                // up FormRenderer's internal cache and causing errors later on
                $prototype->vars['unique_block_prefix'] .= sprintf('_%d', ++$this->prototypeRenderUidSeq);

                $code = $this->renderer->searchAndRenderBlock($prototype, 'javascript_prototype', $context);
                
                if (++$counter > 1) {
                    $output .= ",\n";
                }

                $output .= sprintf(
                    '{id: %s, prototypeName: %s, parentPrototypeNames: %s, initializer: function ($field) { %s }}',
                    json_encode($prototype->vars['id']),
                    json_encode($prototypeName),
                    json_encode($parentPrototypeNames),
                    $code
                );
            } catch (\LogicException $e) {
                foreach ($prototype->children as $child) {
                    $stack[] = isset($child->vars['prototype'])
                        ? [
                            $child->vars['prototype'],
                            $child->vars['prototype']->vars['name'],
                            array_merge($parentPrototypeNames, [$prototypeName]),
                        ]
                        : [
                            $child,
                            $prototypeName,
                            $parentPrototypeNames,
                        ]
                    ;
                }
            }
        }

        $output .= ']';

        return $output;
    }

    /**
     * Returns the name of the extension.
     *
     * @return string The extension name
     */
    public function getName()
    {
        return 'imatic_view_form';
    }
}
