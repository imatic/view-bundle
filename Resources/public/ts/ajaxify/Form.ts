import * as Ajaxify from './Ajaxify';
import {ContainerInterface} from './Container';
import {CssClasses} from './Css';
import {RequestInfo} from './Ajax';
import {Widget, WidgetHandler} from './Widget';
import {ActionInterface, RequestAction} from './Action';
import {Url} from './Url';

/**
 * Form handler
 */
export class FormHandler
{
    public submitMarkAttr = 'data-marked-submit-element';
    public submitElementSelector = 'input[type=submit], button:not([type=reset], [type=button])';
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
        return $(element).is(this.submitElementSelector);
    }

    /**
     * Find valid submit element for the given node
     */
    findValidSubmitElement(element: HTMLElement): HTMLElement {
        var valid;

        while(!(valid = this.isValidSubmitElement(element))) {
            if (element.parentNode && 1 === element.parentNode.nodeType) {
                element = <HTMLElement> element.parentNode;
            } else {
                break;
            }
        }

        return valid ? element : null;
    }

    /**
     * Mark submit element
     */
    markSubmitElement(element: HTMLElement): void {
        var form = element['form'];
        if (form) {
            var submitElements = $(this.submitElementSelector, form);
            for (var i = 0; i < submitElements.length; ++i) {
                $(submitElements[i]).removeAttr(this.submitMarkAttr);
            }

            $(element).attr(this.submitMarkAttr, 'true');
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
        var actions = [];

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
                : form.getAttribute('action') || ''
            ;

            // determine method
            var method = submitButton && submitButton.hasAttribute('formmethod')
                ? submitButton.getAttribute('formmethod')
                : form.getAttribute('method') || 'GET'
            ;

            // create action
            // make sure the url is HTTP and local
            var parsedUrl = new Url(url);

            if (parsedUrl.isLocal() && parsedUrl.isHttp()) {
                actions.push(new RequestAction(
                    this,
                    new RequestInfo(
                        url,
                        method,
                        formData,
                        this.getOption('contentSelector') || null
                    )
                ));
            }
        }

        return actions;
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
            if ('FormData' in window) {
                return new (<any> FormData)(form); // https://github.com/Microsoft/TypeScript/issues/1074
            } else {
                return false;
            }
        } else {
            return $(form).serializeArray();
        }
    }

    /**
     * Determine used submit button
     */
    getUsedSubmitButton(form: HTMLFormElement): HTMLButtonElement {
        var submitButton = $('[' + this.submitMarkAttr + ']', form);
        if (submitButton.length < 1) {
            submitButton = $('input[type=submit], button[type=submit]');
        }

        if (submitButton.length > 0) {
            return <HTMLButtonElement> submitButton.get(0);
        }
    }
}
