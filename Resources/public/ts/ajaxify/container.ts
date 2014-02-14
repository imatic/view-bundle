/// <reference path="exception.ts"/>
/// <reference path="configuration.ts"/>
/// <reference path="event.ts"/>
/// <reference path="action.ts"/>
/// <reference path="html.ts"/>
/// <reference path="css.ts"/>

/**
 * Imatic view ajaxify container module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module imatic.view.ajaxify.container {

    "use_strict";

    import Exception                = imatic.view.ajaxify.exception.Exception;
    import ConfigurationBuilder     = imatic.view.ajaxify.configuration.ConfigurationBuilder;
    import DomEvents                = imatic.view.ajaxify.event.DomEvents;
    import EventInterface           = imatic.view.ajaxify.event.EventInterface;
    import ActionInterface          = imatic.view.ajaxify.action.ActionInterface;
    import HtmlFragment             = imatic.view.ajaxify.html.HtmlFragment;
    import CssClasses               = imatic.view.ajaxify.css.CssClasses;

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
         * Destructor
         */
        destroy: () => void;

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
        isValidElement(element: HTMLElement): ContainerInterface {
            return this.jQuery(element).is(this.selector);
        }

        /**
         * Check for container instance
         */
        hasInstance(containerElement: HTMLElement): boolean {
            return this.jQuery(containerElement).data(this.instanceDataKey) ? true : false;
        }

        /**
         * Get container instance
         */
        getInstance(containerElement: HTMLElement): ContainerInterface {
            var container = this.jQuery(containerElement).data(this.instanceDataKey);
            if (!container) {
                throw new ContainerNotFoundException('Container instance not found');
            }

            return container;
        }

        /**
         * Set container instance
         */
        setInstance(containerElement: HTMLElement, container: ContainerInterface): void {
            this.jQuery(containerElement)
                .data(this.instanceDataKey, container)
                .attr(this.instanceMarkAttr, true)
                .addClass(CssClasses.CONTAINER)
            ;
        }

        /**
         * Get container instance for given element
         */
        findInstance(element: HTMLElement): ContainerInterface {
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
                    containerElement = this.getElementFromContext(element);
                } else {
                    // specified by selector
                    containerElement = this.getElementFromSelector(target);
                }

                // get instance
                var container;
                if (this.hasInstance(containerElement)) {
                    container = this.getInstance(containerElement);
                } else {
                    container = this.containerFactory.create(containerElement);
                    this.setInstance(containerElement, container);
                }

                return container;
            }
        }
        /**
         * Get container element from given element's context
         */
        getElementFromContext(element: HTMLElement, parentsOnly = false): HTMLElement {
            var containerElement;

            if (!parentsOnly && this.jQuery(element).is(this.selector)) {
                containerElement = element;
            } else {
                var parentContainers = this.jQuery(element).parents(this.selector);
                if (parentContainers.length < 1) {
                    throw new ContainerNotFoundException('Could not determine the container from context');
                }

                containerElement = parentContainers[0];
            }

            return containerElement;
        }

        /**
         * Get container element using given selector
         */
        getElementFromSelector(selector: string): ContainerInterface {
            var containerElement = this.jQuery(selector, this.document)[0];
            if (!containerElement) {
                throw new ContainerNotFoundException('Container specified by selector "' + selector + '" was not found');
            }
            if (!this.isValidElement(containerElement)) {
                throw new ContainerNotFoundException('Container specified by selector "' + selector + '" is not a valid container');
            }

            return containerElement;
        }

        /**
         * Get alive container instances for given DOM subtree
         */
        findInstances(element: HTMLElement): ContainerInterface[] {
            var self = this;
            var containers: ContainerInterface[] = [];

            if (this.isValidElement(element) && this.hasInstance(element)) {
                containers.push(this.getInstance(element));
            }

            this.jQuery('[' + this.instanceMarkAttr + ']', element).each(function () {
                containers.push(self.getInstance(this));
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
         * Get HTML content selector
         */
        getHtmlContentSelector(): string {
            var contentSelector = this.getConfiguration().contentSelector;
            if (!contentSelector && this.element && this.element.id) {
                contentSelector = '#' + this.element.id;
            }
            
            return contentSelector;
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

            // listen to action's events
            action.events.addCallback('begin', (event: EventInterface): void => {
                if (this.element) {
                    this.jQuery(this.element).addClass(CssClasses.COMPONENT_BUSY);
                }
            });
            action.events.addCallback('complete', (event: EventInterface): void => {
                if (this.element) {
                    this.jQuery(this.element).removeClass(CssClasses.COMPONENT_BUSY);
                }
            });

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

            var contentSelector = this.getHtmlContentSelector();
            if (contentSelector) {
                if (fragment.contains(contentSelector)) {
                    content = fragment.find(contentSelector);
                }
            }

            if (!content) {
                content = fragment.root();
            }

            this.setContent(content);
        }
    }

}
