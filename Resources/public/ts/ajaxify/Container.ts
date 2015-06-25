/// <reference path="Object.ts"/>
/// <reference path="Exception.ts"/>
/// <reference path="Configuration.ts"/>
/// <reference path="Action.ts"/>
/// <reference path="Message.ts"/>
/// <reference path="Css.ts"/>
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

    import Ajaxify                  = Imatic.View.Ajaxify;
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
            return $(element).is(this.selector);
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
            return $(containerElement).data(this.instanceDataKey) ? true : false;
        }

        /**
         * Get container instance from the given element
         */
        getInstance(containerElement: HTMLElement, autoCreate = false): ContainerInterface {
            var container = $(containerElement).data(this.instanceDataKey);
            if (!container) {
                if (!autoCreate) {
                    throw new ContainerNotFoundException('Container instance not found');
                }

                // auto-create
                container = this.containerFactory.create(containerElement);
                this.setInstance(containerElement, container);
            }

            return container;
        }

        /**
         * Set container instance on the given element
         */
        setInstance(containerElement: HTMLElement, container: ContainerInterface): void {
            $(containerElement)
                .data(this.instanceDataKey, container)
                .addClass(CssClasses.CONTAINER)
            ;
        }

        /**
         * Find container instance for the given target
         */
        findInstanceForTarget(target: string, context?: HTMLElement): ContainerInterface {
            // choose target handler
            var targetHandler;
            for (var i = 0; i < this.targetHandlers.length; ++i) {
                if (this.targetHandlers[i].supports(target, context)) {
                    targetHandler = this.targetHandlers[i];
                    break;
                }
            }

            // find container
            if (targetHandler) {
                // use target handler
                return targetHandler.findContainer(target, context);
            } else {
                // default implementation
                var containerElement;
                if (!target || '.' === target) {
                    // parent container
                    if (null == context) {
                        throw new ContainerNotFoundException('Cannot find a container when neither the target nor the context has been defined');
                    }
                    containerElement = this.getElementFromContext(context);
                } else {
                    // specified by selector
                    containerElement = this.getElementFromSelector(target);
                }

                // get instance
                return this.getInstance(containerElement, true);
            }
        }

        /**
         * Find container instance for the given element
         */
        findInstanceForElement(element: HTMLElement, considerTarget = true): ContainerInterface {
            return this.findInstanceForTarget(
                considerTarget ? $(element).data('target') : null,
                element
            );
        }

        /**
         * Get container element from given element's context
         */
        getElementFromContext(element: HTMLElement, parentsOnly = false): HTMLElement {
            var containerElement;

            if (!parentsOnly && $(element).is(this.selector)) {
                containerElement = element;
            } else {
                var parentContainers = $(element).parents(this.selector);
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
            var containerElement = $(selector)[0];
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
            element = element || document.body;

            if (this.isValidElement(element) && this.hasInstance(element)) {
                containers.push(this.getInstance(element));
            }

            $('.' + CssClasses.CONTAINER, element).each(function () {
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
            element = element || document.body;

            if (this.isValidElement(element)) {
                elements.push(element);
            }

            $(this.selector, element).each(function () {
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
        public containerHandler: ContainerHandler;

        private _element: HTMLElement;
        private currentAction: ActionInterface;
        private currentRequest: RequestInfo = null;
        private currentRequestInitiator: WidgetInterface = null;

        constructor(
            containerHandler: ContainerHandler,
            element: HTMLElement = null
        ) {
            super();

            this.containerHandler = containerHandler;
            this._element = element;
        }

        destroy(): void {
            this.abortCurrentAction();

            super.destroy();
        }

        loadOptions(): ConfigurationInterface {
            var element = this.getElement();

            return (element
                ? Ajaxify.configBuilder.buildFromDom(element)
                : Ajaxify.configBuilder.buildFromData({})
            );
        }

        getId(): string {
            var element = this.getElement();

            if (element && element.id) {
                return element.id;
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
            return this._element;
        }

        setContent(content: JQuery): void {
            $(this.getElement())
                .trigger(DomEvents.BEFORE_CONTENT_UPDATE)
                .empty()
                .append(content.contents())
                .trigger(DomEvents.AFTER_CONTENT_UPDATE)
            ;
        }

        handleAction(action: ActionInterface): void {
            // abort current action
            this.abortCurrentAction();

            // set current action
            this.currentAction = action;

            // listen to action's events
            action.listen('begin', this.onActionStart, 100);
            action.listen('complete', this.onActionComplete, 100);

            // execute action
            action.execute(this);
        }

        private abortCurrentAction(): void {
            if (this.currentAction && !this.currentAction.isComplete()) {
                this.currentAction.abort();
            }
        }

        /**
         * Handle action's start
         */
        onActionStart = (event: ActionEvent): void => {
            // add busy class
            var elem = this.getElement();

            if (elem) {
                $(elem).addClass(CssClasses.COMPONENT_BUSY);
            }
        }

        /**
         * Handle action's completion
         */
        onActionComplete = (event: ActionEvent): void => {
            var elem = this.getElement();
            var elementId = this.getId();

            // remove busy class
            if (elem) {
                $(elem).removeClass(CssClasses.COMPONENT_BUSY);
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
            var event = $.Event(DomEvents.HANDLE_FLASH_MESSAGES, {flashes: flashes});
            $(this.getElement() || document.body).trigger(event);
        }

        getParent(): ContainerInterface {
            var element = this.getElement();

            if (element) {
                try {
                    return this.containerHandler.findInstanceForElement(<HTMLElement> element.parentNode, false);
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
