import {DomEvents} from './Dom';
import {ActionInterface} from './Action';
import {ModalContainerHandler} from './ModalContainer';
import {VoidContainerHandler} from './VoidContainer';
import {LinkHandler} from './Link';
import {FormHandler} from './Form';
import {Response} from './Ajax';
import {FlashMessageInterface} from './FlashMessage';
import {ContainerInterface, ContainerHandler, ContainerNotFoundException} from './Container';
import {WidgetInterface, WidgetHandler} from './Widget';
import {Modal, ModalSize, ModalStackHandler} from './Modal';

/**
 * HTML document handler
 *
 * Provides the functionality by listening to certain DOM events.
 */
export class HTMLDocumentHandler
{
    containerHandler: ContainerHandler;
    widgetHandler: WidgetHandler;
    linkHandler: LinkHandler;
    formHandler: FormHandler;

    constructor() {
        // widget handler
        this.widgetHandler = new WidgetHandler();

        // link handler
        this.linkHandler = new LinkHandler(this.widgetHandler);

        // form handler
        this.formHandler = new FormHandler(this.widgetHandler);

        // container handler
        this.containerHandler = new ContainerHandler();

        // modal container handler
        var modalContainerHandler = new ModalContainerHandler(
            this.containerHandler,
            this.widgetHandler
        );
        this.containerHandler.addTargetHandler(modalContainerHandler);

        // void container handler
        var voidContainerHandler = new VoidContainerHandler(this.containerHandler);
        this.containerHandler.addTargetHandler(voidContainerHandler);

        // modal stack handler
        var modalStackHandler = new ModalStackHandler();
    }

    /**
     * Attach the handler
     */
    attach(): void {
        $(this.onDocumentReady);
    }

    /**
     * Validate given element
     */
    isValidElement(element: HTMLElement): boolean {
        return false !== $(element).data('ajaxify');
    }

    /**
     * Initialize on document ready
     */
    private onDocumentReady = (event: JQueryEventObject): void => {
        // event listeners
        $(document)
            .on('click', this.onClick)
            .on('submit', this.onSubmit)
            .on(DomEvents.ACTIONS, this.onActions)
            .on(DomEvents.BEFORE_CONTENT_UPDATE, this.onBeforeContentUpdate)
            .on(DomEvents.AFTER_CONTENT_UPDATE, this.onAfterContentUpdate)
            .on(DomEvents.HANDLE_FLASH_MESSAGES, this.onHandleFlashMessages)
            .on(DomEvents.HANDLE_ERROR, this.onHandleError)
        ;

        // autoload containers in the body
        this.containerHandler.autoload(document.body);
    }

    /**
     * Handle onclick event
     */
    private onClick = (event: JQueryEventObject): void => {
        var handled = false;
        var element: HTMLElement = null;

        // handle link clicks
        if (
            this.linkHandler.isValidEvent(event)
            && (element = this.linkHandler.findValidElement(<HTMLElement> event.target))
            && this.isValidElement(element)
        ) {
            var link = this.linkHandler.getInstance(element);

            var container = null;
            try {
                container = this.containerHandler.findInstanceForElement(element);
            } catch (e) {
                if (!(e instanceof ContainerNotFoundException)) {
                    throw e;
                }
            }

            if (this.dispatchActions(link.createActions(), container)) {
                event.preventDefault();
            }

            handled = true;
        }

        // mark clicked form submit elements
        if (!handled && (element = this.formHandler.findValidSubmitElement(<HTMLElement> event.target))) {
            this.formHandler.markSubmitElement(element);
        }
    }

    /**
     * Handle onsubmit event
     */
    private onSubmit = (event: JQueryEventObject): void => {
        var element = <HTMLElement> event.target;
        
        if (
            this.formHandler.isValidElement(element)
            && this.isValidElement(element)
        ) {
            var form = this.formHandler.getInstance(element);

            var container = null;
            try {
                container = this.containerHandler.findInstanceForElement(element);
            } catch (e) {
                if (!(e instanceof ContainerNotFoundException)) {
                    throw e;
                }
            }

            if (this.dispatchActions(form.createActions(), container)) {
                event.preventDefault();
            }
        }
    }

    /**
     * Handle action event
     */
    private onActions = (event: JQueryEventObject): void => {
        var element = <HTMLElement> event.target;

        var container = null;
        try {
            container = this.containerHandler.findInstanceForElement(element, false);
        } catch (e) {
            if (!(e instanceof ContainerNotFoundException)) {
                throw e;
            }
        }

        this.dispatchActions(<ActionInterface[]> event['actions'], container);
    }

