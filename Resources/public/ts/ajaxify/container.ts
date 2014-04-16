/// <reference path="exception.ts"/>
/// <reference path="configuration.ts"/>
/// <reference path="event.ts"/>
/// <reference path="action.ts"/>
/// <reference path="message.ts"/>
/// <reference path="css.ts"/>
/// <reference path="modal.ts"/>
/// <reference path="jquery.ts"/>
/// <reference path="history.ts"/>
/// <reference path="ajax.ts"/>


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
    import RequestAction            = imatic.view.ajaxify.action.RequestAction;
    import FlashMessageInterface    = imatic.view.ajaxify.message.FlashMessageInterface;
    import CssClasses               = imatic.view.ajaxify.css.CssClasses;
    import ModalSize                = imatic.view.ajaxify.modal.ModalSize;
    import Modal                    = imatic.view.ajaxify.modal.Modal;
    import jQuery                   = imatic.view.ajaxify.jquery.jQuery;
    import HistoryHandler           = imatic.view.ajaxify.history.HistoryHandler;
    import RequestInfo              = imatic.view.ajaxify.ajax.RequestInfo;
    import RequestHelper            = imatic.view.ajaxify.ajax.RequestHelper;

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
         * See if the container is contextual
         *
         * Contextual containers live as real elements in the DOM even
         * before their respective instances are created.
         */
        isContextual: () => boolean;

        /**
         * Get container's configuration
         */
        getConfiguration: () => {[key: string]: any;};

        /**
         * Get ID
         *
         * NULL may be returned.
         */
        getId: () => string;

        /**
         * Get content selector
         */
        getContentSelector: () => string;

        /**
         * Get current request, if any
         */
        getCurrentRequest: () => RequestInfo;

        /**
         * Get container's element
         *
         * NULL may be returned.
         */
        getElement: () => HTMLElement;

        /**
         * Set container's content
         */
        setContent: (content: JQuery) => void;

        /**
         * Handle action
         */
        handleAction: (action: ActionInterface) => void;

        /**
         * Handle flash messages
         */
        handleFlashes: (flashes: FlashMessageInterface[]) => void;
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
            this,
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
        isValidElement(element: HTMLElement): boolean {
            return jQuery(element).is(this.selector);
        }

        /**
         * Get ID from container element
         *
         * NULL may be returned.
         */
        getId(containerElement: HTMLElement): string {
            if (containerElement.id) {
                return containerElement.id;
            } else {
                return null;
            }
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
                .attr(this.instanceMarkAttr, 'true')
                .addClass(CssClasses.CONTAINER)
            ;
        }

        /**
         * Get container instance for given element
         */
        findInstance(element: HTMLElement, considerTarget = true): ContainerInterface {
            var container;
            var target;
            if (considerTarget) {
                target = jQuery(element).data('target');
            }

            // choose target handler
            var targetHandler;
            if (considerTarget) {
                for (var i = 0; i < this.targetHandlers.length; ++i) {
                    if (this.targetHandlers[i].supports(target, element)) {
                        targetHandler = this.targetHandlers[i];
                        break;
                    }
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
        getElementFromSelector(selector: string): HTMLElement {
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
         *
         * If no element is given, the whole document is searched.
         */
        findInstances(element?: HTMLElement): ContainerInterface[] {
            var self = this;
            var containers: ContainerInterface[] = [];
            element = element || this.document.body;

            if (this.isValidElement(element) && this.hasInstance(element)) {
                containers.push(this.getInstance(element));
            }

            jQuery('[' + this.instanceMarkAttr + ']', element).each(function () {
                containers.push(self.getInstance(this));
            });

            return containers;
        }

        /**
         * Get container elements for given DOM subtree
         *
         * If no element is given, the whole document is searched.
         */
        findElements(element?: HTMLElement): HTMLElement[] {
            var elements: HTMLElement[] = [];
            element = element || this.document.body;

            if (this.isValidElement(element)) {
                elements.push(element);
            }

            jQuery(this.selector, element).each(function () {
                elements.push(this);
            });

            return elements;
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
            private containerHandler: ContainerHandler,
            private configBuilder: ConfigurationBuilder,
            private document: HTMLDocument
        ) {}

        /**
         * Create container instance
         */
        create(element: HTMLElement): ContainerInterface {
            return new Container(
                this.containerHandler,
                this.configBuilder,
                this.document,
                element
            );
        }
    }

    /**
     * Container
     */
    export class Container implements ContainerInterface
    {
        private currentAction: ActionInterface;
        private currentRequest: RequestInfo;

        /**
         * Constructor
         */
        constructor(
            public containerHandler: ContainerHandler,
            public configBuilder: ConfigurationBuilder,
            public document: HTMLDocument,
            public element: HTMLElement = null
        ) {
            this.currentRequest = null;
        }

        /**
         * Destructor
         */
        destroy(): void {

        }

        /**
         * See if the container is contextual
         */
        isContextual(): boolean {
            return true;
        }

        /**
         * Get container's configuration
         */
        getConfiguration(): {[key: string]: any;} {
            return this.configBuilder.build(this.element);
        }

        /**
         * Get ID
         *
         * NULL may be returned.
         */
        getId(): string {
            if (this.element && this.element.id) {
                return this.element.id;
            } else {
                return null;
            }
        }

        /**
         * Get HTML content selector
         */
        getContentSelector(): string {
            var contentSelector = this.getConfiguration()['contentSelector'];
            if (!contentSelector) {
                var elementId = this.getId();
                if (elementId) {
                    contentSelector = '#' + elementId;
                }
            }

            return contentSelector;
        }

        /**
         * Get current request, if any
         */
        getCurrentRequest(): RequestInfo {
            return this.currentRequest;
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
         * Set container's content
         */
        setContent(content: JQuery): void {
            jQuery(this.element)
                .trigger(DomEvents.BEFORE_CONTENT_UPDATE)
                .empty()
                .append(content.contents())
            ;
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
            action.events.addCallback('begin', this.handleActionStart, 100);
            action.events.addCallback('complete', this.handleActionCompletion, 100);

            // execute action
            action.execute(this);
        }

        /**
         * Handle action's start
         */
        handleActionStart = (event: EventInterface): void => {
            // add busy class
            if (this.element) {
                jQuery(this.element).addClass(CssClasses.COMPONENT_BUSY);
            }

            // modify request if @current or @reload was used
            if (event['request']) {
                var requestUrl = event['request'].getUrl();
                if ('@reload' === requestUrl || '@current' === requestUrl) {
                    var currentRequest;

                    // determine current request
                    if (this.currentRequest) {
                        currentRequest = this.currentRequest;
                    } else {
                        currentRequest = RequestHelper.parseRequestString(
                            this.getConfiguration()['initial']
                        );
                    }

                    // modify request
                    if ('@reload' === requestUrl) {
                        // reload using complete current request info
                        event['request'].applyInfo(currentRequest);
                    } else {
                        // change the URL
                        event['request'].setUrl(currentRequest.url);

                        // change the data if the request method
                        // is GET and the request has no data of its own
                        if (
                            'GET' === event['request'].getMethod()
                            && 'GET' === currentRequest.method
                            && !event['request'].hasData()
                        ) {
                            event['request'].setData(currentRequest.data);
                        }
                    }
                }
            }
        }

        /**
         * Handle action's completion
         */
        handleActionCompletion = (event: EventInterface): void => {
            var config = this.getConfiguration();
            var elementId = this.getId();

            // remove busy class
            if (this.element) {
                jQuery(this.element).removeClass(CssClasses.COMPONENT_BUSY);
            }

            // handle flash messages
            if (event['response'].flashes.length > 0) {
                this.handleFlashes(event['response'].flashes);
            } else if (!event['response'].valid && !event['response'].aborted) {
                this.handleFlashes([{
                    type: 'danger',
                    message: 'An error occured'
                }]);
            }

            // update current request
            this.currentRequest = event['response'].request;

            // handle history
            if (event['response'].valid && config['history'] && elementId) {
                // state change
                if (event['initiator']) {
                    HistoryHandler.containerStateChange(
                        elementId,
                        event['response'].fullTitle,
                        event['response'].request
                    );
                }
            }
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
    }

}
