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
        public submitMarkAttr = 'data-marked-submit-element';
        public submitElementSelector = 'input[type=submit], button';
        private formFactory = new FormFactory(this, this.configBuilder);

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
         * Validate given submit element
         */
        isValidSubmitElement(element: HTMLElement): boolean {
            return jQuery(element).is(this.submitElementSelector);
        }

        /**
         * Mark submit element
         */
        markSubmitElement(element: HTMLElement): void {
            var form = element['form'];
            if (form) {
                var submitElements = jQuery(this.submitElementSelector, form);
                for (var i = 0; i < submitElements.length; ++i) {
                    jQuery(submitElements[i]).removeAttr(this.submitMarkAttr);
                }

                jQuery(element).attr(this.submitMarkAttr, 'true');
            }
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
            private formHandler: FormHandler,
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

            form.submitMarkAttr = this.formHandler.submitMarkAttr;

            return form;
        }
    }

    /**
     * Form
     */
    export class Form extends Widget
    {
        submitMarkAttr: string;

        /**
         * Create action instance
         */
        doCreateAction(config: {[key: string]: any;}): ActionInterface {
            var form = <HTMLFormElement> this.element;
            var formData = jQuery(form).serializeArray();

            // add used submit button's name to the data
            var submitButton = this.getUsedSubmitButton(form);
            if (submitButton && submitButton.name) {
                formData.push({
                    name: submitButton.name,
                    value: submitButton.value || '1'
                });
            }

            // determine url
            var url;
            if (submitButton && submitButton.formAction) {
                url = submitButton.formAction;
            } else {
                url = form.action;
            }

            // determine method
            var method = 'GET';
            if (submitButton && submitButton.formMethod) {
                method = submitButton.formMethod;
            } else if (form.method) {
                method = form.method;
            }

            return new RequestAction(this, {
                url: url,
                method: method,
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

        /**
         * Determine used submit button
         */
        getUsedSubmitButton(form: HTMLFormElement): HTMLButtonElement {
            var submitButton = jQuery('[' + this.submitMarkAttr + ']', form);
            if (submitButton.length < 1) {
                submitButton = jQuery('input[type=submit], button[type=submit]');
            }

            if (submitButton.length > 0) {
                return <HTMLButtonElement> submitButton.get(0);
            }
        }
    }

}
