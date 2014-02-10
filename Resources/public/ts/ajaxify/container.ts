/// <reference path="exception.ts"/>
/// <reference path="configuration.ts"/>
/// <reference path="action.ts"/>

/**
 * Imatic view ajaxify container module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module imatic.view.ajaxify.container {

    "use_strict";
    
    import Exception            = imatic.view.ajaxify.exception.Exception;
    import ConfigurationBuilder = imatic.view.ajaxify.configuration.ConfigurationBuilder;
    import ActionInterface      = imatic.view.ajaxify.action.ActionInterface;
    
    /**
     * Container not found exception
     */
    export class ContainerNotFoundException extends Exception {
        name = "ContainerNotFound";
    }
    
    /**
     * Container interface
     */
    export interface ContainerInterface
    {
        /**
         * Get container's configuration
         */                 
        getConfiguration: () => any;
        
        /**
         * Handle given action
         */
        handleAction: (action: ActionInterface) => void;
        
        /**
         * Set container's HTML contents
         */
        setHtml: (html: string) => void;
    }
    
    /**
     * Container handler
     */         
    export class ContainerHandler
    {
        private containerFactory = new ContainerFactory(this.configBuilder, this.document, this.jQuery);
        private containerSelector = '[data-role="container"]';
        private containerInstanceDataAttribute = 'containerInstance';
        
        /**
         * Constructor
         */           
        constructor(
            private configBuilder: ConfigurationBuilder,
            private document: HTMLDocument,
            private jQuery: any
        ) {}      
    
        /**
         * Get container instance for given element
         */
        getContainer(element: HTMLElement): ContainerInterface {
            var target = this.jQuery(element).data('target');

            var container;
            if ('modal' === target) {
                // modal
                throw new Error('Not implemented');
            } else {
                // element
                var containerElement;
                if (!target || '.' === target) {
                    // parent container
                    containerElement = this.getContainerElementFromContext(element);
                } else {
                    // specified by selector
                    containerElement = this.getContainerElementFromSelector(target);
                }

                // fetch container instance
                container = this.jQuery(containerElement).data(this.containerInstanceDataAttribute);
                if (!container) {
                    // instance not created
                    container = this.containerFactory.create(containerElement);
                    this.jQuery(containerElement).data(this.containerInstanceDataAttribute, container)
                }
            }

            return container;
        }

        /**
         * Get container element from given element's context
         */
        private getContainerElementFromContext(element: HTMLElement): HTMLElement {
            var parentContainers = this.jQuery(element).parents(this.containerSelector);
            if (parentContainers.length < 1) {
                throw new ContainerNotFoundException('Could not determine the container from context');
            }

            return parentContainers[0];
        }

        /**
         * Get container element using given selector
         */
        private getContainerElementFromSelector(selector: string): ContainerInterface {
            var containerElement = this.jQuery(selector, this.document)[0];
            if (!containerElement) {
                throw new ContainerNotFoundException('Container specified by selector "' + selector + '" was not found');
            }
            if (!this.jQuery(containerElement).is(this.containerSelector)) {
                throw new ContainerNotFoundException('Container specified by selector "' + selector + '" is not a valid container');
            }

            return containerElement;
        }
    }
    
    /**
     * Container factory    
     */
    export class ContainerFactory
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
        create(element: HTMLElement): ContainerInterface {
            return new Container(
                this.configBuilder,
                element,
                this.jQuery
            );
        }
    }
    
    /**
     * Container
     */
    class Container implements ContainerInterface
    {
        private currentAction: ActionInterface;

        /**
         * Constructor
         */
        constructor(
            private configBuilder: ConfigurationBuilder,
            private element: HTMLElement,
            private jQuery: any
        ) {}

        /**
         * Get container's configuration
         */
        getConfiguration(): any {
            return this.configBuilder.build(this.element);
        }

        /**
         * Handle given action
         */
        handleAction(action: ActionInterface): void {
            // abort current action
            if (this.currentAction) {
                if (!this.currentAction.complete) {
                    this.currentAction.abort();
                }
            }

            // execute aaction
            this.currentAction = action;
            action.onComplete = this.onActionComplete;
            action.execute(this);
        }

        /**
         * On action complete callback
         */
        onActionComplete = (action: ActionInterface): void => {

        };

        /**
         * Set container's HTML contents
         */
        setHtml(html: string): void {
            this.jQuery(this.element).html(html);
        }
    }

}
