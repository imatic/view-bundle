/// <reference path="exception.ts"/>
/// <reference path="configuration.ts"/>
/// <reference path="event.ts"/>
/// <reference path="action.ts"/>
/// <reference path="html.ts"/>

/**
 * Imatic view ajaxify container module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module imatic.view.ajaxify.container {

    "use_strict";

    import Exception            = imatic.view.ajaxify.exception.Exception;
    import ConfigurationBuilder = imatic.view.ajaxify.configuration.ConfigurationBuilder;
    import DomEvents            = imatic.view.ajaxify.event.DomEvents;
    import ActionInterface      = imatic.view.ajaxify.action.ActionInterface;
    import HtmlFragment         = imatic.view.ajaxify.html.HtmlFragment;

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
        metadata: ContainerMetadataInterface;

        /**
         * Destructor
         */
        destroy: () => void;

        /**
         * Get container's element ID
         */
        getId: () => string;

        /**
         * See if the container has an element ID
         */
        hasId: () => boolean;

        /**
         * Get container's configuration
         */
        getConfiguration: () => any;

        /**
         * Handle given action
         */
        handleAction: (action: ActionInterface) => void;

        /**
         * Set container's content
         */
        setContent: (content: any) => void;

        /**
         * Set container's HTML content
         */
        setHtml: (html: string) => void;
    }

    /**
     * Container metadata interface
     */
    export interface ContainerMetadataInterface
    {
        title: string;
    }

    /**
     * Target handler interface
     */
    export interface TargetHandlerInterface
    {
        /**
         * See if the handler supports given target and element
         */
        supports: (target: string, element: HTMLElement) => boolean;

        /**
         * Return container instance for given target and element
         */
        findContainer: (target: string, element: HTMLElement) => ContainerInterface;
    }

    /**
     * Container handler
     */
    export class ContainerHandler
    {
        public selector = '[data-role="container"]';
        public instanceDataKey = 'containerInstance';
        public instanceMarkAttr = 'data-has-container-instance';

        private containerFactory = new ContainerFactory(
            this.configBuilder,
            this.document,
            this.jQuery
        );

        private targetHandlers: TargetHandlerInterface[] = [];

        /**
         * Constructor
         */
        constructor(
            private configBuilder: ConfigurationBuilder,
            private document: HTMLDocument,
            private jQuery: any
        ) {}

        /**
         * Add target handler
         */
        addTargetHandler(targetHandler: TargetHandlerInterface): void {
            this.targetHandlers.push(targetHandler);
        }

        /**
         * Validate given element
         */
        isValidContainer(element: HTMLElement): ContainerInterface {
            return this.jQuery(element).is(this.selector);
        }

        /**
         * Get container instance for given element
         */
        findContainer(element: HTMLElement): ContainerInterface {
            var container;
            var target = this.jQuery(element).data('target');

            // choose target handler
            var targetHandler;
            for (var i = 0; i < this.targetHandlers.length; ++i) {
                if (this.targetHandlers[i].supports(target, element)) {
                    targetHandler = this.targetHandlers[i];
                    break;
                }
            }

            // find container
            if (targetHandler) {
                // use target handler
                return targetHandler.findContainer(target, element);
            } else {
                // default implementation
                var containerElement;
                if (!target || '.' === target) {
                    // parent container
                    containerElement = this.getContainerElementFromContext(element);
                } else {
                    // specified by selector
                    containerElement = this.getContainerElementFromSelector(target);
                }

                return this.getContainerInstance(containerElement);
            }
        }

        /**
         * Get container instance
         */
        private getContainerInstance(containerElement: HTMLElement): ContainerInterface {
            var container = this.jQuery(containerElement).data(this.instanceDataKey);
            if (!container) {
                // instance not created
                container = this.containerFactory.create(containerElement);
                this.jQuery(containerElement)
                    .data(this.instanceDataKey, container)
                    .attr(this.instanceMarkAttr, true)
                ;
            }

            return container;
        }

        /**
         * Get container element from given element's context
         */
        getContainerElementFromContext(element: HTMLElement): HTMLElement {
            var parentContainers = this.jQuery(element).parents(this.selector);
            if (parentContainers.length < 1) {
                throw new ContainerNotFoundException('Could not determine the container from context');
            }

            return parentContainers[0];
        }

        /**
         * Get container element using given selector
         */
        getContainerElementFromSelector(selector: string): ContainerInterface {
            var containerElement = this.jQuery(selector, this.document)[0];
            if (!containerElement) {
                throw new ContainerNotFoundException('Container specified by selector "' + selector + '" was not found');
            }
            if (!this.isValidContainer(containerElement)) {
                throw new ContainerNotFoundException('Container specified by selector "' + selector + '" is not a valid container');
            }

            return containerElement;
        }

        /**
         * Get alive container instances for given DOM subtree
         */
        getAliveContainers(element: HTMLElement): ContainerInterface[] {
            var self = this;
            var containers: ContainerInterface[] = [];

            if (this.isValidContainer(element)) {
                containers.push(this.getContainerInstance(element));
            }

            this.jQuery('[' + this.instanceMarkAttr + ']', element).each(function () {
                containers.push(self.jQuery(this).data(self.instanceDataKey));
            });

            return containers;
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
                this.document,
                this.jQuery,
                element
            );
        }
    }

    /**
     * Container
     */
    export class Container implements ContainerInterface
    {
        public currentAction: ActionInterface;
        public metadata: ContainerMetadataInterface = {
            title: null,
        };

        /**
         * Constructor
         */
        constructor(
            public configBuilder: ConfigurationBuilder,
            public document: HTMLDocument,
            public jQuery: any,
            public element?: HTMLElement
        ) {}

        /**
         * Destructor
         */
        destroy(): void {

        }

        /**
         * Get container's element ID
         */
        getId(): string {
            if (!this.hasId()) {
                throw new Error('The container does not have an element ID');
            }
            return this.element.id;
        }

        /**
         * See if the container has an element ID
         */
        hasId(): boolean {
            return this.element && this.element.id ? true: false;
        }

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
                if (!this.currentAction.isComplete()) {
                    this.currentAction.abort();
                }
            }

            // set current action
            this.currentAction = action;

            // execute action
            action.execute(this);
        }

        /**
         * Set container's content
         */
        setContent(content: any): void {
            this.jQuery(this.element)
                .trigger(DomEvents.ON_BEFORE_CONTENT_UPDATE)
                .empty()
                .append(content.contents())
            ;
        }

        /**
         * Set container's HTML content
         */
        setHtml(html: string): void {
            var fragment = new HtmlFragment(html, this.jQuery);
            var content;
            if (this.hasId()) {
                var containerSelector = '#' + this.getId();
                if (fragment.contains(containerSelector)) {
                    content = fragment.find(containerSelector);
                }
            }
            if (!content) {
                content = fragment.root();
            }

            this.setContent(content);
        }
    }

}