    /**
     * Handle before content update event
     */
    private onBeforeContentUpdate = (event: JQueryEventObject): void => {
        var element = <HTMLElement> event.target;

        // destroy() all living widget instances in the DOM subtree
        var widgets = this.widgetHandler.findInstances(element);
        for (var i = 0; i < widgets.length; ++i) {
            widgets[i].destroy();
        }

        // destroy() all living container instances in the DOM subtree
        var containers = this.containerHandler.findInstances(element);
        for (var i = 0; i < containers.length; ++i) {
            containers[i].destroy();
        }
    }

    /**
     * Handle after content update event
     */
    private onAfterContentUpdate = (event: JQueryEventObject): void => {
        // autoload containers in the new content
        this.containerHandler.autoload(<HTMLElement> event.target);
    }

    /**
     * Handle flash message event
     */
    private onHandleFlashMessages = (event: JQueryEventObject): void => {
        this.showFlashMessages(event['flashes'], <HTMLElement> event.target);
    }

    /**
     * Handle error event
     */
    private onHandleError = (event: JQueryEventObject): void => {
        var message = event['message'];
        var response = <Response> event['response'];

        if (response && response.exception) {
            // show exception information that is available in debug mode
            var modal = new Modal();

            var body = '<table class="table">'
                    + '<tr><th>Message</th><td class="text-danger">' + this.escape(response.exception.message) + '</td></tr>'
                    + '<tr><th>Class</th><td>' + this.escape(response.exception.className) + '</td></tr>'
                    + '<tr><th>File</th><td>' + this.escape(response.exception.file) + '</td></tr>'
                    + '<tr><th>Line</th><td>' + response.exception.line + '</td></tr>'
                    + '<tr><th>Trace</th><td><pre>' + this.escape(response.exception.trace) + '</pre></td></tr>'
                + '</table>';

            modal.setSize(ModalSize.LARGE);
            modal.setTitle(message);
            modal.setBody(body);
            
            $(modal.getElement()).addClass('debug-exception');

            modal.show();
        } else {
            // show the generic message
            this.showFlashMessages(
                [{type: 'error', message: message}],
                <HTMLElement> event.target
            );
        }
    }

    /**
     * Show flash messages
     */
    showFlashMessages(flashes: FlashMessageInterface[], originElement: HTMLElement): void {
        // trigger event
        var event = $.Event(DomEvents.RENDER_FLASH_MESSAGES, {
            flashes: flashes,
            originElement: originElement,
        });
        $(document.body).trigger(event);

        // default implementation
        if (false !== event.result) {
            var modal = new Modal();

            var body = '';

            for (var i = 0; i < flashes.length; ++i) {
                body += '<div class="alert alert-' + flashes[i].type + '">'
                    + this.escape(flashes[i].message)
                    + '</div>'
                ;
            }

            modal.setBody(body);
            modal.setFooter('<button type="button" class="btn btn-default" data-dismiss="modal">OK</button>');
            modal.setSize(ModalSize.SMALL);

            modal.show();
        }
    }

    /**
     * Escape data for HTML output
     *
     * Quotes are not escaped.
     *
     * For internal use only.
     */
    private escape(data: string): string {
        return $('<div></div>').text(data).html();
    }

    /**
     * Attempt to execute a list of actions
     */
    private dispatchActions(actions: ActionInterface[], contextualContainer: ContainerInterface = null): boolean {
        var success = false;

        for (var i = 0; i < actions.length; ++i) {
            var container = null;

            if (actions[i].hasTarget()) {
                try {
                    container = this.containerHandler.findInstanceForTarget(
                        actions[i].getTarget(),
                        actions[i].hasInitiator() ? actions[i].getInitiator().getElement() : null
                    );
                } catch (e) {
                    if (!(e instanceof ContainerNotFoundException)) {
                        throw e;
                    }
                }
            } else {
                container = contextualContainer;
            }

            if (this.dispatchAction(actions[i], container)) {
                success = true;
                break;
            }
        }

        return success;
    }

    /**
     * Attempt to execute a single action using the given container
     */
    private dispatchAction(action: ActionInterface, container: ContainerInterface = null): boolean {
        var success = false;

        do {
            if (action.supports(container)) {
                // compatible container found
                success = true;
                if (container) {
                    container.handleAction(action);
                } else {
                    action.execute(null);
                }
            } else if (container) {
                // try parent container
                container = container.getParent();
            } else {
                // no more containers
                break;
            }
        } while (!success);

        return success;
    }
}
