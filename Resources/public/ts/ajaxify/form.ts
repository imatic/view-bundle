/// <reference path="container.ts"/>
/// <reference path="configuration.ts"/>
/// <reference path="widget.ts"/>
/// <reference path="action.ts"/>
/// <reference path="jquery.ts"/>

/**
 * Imatic view ajaxify form module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module imatic.view.ajaxify.form {

    "use_strict";

    import ContainerInterface   = imatic.view.ajaxify.container.ContainerInterface;
    import ConfigurationBuilder = imatic.view.ajaxify.configuration.ConfigurationBuilder;
    import Widget               = imatic.view.ajaxify.widget.Widget;
    import WidgetHandler        = imatic.view.ajaxify.widget.WidgetHandler;
    import ActionInterface      = imatic.view.ajaxify.action.ActionInterface;
    import RequestAction        = imatic.view.ajaxify.action.RequestAction;
    import CssClasses           = imatic.view.ajaxify.css.CssClasses;
    import jQuery               = imatic.view.ajaxify.jquery.jQuery;

    /**
     * Form handler
     */
    export class FormHandler
    {
        private formFactory = new FormFactory(this.configBuilder);

        /**
         * Constructor
         */
        constructor(
            private widgetHandler: WidgetHandler,
            private configBuilder: ConfigurationBuilder
        ) {}

        /**
         * Validate given element
         */
        isValidElement(element: HTMLElement): boolean {
            return 'FORM' === element.tagName;
        }

        /**
         * Get form instance for given element
         */
        getInstance(element: HTMLElement, containerElement?: HTMLElement): Form {
            var form;

            if (this.widgetHandler.hasInstance(element)) {
                form = this.widgetHandler.getInstance(element);
            } else {
                form = this.formFactory.create(element, containerElement);
                this.widgetHandler.setInstance(element, form);
            }

            return form;
        }
    }

    /**
     * Form factory
     */
    class FormFactory
    {
        /**
         * Constructor
         */
        constructor(
            private configBuilder: ConfigurationBuilder
        ) {}

        /**
         * Create form
         */
        create(element: HTMLElement, containerElement?: HTMLElement): Form {
            var form = new Form(
                this.configBuilder,
                <HTMLFormElement> element,
                containerElement
            );

            return form;
        }
    }

    /**
     * Form
     */
    export class Form extends Widget
    {
        /**
         * Create action instance
         */
        doCreateAction(config: {[key: string]: any;}): ActionInterface {
            var form = <HTMLFormElement> this.element;
            var formData = jQuery(form).serializeArray();

            // determine used submit button
            var submitButton = jQuery('input[type=submit][name]:focus, button[type=submit]:focus', form);
            if (submitButton.length < 1) {
                submitButton = jQuery('input[type=submit][name], button[type=submit]');
            }

            if (submitButton.length > 0) {
                formData.push({
                    name: submitButton.attr('name'),
                    value: submitButton.attr('value') || '1'
                });
            }

            return new RequestAction(this, {
                url: jQuery(form).attr('action'),
                method: jQuery(form).attr('method') || 'GET',
                data: formData,
                contentSelector: config['contentSelector'] || null,
            });
        }

        /**
         * Get default confirmation message
         */
        getDefaultConfirmMessage(): string {
            return 'Are you sure you want to submit the entered data?';
        }
    }

}
