/// <reference path="Configuration.ts"/>
/// <reference path="Ajax.ts"/>
/// <reference path="Container.ts"/>
/// <reference path="Action.ts"/>
/// <reference path="Form.ts"/>
/// <reference path="Widget.ts"/>
/// <reference path="Modal.ts"/>
/// <reference path="Jquery.ts"/>
/// <reference path="Dom.ts"/>

/**
 * Imatic view ajaxify modal container module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module Imatic.View.Ajaxify.ModalContainer {

    "use_strict";

    import Ajaxify                          = Imatic.View.Ajaxify;
    import jQuery                           = Imatic.View.Ajaxify.Jquery.jQuery;
    import ConfigurationProcessorInterface  = Imatic.View.Ajaxify.Configuration.ConfigurationProcessorInterface;
    import ConfigurationInterface           = Imatic.View.Ajaxify.Configuration.ConfigurationInterface;
    import DomEvents                        = Imatic.View.Ajaxify.Dom.DomEvents;
    import Response                         = Imatic.View.Ajaxify.Ajax.Response;
    import ContainerInterface               = Imatic.View.Ajaxify.Container.ContainerInterface;
    import Container                        = Imatic.View.Ajaxify.Container.Container;
    import ContainerHandler                 = Imatic.View.Ajaxify.Container.ContainerHandler;
    import ContainerNotFoundException       = Imatic.View.Ajaxify.Container.ContainerNotFoundException;
    import TargetHandlerInterface           = Imatic.View.Ajaxify.Container.TargetHandlerInterface;
    import ActionInterface                  = Imatic.View.Ajaxify.Action.ActionInterface;
    import Action                           = Imatic.View.Ajaxify.Action.Action;
    import ActionEvent                      = Imatic.View.Ajaxify.Action.ActionEvent;
    import RequestAction                    = Imatic.View.Ajaxify.Action.RequestAction;
    import ResponseAction                   = Imatic.View.Ajaxify.Action.ResponseAction;
    import Form                             = Imatic.View.Ajaxify.Form.Form;
    import WidgetHandler                    = Imatic.View.Ajaxify.Widget.WidgetHandler;
    import WidgetInterface                  = Imatic.View.Ajaxify.Widget.WidgetInterface;
    import ModalSize                        = Imatic.View.Ajaxify.Modal.ModalSize;
    import Modal                            = Imatic.View.Ajaxify.Modal.Modal;

    /**
     * Modal configuration defaults
     *
     * If you need to change the defaults at runtime, use:
     * imatic.Ajaxify.configBuilder.addDefaults({someKey: 'someValue'})
     */
    export var ModalConfigurationDefaults = {
        modalSize: ModalSize.NORMAL,
        modalClosable: true,
        modalTitle: '',
        modalFooter: '',
        modalOnClose: '',
        modalCloseOnFormSuccess: true,
        modalForwardFormResponse: true
    };

    /**
     * Modal configuration processor
     */
    export class ModalConfigurationProcessor implements ConfigurationProcessorInterface
    {
        process(data: ConfigurationInterface): void {
            if ('string' === typeof data['modalSize']) {
                data['modalSize'] = ModalSize[data['modalSize'].toUpperCase()];
            }
        }
    }

    /**
     * Modal container handler
     * Creates and manages modal container instances
     */
    export class ModalContainerHandler implements TargetHandlerInterface
    {
        private containerFactory = new ModalContainerFactory(
            this.containerHandler,
            this.widgetHandler
        );

        constructor(
            private containerHandler: ContainerHandler,
            private widgetHandler: WidgetHandler
        ) {}

        supports(target: string, element?: HTMLElement): boolean {
            return 'modal' === target && null != element;
        }

        findContainer(target: string, element?: HTMLElement): ContainerInterface {
            return this.containerFactory.create(element);
        }
    }

    /**
     * Modal container factory
     */
    class ModalContainerFactory
    {
        constructor(
            private containerHandler: ContainerHandler,
            private widgetHandler: WidgetHandler
        ) {}

        /**
         * Create container instance
         */
        create(trigger: HTMLElement): ContainerInterface {
            var container = new ModalContainer(
                this.containerHandler,
                null
            );

            if (this.widgetHandler.hasInstance(trigger)) {
                container.originalTrigger = this.widgetHandler.getInstance(trigger);
            }

            return container;
        }
    }

    /**
     * Modal container
     */
    export class ModalContainer extends Container
    {
        originalTrigger: WidgetInterface;

        private modal = new Modal();
        private actionInitiator: WidgetInterface;
        private responseTitle: string;
        private resendResponse: Response;

        getModal(): Modal {
            return this.modal;
        }

        loadOptions(): ConfigurationInterface {
            return Ajaxify.configBuilder.buildFromDom(this.originalTrigger);
        }

        destroy(): void {
            if (this.modal.hasElement()) {
                this.modal.destroy();
            }

            if (this.originalTrigger) {
                this.executeOnClose(this.originalTrigger, this.originalTrigger.getOption('modalOnClose'));
            }

            super.destroy();
        }

        /**
         * Execute on close action
         */
        private executeOnClose(originalTrigger: WidgetInterface, onClose: any) {
            var actions;

            if (onClose) {
                // load on close
                actions = Ajaxify.actionHelper.parseActionString(onClose, originalTrigger);
            } else if (this.resendResponse) {
                // resend response
                this.resendResponse.flashes = [];
                actions = [new ResponseAction(originalTrigger, this.resendResponse)];
                this.resendResponse = null;
            }

            if (actions) {
                jQuery(originalTrigger.getElement()).trigger(
                    jQuery.Event(DomEvents.ACTIONS, {actions: actions})
                );
            }
        }

        handleAction(action: ActionInterface): void {
            action.listen('begin', (event: ActionEvent): void => {
                var options = this.getOptions();

                if (event.request) {
                    var requestInfo = event.request.getInfo();

                    requestInfo.headers['X-Modal-Dialog'] = '1';
                    if (options['modalCloseOnFormSuccess'] && !options['modalForwardFormResponse']) {
                        requestInfo.headers['X-Prefer-No-Redirects'] = '1';
                    }
                }

                this.actionInitiator = event.action.getInitiator();
            });

            action.listen('apply', (event: ActionEvent): void => {
                if (event.response && event.response.valid) {
                    this.responseTitle = event.response.title || null;
                    this.resendResponse = null;

                    // handle successful form submit
                    if (
                        event.response.successful
                        && this.actionInitiator instanceof Form
                        && jQuery(this.modal.getElement()).has(this.actionInitiator.getElement()).length > 0
                    ) {
                        // close on form success
                        if (this.getOption('modalCloseOnFormSuccess')) {
                            // store response for resend
                            if (this.getOption('modalForwardFormResponse')) {
                                this.resendResponse = event.response;
                            }

                            // stop the action and close
                            event.proceed = false;
                            this.modal.hide();
                        }
                    }
                }
            });

            super.handleAction(action);
        }

        getElement(): HTMLElement {
            if (this.modal.hasElement()) {
                return this.modal.getElement();
            }
        }

        setContent(content: JQuery): void {
            if (!this.actionInitiator) {
                throw new Error('Cannot set content when action initiator is not yet known');
            }
            var options = (this.originalTrigger ? this.originalTrigger: this.actionInitiator).getOptions();

            var title = '';
            var footer = null;

            // configure modal
            this.modal.setSize(options['modalSize']);
            this.modal.setClosable(options['modalClosable']);

            // find title
            var titleElement;
            if (options['modalTitle'] && 'none' !== options['modalTitle']) {
                titleElement = jQuery(options['modalTitle'], content).get(0);
                if (titleElement) {
                    title = jQuery(titleElement).text();
                    jQuery(titleElement).remove();
                }
            }

            // use response title
            if ('' === title && !options['modalTitle'] && this.responseTitle) {
                title = this.responseTitle;
            }

            // find footer
            if (options['modalFooter']) {
                footer = jQuery(options['modalFooter'], content);
                if (footer.length > 0) {
                    footer.detach();
                } else {
                    footer = null;
                }
            }

            // attach container instance to the modal's element
            var modalElement = this.modal.getElement();
            if (!this.containerHandler.hasInstance(modalElement)) {
                jQuery(modalElement).attr('data-role', 'container');
                this.containerHandler.setInstance(modalElement, this);
            }

            // set contents
            this.modal.setTitle(title);
            this.modal.setFooter(footer ? footer.contents() : null);
            this.modal.setBody(content.contents());

            // show the modal
            this.modal.show();
        }

        getParent(): ContainerInterface {
            if (this.originalTrigger) {
                try {
                    return this.containerHandler.findInstanceForElement(<HTMLElement> this.originalTrigger.getElement().parentNode, false);
                } catch (e) {
                    if (!(e instanceof ContainerNotFoundException)) {
                        throw e;
                    }
                }
            }

            return null;
        }
    }

    /**
     * Close modal action
     */
    export class CloseModalAction extends Action
    {
        static keywordHandler = (initiator: WidgetInterface): ActionInterface => {
            return new CloseModalAction(initiator);
        };

        supports(container: ContainerInterface): boolean {
            return container instanceof ModalContainer;
        }

        doExecute(container: ContainerInterface): jQuery.Promise {
            (<ModalContainer> container).getModal().hide();

            return jQuery.Deferred().resolve().promise();
        }
    }

}
