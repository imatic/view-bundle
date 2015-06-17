/// <reference path="Object.ts"/>
/// <reference path="Exception.ts"/>
/// <reference path="Configuration.ts"/>
/// <reference path="Action.ts"/>
/// <reference path="Message.ts"/>
/// <reference path="Css.ts"/>
/// <reference path="Jquery.ts"/>
/// <reference path="History.ts"/>
/// <reference path="Ajax.ts"/>
/// <reference path="Dom.ts"/>
/// <reference path="Widget.ts"/>


/**
 * Imatic view ajaxify container module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module Imatic.View.Ajaxify.Container {

    "use_strict";

    import ajaxify                  = Imatic.View.Ajaxify;
    import jQuery                   = Imatic.View.Ajaxify.Jquery.jQuery;
    import Object                   = Imatic.View.Ajaxify.Object.Object;
    import ObjectInterface          = Imatic.View.Ajaxify.Object.ObjectInterface;
    import ConfigurationInterface   = Imatic.View.Ajaxify.Configuration.ConfigurationInterface;
    import Exception                = Imatic.View.Ajaxify.Exception.Exception;
    import DomEvents                = Imatic.View.Ajaxify.Dom.DomEvents;
    import ActionInterface          = Imatic.View.Ajaxify.Action.ActionInterface;
    import ActionEvent              = Imatic.View.Ajaxify.Action.ActionEvent;
    import RequestAction            = Imatic.View.Ajaxify.Action.RequestAction;
    import FlashMessageInterface    = Imatic.View.Ajaxify.Message.FlashMessageInterface;
    import CssClasses               = Imatic.View.Ajaxify.Css.CssClasses;
    import HistoryHandler           = Imatic.View.Ajaxify.History.HistoryHandler;
    import RequestInfo              = Imatic.View.Ajaxify.Ajax.RequestInfo;
    import WidgetInterface          = Imatic.View.Ajaxify.Widget.WidgetInterface;

    /**
     * Container not found exception
     */
    export class ContainerNotFoundException extends Exception {
        name = 'ContainerNotFound';
    }

    /**
     * Container interface
     */
    export interface ContainerInterface extends ObjectInterface
    {
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
         * Get initiator of current request, if any
         */
        getCurrentRequestInitiator: () => WidgetInterface;

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

        /**
         * Get parent container
         *
         * NULL may be returned.
         */
        getParent: () => ContainerInterface;
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
        private selector = '[data-role="container"]';
        private instanceDataKey = 'containerInstance';
        private containerFactory = new ContainerFactory(this);
        private targetHandlers: TargetHandlerInterface[] = [];

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
         * Get ID from a container element
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
            var containerElement = jQuery(selector)[0];
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
            element = element || ajaxify.domDocument.body;

            if (this.isValidElement(element) && this.hasInstance(element)) {
                containers.push(this.getInstance(element));
            }

            jQuery('.' + CssClasses.CONTAINER, element).each(function () {
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
            element = element || ajaxify.domDocument.body;

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
        constructor(
            private containerHandler: ContainerHandler
        ) {}

        /**
         * Create container instance
         */
        create(element: HTMLElement): ContainerInterface {
            return new Container(
                this.containerHandler,
                element
            );
        }
    }

    /**
     * Container
     */
    export class Container extends Object implements ContainerInterface
    {
        private currentAction: ActionInterface;
        private currentRequest: RequestInfo = null;
        private currentRequestInitiator: WidgetInterface = null;

        constructor(
            public containerHandler: ContainerHandler,
            public element: HTMLElement = null
        ) {
            super();
        }

        loadOptions(): ConfigurationInterface {
            if (this.element) {
                return ajaxify.configBuilder.buildFromDom(this.element);
            } else {
                return ajaxify.configBuilder.buildFromData({});
            }
        }

        getId(): string {
            if (this.element && this.element.id) {
                return this.element.id;
            } else {
                return null;
            }
        }

        getContentSelector(): string {
            var contentSelector = this.getOption('contentSelector');
            if (!contentSelector) {
                var elementId = this.getId();
                if (elementId) {
                    contentSelector = '#' + elementId;
                }
            }

            return contentSelector;
        }

        getCurrentRequest(): RequestInfo {
            return this.currentRequest;
        }

        getCurrentRequestInitiator(): WidgetInterface {
            return this.currentRequestInitiator;
        }

        getElement(): HTMLElement {
            return this.element;
        }

        setContent(content: JQuery): void {
            jQuery(this.element)
                .trigger(DomEvents.BEFORE_CONTENT_UPDATE)
                .empty()
                .append(content.contents())
                .trigger(DomEvents.AFTER_CONTENT_UPDATE)
            ;
        }

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
            action.listen('begin', this.onActionStart, 100);
            action.listen('complete', this.onActionComplete, 100);

            // execute action
            action.execute(this);
        }

        /**
         * Handle action's start
         */
        onActionStart = (event: ActionEvent): void => {
            // add busy class
            if (this.element) {
                jQuery(this.element).addClass(CssClasses.COMPONENT_BUSY);
            }
        }

        /**
         * Handle action's completion
         */
        onActionComplete = (event: ActionEvent): void => {
            var elementId = this.getId();

            // remove busy class
            if (this.element) {
                jQuery(this.element).removeClass(CssClasses.COMPONENT_BUSY);
            }

            // handle response
            if (event.response) {
                // update current request and initiator
                this.currentRequest = event.response.request;
                this.currentRequestInitiator = event.action.getInitiator();

                // handle history
                if (event.response.valid && this.getOption('history') && elementId) {
                    // state change
                    if (event.action.hasInitiator()) {
                        HistoryHandler.containerStateChange(
                            elementId,
                            event.response.fullTitle,
                            event.response.request
                        );
                    }
                }
            }
        }

        handleFlashes(flashes: FlashMessageInterface[]): void {
            // trigger event
            var event = jQuery.Event(DomEvents.HANDLE_FLASH_MESSAGES, {flashes: flashes});
            jQuery(this.getElement() || ajaxify.domDocument.body).trigger(event);
        }

        getParent(): ContainerInterface {
            if (this.element) {
                try {
                    return this.containerHandler.findInstance(<HTMLElement> this.element.parentNode, false);
                } catch (e) {
                    if (!(e instanceof ContainerNotFoundException)) {
                        throw e;
                    }
                }
            }

            return null;
        }
    }

}
