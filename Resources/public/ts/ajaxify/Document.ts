/// <reference path="Configuration.ts"/>
/// <reference path="Event.ts"/>
/// <reference path="Container.ts"/>
/// <reference path="Widget.ts"/>
/// <reference path="Action.ts"/>
/// <reference path="Link.ts"/>
/// <reference path="Form.ts"/>
/// <reference path="Message.ts"/>
/// <reference path="Modal.ts"/>
/// <reference path="ModalContainer.ts"/>
/// <reference path="VoidContainer.ts"/>
/// <reference path="Dom.ts"/>

/**
 * Imatic view ajaxify document module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module Imatic.View.Ajaxify.Document {

    "use_strict";

    import Ajaxify                      = Imatic.View.Ajaxify;
    import DomEvents                    = Imatic.View.Ajaxify.Dom.DomEvents;
    import ContainerInterface           = Imatic.View.Ajaxify.Container.ContainerInterface;
    import ContainerHandler             = Imatic.View.Ajaxify.Container.ContainerHandler;
    import ContainerNotFoundException   = Imatic.View.Ajaxify.Container.ContainerNotFoundException;
    import WidgetInterface              = Imatic.View.Ajaxify.Widget.WidgetInterface;
    import WidgetHandler                = Imatic.View.Ajaxify.Widget.WidgetHandler;
    import ActionInterface              = Imatic.View.Ajaxify.Action.ActionInterface;
    import ModalContainerHandler        = Imatic.View.Ajaxify.ModalContainer.ModalContainerHandler;
    import VoidContainerHandler         = Imatic.View.Ajaxify.VoidContainer.VoidContainerHandler;
    import LinkHandler                  = Imatic.View.Ajaxify.Link.LinkHandler;
    import FormHandler                  = Imatic.View.Ajaxify.Form.FormHandler;
    import ModalSize                    = Imatic.View.Ajaxify.Modal.ModalSize;
    import Modal                        = Imatic.View.Ajaxify.Modal.Modal;
    import ModalStackHandler            = Imatic.View.Ajaxify.Modal.ModalStackHandler;
    import FlashMessageInterface        = Imatic.View.Ajaxify.Message.FlashMessageInterface;

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
            $(document)
                .on('click', this.onClick)
                .on('submit', this.onSubmit)
                .on(DomEvents.ACTIONS, this.onActions)
                .on(DomEvents.BEFORE_CONTENT_UPDATE, this.onBeforeContentUpdate)
                .on(DomEvents.HANDLE_FLASH_MESSAGES, this.onHandleFlashMessages)
            ;
        }

        /**
         * Validate given element
         */
        isValidElement(element: HTMLElement): boolean {
            return false !== $(element).data('ajaxify');
        }

        /**
         * Handle onclick event
         */
        private onClick = (event: JQueryEventObject): void => {
            var element = <HTMLElement> event.target;
            
            if (
                this.linkHandler.isValidElement(element)
                && this.isValidElement(element)
                && this.linkHandler.isValidEvent(event)
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
            } else if (this.formHandler.isValidSubmitElement(element)) {
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
                        + $('<div/>').text(flashes[i].message).html()
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

}
