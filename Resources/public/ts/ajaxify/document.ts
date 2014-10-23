/// <reference path="configuration.ts"/>
/// <reference path="event.ts"/>
/// <reference path="container.ts"/>
/// <reference path="widget.ts"/>
/// <reference path="action.ts"/>
/// <reference path="link.ts"/>
/// <reference path="form.ts"/>
/// <reference path="message.ts"/>
/// <reference path="modal.ts"/>
/// <reference path="modal_container.ts"/>
/// <reference path="void_container.ts"/>
/// <reference path="jquery.ts"/>

/**
 * Imatic view ajaxify document module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module imatic.view.ajaxify.document {

    "use_strict";

    import jQuery                       = imatic.view.ajaxify.jquery.jQuery;

    import DomEvents                    = imatic.view.ajaxify.event.DomEvents;
    import ContainerInterface           = imatic.view.ajaxify.container.ContainerInterface;
    import ContainerHandler             = imatic.view.ajaxify.container.ContainerHandler;
    import ContainerNotFoundException   = imatic.view.ajaxify.container.ContainerNotFoundException;
    import WidgetInterface              = imatic.view.ajaxify.widget.WidgetInterface;
    import WidgetHandler                = imatic.view.ajaxify.widget.WidgetHandler;
    import ActionInterface              = imatic.view.ajaxify.action.ActionInterface;
    import ModalContainerHandler        = imatic.view.ajaxify.modalContainer.ModalContainerHandler;
    import VoidContainerHandler         = imatic.view.ajaxify.voidContainer.VoidContainerHandler;
    import LinkHandler                  = imatic.view.ajaxify.link.LinkHandler;
    import FormHandler                  = imatic.view.ajaxify.form.FormHandler;
    import ModalSize                    = imatic.view.ajaxify.modal.ModalSize;
    import Modal                        = imatic.view.ajaxify.modal.Modal;
    import ModalStackHandler            = imatic.view.ajaxify.modal.ModalStackHandler;
    import FlashMessageInterface        = imatic.view.ajaxify.message.FlashMessageInterface;

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

        /**
         * Constructor
         */
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
            jQuery(ajaxify.domDocument)
                .on('click', this.onClick)
                .on('submit', this.onSubmit)
                .on(DomEvents.ACTION, this.onAction)
                .on(DomEvents.BEFORE_CONTENT_UPDATE, this.onBeforeContentUpdate)
                .on(DomEvents.HANDLE_FLASH_MESSAGES, this.onHandleFlashMessages)
            ;
        }

        /**
         * Validate given element
         */
        isValidElement(element: HTMLElement): boolean {
            return false !== jQuery(element).data('ajaxify');
        }

        /**
         * Handle onclick event
         */
        private onClick = (event: JQueryEventObject): void => {
            var element = <HTMLElement> event.target;

            try {
                if (
                    this.linkHandler.isValidElement(element)
                    && this.isValidElement(element)
                    && this.linkHandler.isValidEvent(event)
                ) {
                    var context = this.getContainerContext(element);
                    var link = this.linkHandler.getInstance(element, context.containerElement);

                    if (this.dispatchWidget(context.container, link)) {
                        event.preventDefault();
                    }
                } else if (this.formHandler.isValidSubmitElement(element)) {
                    this.formHandler.markSubmitElement(element);
                }
            } catch (e) {
                if (!(e instanceof ContainerNotFoundException)) {
                    throw e;
                }
            }
        }

        /**
         * Handle onsubmit event
         */
        private onSubmit = (event: JQueryEventObject): void => {
            var element = <HTMLElement> event.target;

            try {
                if (
                    this.formHandler.isValidElement(element)
                    && this.isValidElement(element)
                ) {
                    var context = this.getContainerContext(element);
                    var form = this.formHandler.getInstance(element, context.containerElement);

                    if (this.dispatchWidget(context.container, form)) {
                        event.preventDefault();
                    }
                }
            } catch (e) {
                if (!(e instanceof ContainerNotFoundException)) {
                    throw e;
                }
            }
        }

        /**
         * Handle action event
         */
        private onAction = (event: JQueryEventObject): void => {
            var element = <HTMLElement> event.target;

            try {
                var container = this.containerHandler.findInstance(element, false);

                this.dispatchAction(container, <ActionInterface> event['action']);
            } catch (e) {
                if (!(e instanceof ContainerNotFoundException)) {
                    throw e;
                }
            }
        }

        /**
         * Handle beforeContentUpdate event
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
        };

        /**
         * Handle onHandleFlashMessages event
         */
        private onHandleFlashMessages = (event: JQueryEventObject): void => {
            this.showFlashMessages(event['flashes'], <HTMLElement> event.target);
        };

        /**
         * Show flash messages
         */
        showFlashMessages(flashes: FlashMessageInterface[], originElement: HTMLElement): void {
            // trigger event
            var event = jQuery.Event(DomEvents.RENDER_FLASH_MESSAGES, {
                flashes: flashes,
                originElement: originElement,
            });
            jQuery(ajaxify.domDocument.body).trigger(event);

            // default implementation
            if (false !== event.result) {
                var modal = new Modal();

                var body = '';

                for (var i = 0; i < flashes.length; ++i) {
                    body += '<div class="alert alert-' + flashes[i].type + '">'
                        + jQuery('<div/>').text(flashes[i].message).html()
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
         * Get container context for given element
         *
         * This method finds the related container instance and also
         * the contextual container's element.
         */
        private getContainerContext(element: HTMLElement): {
            container: ContainerInterface;
            containerElement: HTMLElement;
        } {
            var container = this.containerHandler.findInstance(element);
            var containerElement;

            try {
                containerElement = (container.isContextual()
                    ? container.getElement()
                    : this.containerHandler.getElementFromContext(element)
                );
            } catch (e) {
                if (!(e instanceof ContainerNotFoundException)) {
                    throw e;
                }
            }

            return {
                container: container,
                containerElement: containerElement,
            };
        }

        /**
         * Perform widget-container interaction
         */
        private dispatchWidget(container: ContainerInterface, widget: WidgetInterface): boolean {
            var action = widget.createAction();

            if (action) {
                return this.dispatchAction(container, action);
            } else {
                return false;
            }
        }

        /**
         * Perform action-container interaction
         */
        private dispatchAction(container: ContainerInterface, action: ActionInterface): boolean {
            container.handleAction(action);
            
            return true;

            /*var success = false;

            try {
                do {
                    if (container.handleAction(action)) {
                        success = true;
                    } else {
                        var containerElement = container.getElement();
                        if (containerElement && containerElement.parentNode) {
                            container = this.containerHandler.findInstance(<HTMLElement> containerElement.parentNode, false);
                        }
                    }
                } while (!success && container);
            } catch (e) {
                if (!(e instanceof ContainerNotFoundException)) {
                    throw e;
                }
            }

            return success;*/
        }
    }

}
