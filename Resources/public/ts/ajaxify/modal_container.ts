/// <reference path="configuration.ts"/>
/// <reference path="event.ts"/>
/// <reference path="container.ts"/>
/// <reference path="action.ts"/>
/// <reference path="form.ts"/>
/// <reference path="widget.ts"/>
/// <reference path="modal.ts"/>
/// <reference path="jquery.ts"/>

/**
 * Imatic view ajaxify modal container module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module imatic.view.ajaxify.modalContainer {

    "use_strict";

    import ConfigurationBuilder             = imatic.view.ajaxify.configuration.ConfigurationBuilder;
    import ConfigurationProcessorInterface  = imatic.view.ajaxify.configuration.ConfigurationProcessorInterface;
    import DomEvents                        = imatic.view.ajaxify.event.DomEvents;
    import EventInterface                   = imatic.view.ajaxify.event.EventInterface;
    import ContainerInterface               = imatic.view.ajaxify.container.ContainerInterface;
    import Container                        = imatic.view.ajaxify.container.Container;
    import ContainerHandler                 = imatic.view.ajaxify.container.ContainerHandler;
    import ContainerNotFoundException       = imatic.view.ajaxify.container.ContainerNotFoundException;
    import TargetHandlerInterface           = imatic.view.ajaxify.container.TargetHandlerInterface;
    import ActionInterface                  = imatic.view.ajaxify.action.ActionInterface;
    import LoadHtmlAction                   = imatic.view.ajaxify.action.LoadHtmlAction;
    import Form                             = imatic.view.ajaxify.form.Form;
    import WidgetHandler                    = imatic.view.ajaxify.widget.WidgetHandler;
    import WidgetInterface                  = imatic.view.ajaxify.widget.WidgetInterface;
    import ModalSize                        = imatic.view.ajaxify.modal.ModalSize;
    import Modal                            = imatic.view.ajaxify.modal.Modal;
    import jQuery                           = imatic.view.ajaxify.jquery.jQuery;

    /**
     * Modal configuration defaults
     */
    export var ModalConfigurationDefaults = {
        modalSize: ModalSize.NORMAL,
        modalClosable: true,
        modalTitle: '',
        modalFooter: '',
        modalOnClose: '',
    };

    /**
     * Modal configuration processor
     */
    export class ModalConfigurationProcessor implements ConfigurationProcessorInterface
    {
        /**
         * Process configuration
         */
        process(config: {[key: string]: any;}): void {
            // modal-size
            if ('string' === typeof config['modalSize']) {
                config['modalSize'] = ModalSize[config['modalSize'].toUpperCase()];
            } else {
                config['modalSize'] = ModalSize.NORMAL;
            }

            // modal-on-close
            var modalOnClose = null;
            if ('string' === typeof config['modalOnClose'] && config['modalOnClose']) {
                if ('reload' === config['modalOnClose']) {
                    config['modalOnClose'] = 'load:';
                }
                modalOnClose = config['modalOnClose'].split(':', 2);
                if (2 !== modalOnClose.length || 'load' !== modalOnClose[0]) {
                    modalOnClose = null;
                }
            }
            config['modalOnClose'] = modalOnClose;
        }
    }

    /**
     * Modal container handler
     * Creates and manages modal container instances
     */
    export class ModalContainerHandler implements TargetHandlerInterface
    {
        private containerFactory = new ModalContainerFactory(
            this.configBuilder,
            this.containerHandler,
            this.widgetHandler,
            this.document
        );

        /**
         * Constructor
         */
        constructor(
            private containerHandler: ContainerHandler,
            private widgetHandler: WidgetHandler,
            private configBuilder: ConfigurationBuilder,
            private document: HTMLDocument
        ) {}

        /**
         * See if the handler supports given target and element
         */
        supports(target: string, element: HTMLElement): boolean {
            return 'modal' === target;
        }

        /**
         * Return container instance for given target and element
         */
        findContainer(target: string, element: HTMLElement): ContainerInterface {
            return this.containerFactory.create(element);
        }
    }

    /**
     * Modal container factory
     */
    class ModalContainerFactory
    {
        /**
         * Constructor
         */
        constructor(
            private configBuilder: ConfigurationBuilder,
            private containerHandler: ContainerHandler,
            private widgetHandler: WidgetHandler,
            private document: HTMLDocument
        ) {}

        /**
         * Create container instance
         */
        create(trigger: HTMLElement): ContainerInterface {
            var container = new ModalContainer(
                this.configBuilder,
                this.document,
                null
            );

            container.containerHandler = this.containerHandler;
            container.widgetHandler = this.widgetHandler;
            container.originalTrigger = trigger;

            return container;
        }
    }

    /**
     * Modal container
     */
    export class ModalContainer extends Container
    {
        containerHandler: ContainerHandler;
        widgetHandler: WidgetHandler;
        originalTrigger: HTMLElement;

        private modal = new Modal(this.document);
        private actionInitiator: WidgetInterface;
        private responseTitle: string;

        /**
         * Destructor
         */
        destroy(): void {
            if (this.modal.hasElement()) {
                this.modal.destroy();
            }

            if (this.originalTrigger && this.widgetHandler.hasInstance(this.originalTrigger)) {
                var originalTriggerWidget = this.widgetHandler.getInstance(this.originalTrigger);
                var originalTriggerWidgetConfig = originalTriggerWidget.getConfiguration();
                if (originalTriggerWidgetConfig['modalOnClose']) {
                    this.executeOnClose(originalTriggerWidget, originalTriggerWidgetConfig['modalOnClose']);
                }
            }
        }

        /**
         * Execute on close action
         */
        private executeOnClose(originalTriggerWidget: WidgetInterface, onClose: string[]) {
            var action;

            if ('load' === onClose[0]) {
                action = new LoadHtmlAction(originalTriggerWidget, {
                    url: onClose[1] || originalTriggerWidget.getElement().ownerDocument.location.toString().split('#', 2)[0],
                    method: 'GET',
                    data: null,
                    contentSelector: null,
                });
            }

            if (action) {
                jQuery(originalTriggerWidget.getElement()).trigger(
                    DomEvents.ACTION,
                    [action]
                );
            }
        }

        /**
         * Handle given action
         */
        handleAction(action: ActionInterface): void {
            action.events.addCallback('apply', (event: EventInterface): void => {
                if (event['response'].valid) {
                    this.actionInitiator = event['initiator'];
                    this.responseTitle = event['response'].title || null;

                    // close modal on form submit
                    if (
                        event['response'].successful
                        && this.actionInitiator instanceof Form
                        && jQuery(this.modal.getElement()).has(this.actionInitiator.getElement()).length > 0
                    ) {
                        event['proceed'] = false;
                        this.modal.hide();
                    }

                }
            });

            super.handleAction(action);
        }

        /**
         * Get container's configuration
         */
        getConfiguration(): {[key: string]: any;} {
            if (this.actionInitiator) {
                return this.actionInitiator.getConfiguration();
            } else {
                return {};
            }
        }

        /**
         * See if the container is contextual
         */
        isContextual(): boolean {
            return false;
        }

        /**
         * Get container's element
         *
         * NULL may be returned.
         */
        getElement(): HTMLElement {
            return null;
        }

        /**
         * Set container's content
         */
        setContent(content: any): void {
            var config = this.getConfiguration();

            var title = '';
            var footer = null;

            // configure modal
            this.modal.setSize(config['modalSize']);
            this.modal.setClosable(config['modalClosable']);

            // find title
            var titleElement;
            if (config['modalTitle'] && 'none' !== config['modalTitle']) {
                titleElement = jQuery(config['modalTitle'], content).get(0);
                if (titleElement) {
                    title = jQuery(titleElement).text();
                    jQuery(titleElement).remove();
                }
            }

            // use response title
            if ('' === title && !config['modalTitle'] && this.responseTitle) {
                title = this.responseTitle;
            }

            // find footer
            if (config['modalFooter']) {
                footer = jQuery(config['modalFooter'], content);
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
    }

}
