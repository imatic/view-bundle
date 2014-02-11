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
    import Events                           = imatic.view.ajaxify.event.Events;
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
        modalHeader: '',
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
                    contextualContainerElement = this.containerHandler.getContainerElementFromContext(element);
                } catch (e) {
                    if (!(e instanceof ContainerNotFoundException)) {
                        throw e;
                    }
                }

                // create container
                container = this.containerFactory.create(contextualContainerElement);
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
        create(element?: HTMLElement): ContainerInterface {
            return new ModalContainer(
                this.configBuilder,
                this.jQuery,
                element
            );
        }
    }

    /**
     * Modal container
     */
    export class ModalContainer extends Container
    {
        private modal = new Modal(this, this.jQuery);

        /**
         * Destructor
         */
        destroy(): void {
            this.modal.destroy();
        }

        /**
         * Set container's content
         */
        setContent(content: any): void {
            this.modal.setContent(content);
            this.modal.show();
        }
    }

    /**
     * Modal
     */
    class Modal
    {
        /**
         * Constructor
         */
        constructor(
            private container: ContainerInterface,
            private jQuery: any
        ) {}

        /**
         * Show the modal
         */
        show(): void {
        }

        /**
         * Hide the modal
         */
        hide(): void {
        }

        /**
         * Destroy the modal
         */
        destroy(): void {
        }

        /**
         * Set modal's content
         */
        setContent(content: any): void {
            console.log('set modal content', content);
        }
    }

}
