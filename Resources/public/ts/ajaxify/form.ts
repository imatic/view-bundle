/// <reference path="Container.ts"/>
/// <reference path="Configuration.ts"/>
/// <reference path="Widget.ts"/>
/// <reference path="Action.ts"/>
/// <reference path="Jquery.ts"/>
/// <reference path="Ajax.ts"/>

/**
 * Imatic view ajaxify form module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module Imatic.View.Ajaxify.Form {

    "use_strict";

    import Ajaxify              = Imatic.View.Ajaxify;
    import jQuery               = Imatic.View.Ajaxify.Jquery.jQuery;
    import ContainerInterface   = Imatic.View.Ajaxify.Container.ContainerInterface;
    import Widget               = Imatic.View.Ajaxify.Widget.Widget;
    import WidgetHandler        = Imatic.View.Ajaxify.Widget.WidgetHandler;
    import ActionInterface      = Imatic.View.Ajaxify.Action.ActionInterface;
    import RequestAction        = Imatic.View.Ajaxify.Action.RequestAction;
    import CssClasses           = Imatic.View.Ajaxify.Css.CssClasses;
    import RequestInfo          = Imatic.View.Ajaxify.Ajax.RequestInfo;

    /**
     * Form handler
     */
    export class FormHandler
    {
        public submitMarkAttr = 'data-marked-submit-element';
        public submitElementSelector = 'input[type=submit], button';
        private formFactory = new FormFactory(this);

        constructor(
            private widgetHandler: WidgetHandler
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
        getInstance(element: HTMLElement): Form {
            var form;

            if (this.widgetHandler.hasInstance(element)) {
                form = this.widgetHandler.getInstance(element);
            } else {
                form = this.formFactory.create(element);
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
        constructor(
            private formHandler: FormHandler
        ) {}

        /**
         * Create form
         */
        create(element: HTMLElement): Form {
            var form = new Form(<HTMLFormElement> element);

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

        doCreateActions(): ActionInterface[] {
            var form = <HTMLFormElement> this.element;
            var formData;
            var formTarget = form.getAttribute('target');

            // get used submit button
            var submitButton = this.getUsedSubmitButton(form);

            // see if the form can be ajaxified
            if (
                // ignore forms that target frames/new windows
                (!formTarget || '_self' === formTarget.toLowerCase())
                // ignore forms submitted by a non-ajaxified submit buttons
                && (!submitButton || Ajaxify.documentHandler.isValidElement(submitButton))
                // ignore forms whose data cannot be serialized for XHR
                && false !== (formData = this.getFormData())
            ) {
                // add used submit button's name to the data
                if (submitButton && submitButton.name) {
                    formData = Ajaxify.requestHelper.appendData(
                        formData,
                        submitButton.name,
                        submitButton.value || '1'
                    );
                }

                // determine url
                var url = submitButton && submitButton.hasAttribute('formaction')
                    ? submitButton.getAttribute('formaction')
                    : form.action
                ;

                // determine method
                var method = submitButton && submitButton.hasAttribute('formmethod')
                    ? submitButton.getAttribute('formmethod')
                    : form.method || 'GET'
                ;

                // create action
                var action = new RequestAction(
                    this,
                    new RequestInfo(
                        url,
                        method,
                        formData,
                        this.getOption('contentSelector') || null
                    )
                );

                return [action];
            }

            return [];
        }

        getDefaultConfirmMessage(): string {
            return 'Are you sure you want to submit the entered data?';
        }

        /**
         * Get current form data
         *
         * Returns FALSE if the data cannot be serialized for AJAX.
         */
        getFormData(): any {
            var form = <HTMLFormElement> this.element;

            if ('multipart/form-data' === form.enctype.toLowerCase()) {
                if ('FormData' in Ajaxify.domWindow) {
                    return new FormData(form);
                } else {
                    return false;
                }
            } else {
                return jQuery(form).serializeArray();
            }
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
