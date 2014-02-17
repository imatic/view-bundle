/// <reference path="configuration.ts"/>
/// <reference path="event.ts"/>
/// <reference path="container.ts"/>
/// <reference path="action.ts"/>
/// <reference path="form.ts"/>

/**
 * Imatic view ajaxify modal module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module imatic.view.ajaxify.modal {

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
    import Form                             = imatic.view.ajaxify.form.Form;

    /**
     * Modal size
     */
    export enum ModalSize {
        SMALL,
        NORMAL,
        LARGE
    }

    /**
     * Modal configuration defaults
     */
    export var ModalConfigurationDefaults = {
        modalSize: ModalSize.NORMAL,
        modalClosable: true,
        //modalActions: '',
        modalTitle: '',
        modalFooter: '',
    };

    /**
     * Modal configuration processor
     */
    export class ModalConfigurationProcessor implements ConfigurationProcessorInterface
    {
        /**
         * Process configuration
         */
        process(config: any): void {
            if (typeof config.modalSize === 'string') {
                config.modalSize = ModalSize[config.modalSize.toUpperCase()];
            }
        }
    }

    /**
     * Modal handler
     * Creates and manages modal container instances
     */
    export class ModalContainerHandler implements TargetHandlerInterface
    {
        private containerFactory = new ModalContainerFactory(
            this.configBuilder,
            this.containerHandler,
            this.document,
            this.jQuery
        );

        /**
         * Constructor
         */
        constructor(
            private containerHandler: ContainerHandler,
            private configBuilder: ConfigurationBuilder,
            private document: HTMLDocument,
            private jQuery: any
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
            var container;

            if (this.containerHandler.hasInstance(element)) {
                container = this.containerHandler.getInstance(element);
            } else {
                var contextualContainerElement;
                try {
                    contextualContainerElement = this.containerHandler.getElementFromContext(element);
                } catch (e) {
                    if (!(e instanceof ContainerNotFoundException)) {
                        throw e;
                    }
                }

                container = this.containerFactory.create(element, contextualContainerElement);
                this.containerHandler.setInstance(element, container);
            }

            return container;
        }
    }

    /**
     * Modal container factory
     */
    export class ModalContainerFactory
    {
        /**
         * Constructor
         */
        constructor(
            private configBuilder: ConfigurationBuilder,
            private containerHandler: ContainerHandler,
            private document: HTMLDocument,
            private jQuery: any
        ) {}

        /**
         * Create container instance
         */
        create(owningElement: HTMLElement, contextualElement?: HTMLElement): ContainerInterface {
            var container = new ModalContainer(
                this.configBuilder,
                this.document,
                this.jQuery,
                null
            );

            container.handler = this.containerHandler;
            container.owningElement = owningElement;
            container.contextualElement = contextualElement;

            return container;
        }
    }

    /**
     * Modal container
     */
    export class ModalContainer extends Container
    {
        handler: ContainerHandler;
        contextualElement: HTMLElement;
        owningElement: HTMLElement;

        private modal = new Modal(this.jQuery, this.document);

        /**
         * Destructor
         */
        destroy(): void {
            this.modal.destroy();
        }

        /**
         * Handle given action
         */
        handleAction(action: ActionInterface): void {
            action.events.addCallback('apply', (event: EventInterface): void => {
                if (
                    event['response'].successful
                    && event['initiator'] instanceof Form
                    && this.jQuery(this.modal.getElement()).has(event['initiator'].getElement()).length > 0
                ) {
                    event['proceed'] = false;

                    this.modal.hide();
                }
            });

            super.handleAction(action);
        }

        /**
         * Get container's configuration
         */
        getConfiguration(): any {
            return this.configBuilder.build(
                this.owningElement,
                this.configBuilder.build(this.contextualElement)
            );
        }

        /**
         * Set container's content
         */
        setContent(content: any): void {
            var config = this.getConfiguration();

            var title = '';
            var footer = null;

            // configure modal
            this.modal.setSize(config.modalSize);
            this.modal.setClosable(config.modalClosable);

            // find title
            var titleElement;
            if (config.modalTitle) {
                titleElement = this.jQuery(config.modalTitle, content).get(0);
                if (titleElement) {
                    title = this.jQuery(titleElement).text();
                    this.jQuery(titleElement).remove();
                }
            }

            // find footer
            if (config.modalFooter) {
                footer = this.jQuery(config.modalFooter, content);
                if (footer.length > 0) {
                    footer.detach();
                } else {
                    footer = null;
                }
            }

            // attach container instance to the modal's element
            var modalElement = this.modal.getElement();
            if (!this.handler.hasInstance(modalElement)) {
                this.jQuery(modalElement).attr('data-role', 'container');
                this.handler.setInstance(modalElement, this);
            }

            // set contents
            this.modal.setTitle(title);
            this.modal.setFooter(footer ? footer.contents() : null);
            this.modal.setBody(content.contents());

            // show the modal
            this.modal.show();
        }
    }

    /**
     * Modal
     */
    class Modal
    {
        static uidCounter = 0;
        private element: HTMLElement;
        private uid: number;
        private closable: boolean = true;

        /**
         * Constructor
         */
        constructor(
            private jQuery: any,
            private document: HTMLDocument
        ) {
            this.uid = ++Modal.uidCounter;
        }

        /**
         * Show the modal
         */
        show(): void {
            if (!this.element) {
                this.create();
            }

            var options: {[key: string]: any} = {};

            if (!this.closable) {
                options['backdrop'] = 'static';
                options['keyboard'] = false;
            }

            this.jQuery(this.element).modal(options);
        }

        /**
         * Hide the modal
         */
        hide(): void {
            if (this.element) {
                this.jQuery(this.element).modal('hide');
            }
        }

        /**
         * Destroy the modal
         */
        destroy(): void {
            if (this.element) {
                this.jQuery(this.element).remove();
                this.element = null;
            }
        }

        /**
         * Get modal's element
         */
        getElement(): HTMLElement {
            if (!this.element) {
                this.create();
            }

            return this.element;
        }

        /**
         * Set modal's size
         */
        setSize(size: ModalSize): void {
            if (!this.element) {
                this.create();
            }

            var smallClass = 'modal-sm';
            var largeClass = 'modal-lg';
            var dialog = this.jQuery('div.modal-dialog', this.element);

            switch (size) {
                case ModalSize.SMALL:
                      dialog
                        .removeClass(largeClass)
                        .addClass(smallClass)
                    ;
                    break;
                case ModalSize.NORMAL:
                    dialog
                        .removeClass(smallClass)
                        .removeClass(largeClass)
                    ;
                    break;
                case ModalSize.LARGE:
                    dialog
                        .removeClass(smallClass)
                        .addClass(largeClass)
                    ;
                    break;
            }
        }

        /**
         * Set modal's closable state
         */
        setClosable(closable: boolean): void {
            if (!this.element) {
                this.create();
            }

            this.closable = closable;

            var closeButton = this.jQuery('div.modal-header > button.close', this.element);
            if (closable) {
                closeButton.show();
            } else {
                closeButton.hide();
            }
        }

        /**
         * Set modal's title
         */
        setTitle(title: string): void {
            if (!this.element) {
                this.create();
            }

            this.jQuery('div.modal-header > h4.modal-title', this.element)
                .text(title)
            ;
        }

        /**
         * Set modal's body content
         */
        setBody(content: any): void {
            if (!this.element) {
                this.create();
            }

            this.jQuery('div.modal-body', this.element)
                .trigger(DomEvents.ON_BEFORE_CONTENT_UPDATE)
                .empty()
                .append(content)
            ;
        }

        /**
         * Set modal's footer content
         */
        setFooter(content: any): void {
            if (!this.element) {
                this.create();
            }

            var footer = this.jQuery('div.modal-footer', this.element);

            footer
                .trigger(DomEvents.ON_BEFORE_CONTENT_UPDATE)
                .empty()
            ;

            if (content) {
                footer
                    .append(content)
                    .show()
                ;
            } else {
                footer.hide();
            }
        }

        /**
         * Create the modal
         */
        private create(): void {
            var html = '<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="imatic_view_ajaxify_modal_title_' + this.uid + '" aria-hidden="true">'
                + '<div class="modal-dialog">'
                    + '<div class="modal-content">'
                        + '<div class="modal-header">'
                            + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
                            + '<h4 class="modal-title" id="imatic_view_ajaxify_modal_title_' + this.uid + '">Modal title</h4>'
                        + '</div>'
                        + '<div class="modal-body"></div>'
                        + '<div class="modal-footer"></div>'
                    + '</div>'
                + '</div>'
                + '</div>'
            ;

            this.element = this.jQuery(html, this.document).appendTo(this.document.body)[0];

            this.jQuery(this.element).on('hidden.bs.modal', (): void => {
                this.destroy();
            });
        }
    }

}
