/// <reference path="configuration.ts"/>
/// <reference path="event.ts"/>
/// <reference path="container.ts"/>
/// <reference path="action.ts"/>

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
    import ContainerInterface               = imatic.view.ajaxify.container.ContainerInterface;
    import Container                        = imatic.view.ajaxify.container.Container;
    import ContainerHandler                 = imatic.view.ajaxify.container.ContainerHandler;
    import ContainerNotFoundException       = imatic.view.ajaxify.container.ContainerNotFoundException;
    import TargetHandlerInterface           = imatic.view.ajaxify.container.TargetHandlerInterface;
    import ActionInterface                  = imatic.view.ajaxify.action.ActionInterface;

    /**
     * Modal configuration interface
     * Represents a set of options required for modal dialogs.
     */
    export interface ModalConfigurationInterface
    {
        modalSize: ModalSize;
        modalClosable: boolean;
        modalActions: string;
        modalTitle: string;
        modalHeader: string;
        modalFooter: string;
    }

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
        modalActions: '',
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
                config.modalSize = ModalSize[config.modalSize.toUpper()];
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
            var container = this.jQuery(element).data(this.containerHandler.instanceDataKey);

            if (!container) {

                // find contextual container element
                var contextualContainerElement;
                try {
                    contextualContainerElement = this.containerHandler.getElementFromContext(element);
                } catch (e) {
                    if (!(e instanceof ContainerNotFoundException)) {
                        throw e;
                    }
                }

                // create container
                container = this.containerFactory.create(element, contextualContainerElement);
                this.jQuery(element)
                    .data(this.containerHandler.instanceDataKey, container)
                    .attr(this.containerHandler.instanceMarkAttr, true)
                ;
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
            private document: HTMLDocument,
            private jQuery: any
        ) {}

        /**
         * Create container instance
         */
        create(owningElement: HTMLElement, contextualElement?: HTMLElement): ContainerInterface {
            return new ModalContainer(
                this.configBuilder,
                this.document,
                this.jQuery,
                null,
                contextualElement,
                owningElement
            );
        }
    }

    /**
     * Modal container
     */
    export class ModalContainer extends Container
    {
        private modal = new Modal(this.jQuery, this.document);

        constructor(
            public configBuilder: ConfigurationBuilder,
            public document: HTMLDocument,
            public jQuery: any,
            public element?: HTMLElement,
            public contextualElement?: HTMLElement,
            public owningElement?: HTMLElement
        ) {
            super(configBuilder, document, jQuery, element);
        }

        /**
         * Destructor
         */
        destroy(): void {
            this.modal.destroy();
        }

        /**
         * Get container's element ID
         */
        getId(): string {
            return null;
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

            this.modal.setSize(config.modalSize);
            this.modal.setClosable(config.modalClosable);

            var titleElement;
            if (config.modalTitle) {
                titleElement = this.jQuery(config.modalTitle, content).get(0);
                if (titleElement) {
                    title = this.jQuery(titleElement).text();
                    this.jQuery(titleElement).remove();
                }
            }

            if (config.modalFooter) {
                footer = this.jQuery(config.modalFooter, content);
                if (footer.length > 0) {
                    footer.detach();
                } else {
                    footer = null;
                }
            }

            /*if (!title && this.metadata.title) {
                title = this.metadata.title;
            }*/

            this.modal.setTitle(title);
            this.modal.setFooter(footer ? footer.contents() : null);
            this.modal.setBody(content.contents());

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

            this.jQuery(this.element).modal();
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
         * Set modal's size
         */
        setSize(size: ModalSize): void {
            var smallClass = 'bs-modal-sm';
            var largeClass = 'bs-modal-lg';

            switch (size) {
                case ModalSize.SMALL:
                    this.jQuery(this.element)
                        .removeClass(largeClass)
                        .addClass(smallClass)
                    ;
                    break;
                case ModalSize.NORMAL:
                    this.jQuery(this.element)
                        .removeClass(smallClass)
                        .removeClass(largeClass)
                    ;
                    break;
                case ModalSize.LARGE:
                    this.jQuery(this.element)
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

            this.jQuery('div.modal-footer', this.element)
                .trigger(DomEvents.ON_BEFORE_CONTENT_UPDATE)
                .empty()
                .append(content)
            ;
        }

        /**
         * Create the modal
         */
        private create(): void {
            var html = '<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="imatic_view_ajaxify_modal_title_' + this.uid + '" aria-hidden="true">'
                + '<div class="modal-dialog">'
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
