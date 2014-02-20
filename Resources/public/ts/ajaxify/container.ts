/// <reference path="exception.ts"/>
/// <reference path="configuration.ts"/>
/// <reference path="event.ts"/>
/// <reference path="action.ts"/>
/// <reference path="message.ts"/>
/// <reference path="html.ts"/>
/// <reference path="css.ts"/>
/// <reference path="modal.ts"/>
/// <reference path="jquery.ts"/>

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
    import FlashMessageInterface    = imatic.view.ajaxify.message.FlashMessageInterface;
    import HtmlFragment             = imatic.view.ajaxify.html.HtmlFragment;
    import CssClasses               = imatic.view.ajaxify.css.CssClasses;
    import ModalSize                = imatic.view.ajaxify.modal.ModalSize;
    import Modal                    = imatic.view.ajaxify.modal.Modal;
    import jQuery                   = imatic.view.ajaxify.jquery.jQuery;

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
         * See if the container is contextual
         *
         * Contextual containers live as real elements in the DOM even
         * before their respective instances are created.
         */
        isContextual: () => boolean;

        /**
         * Get container's element
         *
         * NULL may be returned.
         */
        getElement: () => HTMLElement;

        /**
         * Handle action
         */
        handleAction: (action: ActionInterface) => void;

        /**
         * Handle flash messages
         */
        handleFlashes: (flashes: FlashMessageInterface[]) => void;

        /**
         * Set container's content
         */
        setContent: (content: any) => void;

        /**
         * Set container's HTML content
         */
        setHtml: (html: string, contentSelector?: string) => void;
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
            this.document
        );

        private targetHandlers: TargetHandlerInterface[] = [];

        /**
         * Constructor
         */
        constructor(
            private configBuilder: ConfigurationBuilder,
            private document: HTMLDocument
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
            return jQuery(element).is(this.selector);
        }

        /**
         * Check for container instance
         */
        hasInstance(containerElement: HTMLElement): boolean {
            return jQuery(containerElement).data(this.instanceDataKey) ? true : false;
        }

        /**
         * Get container instance
         */
        getInstance(containerElement: HTMLElement): ContainerInterface {
            var container = jQuery(containerElement).data(this.instanceDataKey);
            if (!container) {
                throw new ContainerNotFoundException('Container instance not found');
            }

            return container;
        }

        /**
         * Set container instance
         */
        setInstance(containerElement: HTMLElement, container: ContainerInterface): void {
            jQuery(containerElement)
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
            var target = jQuery(element).data('target');

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

            if (!parentsOnly && jQuery(element).is(this.selector)) {
                containerElement = element;
            } else {
                var parentContainers = jQuery(element).parents(this.selector);
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
            var containerElement = jQuery(selector, this.document)[0];
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

            jQuery('[' + this.instanceMarkAttr + ']', element).each(function () {
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
            private document: HTMLDocument
        ) {}

        /**
         * Create container instance
         */
        create(element: HTMLElement): ContainerInterface {
            return new Container(
                this.configBuilder,
                this.document,
                jQuery,
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
            public element: HTMLElement = null
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
         * See if the container is contextual
         */
        isContextual(): boolean {
            return true;
        }

        /**
         * Get container's element
         *
         * NULL may be returned.
         */
        getElement(): HTMLElement {
            return this.element;
        }

        /**
         * Handle action
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
                // add busy class
                if (this.element) {
                    jQuery(this.element).addClass(CssClasses.COMPONENT_BUSY);
                }
            }, 100);

            action.events.addCallback('complete', (event: EventInterface): void => {
                // remove busy class
                if (this.element) {
                    jQuery(this.element).removeClass(CssClasses.COMPONENT_BUSY);
                }

                // handle flash messages
                if (event['response'].flashes.length > 0) {
                    this.handleFlashes(event['response'].flashes);
                } else if (!event['response'].valid) {
                    this.handleFlashes([{
                        type: 'danger',
                        message: 'An error occured',
                    }]);
                }
            }, 100);

            // execute action
            action.execute(this);
        }

        /**
         * Handle flash messages
         */
        handleFlashes(flashes: FlashMessageInterface[]): void {
            var modal = new Modal(this.document);

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

        /**
         * Set container's content
         */
        setContent(content: any): void {
            jQuery(this.element)
                .trigger(DomEvents.ON_BEFORE_CONTENT_UPDATE)
                .empty()
                .append(content.contents())
            ;
        }

        /**
         * Set container's HTML content
         */
        setHtml(html: string, contentSelector?: string): void {
            var fragment = new HtmlFragment(html, jQuery);
            var content;

            if (!contentSelector) {
                contentSelector = this.getHtmlContentSelector();
            }
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
