/// <reference path="../jquery/jquery.d.ts" />
/**
 * Imatic view ajaxify configuration module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
declare module Imatic.View.Ajaxify.Configuration {
    /**
     * Configuration interface
     */
    interface ConfigurationInterface {
        [key: string]: any;
    }
    /**
     * Configuration processor interface
     */
    interface ConfigurationProcessorInterface {
        /**
         * Procesconfiguration
         */
        process: (data: ConfigurationInterface) => void;
    }
    /**
     * Configuration builder
     */
    class ConfigurationBuilder {
        private defaults;
        private processors;
        /**
         * Add configuration processor
         */
        addProcessor(processor: ConfigurationProcessorInterface): void;
        /**
         * Add defaulconfiguration
         */
        addDefaults(data: ConfigurationInterface): void;
        /**
         * Build configuration using already existing data set
         */
        buildFromData(data: ConfigurationInterface): ConfigurationInterface;
        /**
         * Build configuration using DOM element data attributes
         *
         * The base element's data has greater priority.
         *
         * The parent elements should be ordered parent first, ancestors later.
         * (Parent's data overrides first ancestor's data and so on.)
         */
        buildFromDom(baseElement: HTMLElement, parentElements?: HTMLElement[]): ConfigurationInterface;
        /**
         * Process loadeconfiguration
         */
        private process(data);
    }
}
/**
 * Imatic view ajaxify event module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
declare module Imatic.View.Ajaxify.Event {
    /**
     * Event dispatcher interface
     */
    interface EventDispatcherInterface {
        /**
         * Add a callback
         */
        addCallback: (eventName: string, callback: ListenerCallbackInterface, priority?: number) => void;
        /**
         * Remove a callback
         */
        removeCallback: (eventName: string, callback: ListenerCallbackInterface) => void;
        /**
         * Add a listener
         */
        addListener: (eventName: string, listener: ListenerInterface) => void;
        /**
         * Remove a listener
         */
        removeListener: (eventName: string, listener: ListenerInterface) => void;
        /**
         * Emit an event
         */
        emit: (event: EventInterface) => EventInterface;
        /**
         * Dispatch an event
         */
        dispatch: (eventName: string, event?: EventInterface) => EventInterface;
    }
    /**
     * Event interface
     */
    interface EventInterface {
        name: string;
        /**
         * Stop event propagation
         */
        stopPropagation: () => void;
        /**
         * See if event propagation is stopped
         */
        isPropagationStopped: () => boolean;
    }
    /**
     * Listener callback interface
     */
    interface ListenerCallbackInterface {
        (event: EventInterface): void;
    }
    /**
     * Listener interface
     */
    interface ListenerInterface {
        callback: ListenerCallbackInterface;
        priority: number;
    }
    /**
     * Event
     */
    class Event implements EventInterface {
        name: string;
        private propagationStopped;
        stopPropagation(): void;
        isPropagationStopped(): boolean;
    }
    /**
     * Event dispatcher
     */
    class EventDispatcher implements EventDispatcherInterface {
        private listeners;
        addCallback(eventName: string, callback: ListenerCallbackInterface, priority?: number): void;
        removeCallback(eventName: string, callback: ListenerCallbackInterface): void;
        addListener(eventName: string, listener: ListenerInterface): void;
        removeListener(eventName: string, listener: ListenerInterface): void;
        emit(event: EventInterface): EventInterface;
        dispatch(eventName: string, event?: EventInterface): EventInterface;
    }
}
/**
 * Imatic view ajaxify object module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
declare module Imatic.View.Ajaxify.Object {
    import ConfigurationInterface = Imatic.View.Ajaxify.Configuration.ConfigurationInterface;
    import EventDispatcherInterface = Imatic.View.Ajaxify.Event.EventDispatcherInterface;
    import EventInterface = Imatic.View.Ajaxify.Event.EventInterface;
    import ListenerCallbackInterface = Imatic.View.Ajaxify.Event.ListenerCallbackInterface;
    /**
     * Base object interface
     */
    interface ObjectInterface {
        /**
         * Run the object's cleanup code
         *
         * The object is not safe to use after it has been destroyed.
         */
        destroy: () => void;
        /**
         * See if an option is defined
         */
        hasOption: (name: string) => boolean;
        /**
         * Get value of an option
         */
        getOption: (name: string) => any;
        /**
         * Get all options
         */
        getOptions: () => ConfigurationInterface;
        /**
         * Attach a callback for the given event
         */
        listen: (eventName: string, callback: ListenerCallbackInterface, priority?: number) => void;
        /**
         * Emit an event
         */
        emit: (event: EventInterface) => EventInterface;
    }
    /**
     * Base object with event and configuration support
     */
    class Object implements ObjectInterface {
        private options;
        private eventDispatcher;
        destroy(): void;
        hasOption(name: string): boolean;
        getOption(name: string): any;
        getOptions(): ConfigurationInterface;
        loadOptions(): ConfigurationInterface;
        /**
         * Option lazy-loading
         */
        private initOptions();
        listen(eventName: string, callback: ListenerCallbackInterface, priority?: number): void;
        emit(event: EventInterface): EventInterface;
        getEventDispatcher(): EventDispatcherInterface;
        /**
         * Initialize the event dispatcher
         */
        private initEventDispatcher();
    }
}
/**
 * Imatic view ajaxify exception module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
declare module Imatic.View.Ajaxify.Exception {
    /**
     * Exception
     */
    class Exception implements Error {
        message: string;
        name: string;
        constructor(message: string);
        /**
         * Get string representation of the exception
         */
        toString(): string;
    }
}
/**
 * Imatic view ajaxify css module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
declare module Imatic.View.Ajaxify.Css {
    /**
     * Standardised classes
     */
    class CssClasses {
        static COMPONENT_BUSY: string;
        static CONTAINER: string;
        static WIDGET: string;
    }
}
/**
 * Imatic view ajaxify widget module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
declare module Imatic.View.Ajaxify.Widget {
    import Object = Imatic.View.Ajaxify.Object.Object;
    import ObjectInterface = Imatic.View.Ajaxify.Object.ObjectInterface;
    import ConfigurationInterface = Imatic.View.Ajaxify.Configuration.ConfigurationInterface;
    import ActionInterface = Imatic.View.Ajaxify.Action.ActionInterface;
    /**
     * Widget interface
     * Represents an object that generates actions for it's container.
     */
    interface WidgetInterface extends ObjectInterface {
        /**
         * Create actions
         */
        createActions: () => ActionInterface[];
        /**
         * Get widget's element
         */
        getElement: () => HTMLElement;
    }
    /**
     * Widget handler
     */
    class WidgetHandler {
        instanceDataKey: string;
        /**
         * Check for widget instance
         */
        hasInstance(widgetElement: HTMLElement): boolean;
        /**
         * Get widget instance
         */
        getInstance(widgetElement: HTMLElement): WidgetInterface;
        /**
         * Set widget instance
         */
        setInstance(widgetElement: HTMLElement, widget: WidgetInterface): void;
        /**
         * Get alive widget instances for given DOM subtree
         */
        findInstances(element: HTMLElement): WidgetInterface[];
    }
    /**
     * Widget
     *
     * Base class for other element-based widgets.
     */
    class Widget extends Object implements WidgetInterface {
        element: HTMLElement;
        private pendingActions;
        private busyElement;
        constructor(element: HTMLElement);
        destroy(): void;
        loadOptions(): ConfigurationInterface;
        createActions(): ActionInterface[];
        getElement(): HTMLElement;
        /**
         * Get default confirmation message
         */
        getDefaultConfirmMessage(): string;
        /**
         * Create action instances
         */
        doCreateActions(): ActionInterface[];
    }
}
/**
 * Imatic view ajaxify message module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
declare module Imatic.View.Ajaxify.Message {
    /**
     * Flash message interface
     */
    interface FlashMessageInterface {
        type: string;
        message: string;
    }
}
/**
 * Imatic view ajaxify html module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
declare module Imatic.View.Ajaxify.Html {
    /**
     * HTML fragment
     */
    class HtmlFragment {
        private dom;
        constructor(html: string);
        /**
         * Get the root element
         */
        root(): JQuery;
        /**
         * Get all elements
         */
        all(): JQuery;
        /**
         * See if the DOM contains element(s) matching given selector
         */
        contains(selector: string): boolean;
        /**
         * Get set of elements matching given selector
         */
        find(selector: string): JQuery;
    }
}
/**
 * Imatic view ajaxify ajax module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
declare module Imatic.View.Ajaxify.Ajax {
    import FlashMessageInterface = Imatic.View.Ajaxify.Message.FlashMessageInterface;
    /**
     * Data types
     */
    enum DataType {
        TEXT = 0,
        HTML = 1,
        JSON = 2,
    }
    /**
     * Request info
     *
     * Holds information about a request.
     */
    class RequestInfo {
        url: string;
        method: string;
        data: any;
        contentSelector: string;
        headers: {
            [key: string]: any;
        };
        uid: number;
        constructor(url?: string, method?: string, data?: any, contentSelector?: string, headers?: {
            [key: string]: any;
        });
        /**
         * Append a key-value pair to the data
         */
        appendData(key: string, value: any): void;
        /**
         * See if any data has been set
         */
        hasData(): boolean;
    }
    /**
     * Request helper
     *
     * Provides helper methods related to requests.
     */
    class RequestHelper {
        /**
         * Parse request string
         */
        parseRequestString(requestString: string): RequestInfo;
        /**
         * Append a key-value pair to the given data
         */
        appendData(data: any, key: string, value: any): any;
    }
    /**
     * Request
     *
     * Represents an request. Converts successful response into a Response instance.
     */
    class Request {
        private info;
        private dataType;
        static uidSequence: number;
        private xhr;
        constructor(info: RequestInfo, dataType?: DataType);
        /**
         * Get request info
         */
        getInfo(): RequestInfo;
        /**
         * Set request info
         */
        setInfo(info: RequestInfo): void;
        /**
         * Get data type
         */
        getDataType(): DataType;
        /**
         * Set data type
         */
        setDataType(dataType: DataType): void;
        /**
         * Get XHR instance
         *
         * Can only be obtained after the request has been executed.
         */
        getXhr(): XMLHttpRequest;
        /**
         * Perform the request
         */
        execute(): JQueryPromise<any>;
    }
    /**
     * Response
     *
     * Holds results of a request.
     */
    class Response {
        title: string;
        fullTitle: string;
        flashes: FlashMessageInterface[];
        data: any;
        dataType: DataType;
        successful: boolean;
        valid: boolean;
        aborted: boolean;
        request: RequestInfo;
    }
}
/**
 * Imatic view ajaxify action module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
declare module Imatic.View.Ajaxify.Action {
    import Object = Imatic.View.Ajaxify.Object.Object;
    import ObjectInterface = Imatic.View.Ajaxify.Object.ObjectInterface;
    import ContainerInterface = Imatic.View.Ajaxify.Container.ContainerInterface;
    import Request = Imatic.View.Ajaxify.Ajax.Request;
    import RequestInfo = Imatic.View.Ajaxify.Ajax.RequestInfo;
    import Response = Imatic.View.Ajaxify.Ajax.Response;
    import WidgetInterface = Imatic.View.Ajaxify.Widget.WidgetInterface;
    import Event = Imatic.View.Ajaxify.Event.Event;
    /**
     * Action helper
     *
     * Provides helper methods related to actions.
     */
    class ActionHelper {
        private keywordHandlers;
        /**
         * Register a keyword handler
         */
        addKeywordHandler(keyword: string, callback: (initiator: WidgetInterface) => ActionInterface): void;
        /**
         * Parse action string (segments separated by "|")
         */
        parseActionString(actionString: string, initiator?: WidgetInterface): ActionInterface[];
        /**
         * Parse single action segment
         */
        parseActionSegment(actionSegment: string, initiator?: WidgetInterface): ActionInterface;
    }
    /**
     * Action interface
     * Represents an interaction between Widget and its Container.
     */
    interface ActionInterface extends ObjectInterface {
        /**
         * See if the action has an initiator
         */
        hasInitiator: () => boolean;
        /**
         * Get action's initiator
         */
        getInitiator: () => WidgetInterface;
        /**
         * Set action's initiator
         */
        setInitiator: (initiator: WidgetInterface) => void;
        /**
         * See if the action has a custom target selector
         */
        hasTarget: () => boolean;
        /**
         * Get custom target selector
         */
        getTarget: () => string;
        /**
         * Set custom target selector
         */
        setTarget: (target: string) => void;
        /**
         * See if the action is complete
         */
        isComplete: () => boolean;
        /**
         * See if the action was successful
         */
        isSuccessful: () => boolean;
        /**
         * See if the action supports the given container
         *
         * The container can be NULL.
         */
        supports: (container: ContainerInterface) => boolean;
        /**
         * Execute the action
         */
        execute: (container: ContainerInterface) => JQueryPromise<any>;
        /**
         * Abort the action
         */
        abort: () => void;
    }
    /**
     * Base action
     */
    class Action extends Object implements ActionInterface {
        private initiator;
        private target;
        private complete;
        private successful;
        static keywordHandler(initiator: WidgetInterface): ActionInterface;
        constructor(initiator: WidgetInterface);
        hasInitiator(): boolean;
        getInitiator(): WidgetInterface;
        setInitiator(initiator: WidgetInterface): void;
        hasTarget(): boolean;
        getTarget(): string;
        setTarget(target: string): void;
        isComplete(): boolean;
        isSuccessful(): boolean;
        supports(container: ContainerInterface): boolean;
        execute(container: ContainerInterface): JQueryPromise<any>;
        /**
         * Execute the action
         */
        doExecute(container: ContainerInterface): JQueryPromise<any>;
        abort(): void;
    }
    /**
     * No action
     *
     * Does nothing.
     */
    class NoAction extends Action {
        doExecute(container: ContainerInterface): JQueryPromise<any>;
    }
    /**
     * Clear action
     *
     * Sets empty content.
     */
    class ClearAction extends Action {
        doExecute(container: ContainerInterface): JQueryPromise<any>;
    }
    /**
     * Reload page action
     *
     * Reloads the entire page.
     */
    class ReloadPageAction extends Action {
        doExecute(container: ContainerInterface): JQueryPromise<any>;
    }
    /**
     * Request action
     *
     * Loads remote HTML contents.
     */
    class RequestAction extends Action {
        private info;
        private request;
        constructor(initiator: WidgetInterface, info: RequestInfo);
        /**
         * Get request info
         */
        getInfo(): RequestInfo;
        doExecute(container: ContainerInterface): JQueryPromise<any>;
        abort(): void;
        /**
         * Prepare the request
         */
        prepareRequest(container: ContainerInterface): RequestInfo;
        /**
         * Handle response
         */
        handleResponse(container: ContainerInterface, response: Response): void;
    }
    /**
     * Response action
     *
     * Uses already existing HTML response.
     */
    class ResponseAction extends Action {
        private response;
        constructor(initiator: WidgetInterface, response: Response);
        doExecute(container: ContainerInterface): JQueryPromise<any>;
    }
    /**
     * Action event
     */
    class ActionEvent extends Event {
        action: ActionInterface;
        container: ContainerInterface;
        request: Request;
        response: Response;
        proceed: boolean;
        static createBegin(action: ActionInterface, container: ContainerInterface, request?: Request): ActionEvent;
        static createApply(action: ActionInterface, container: ContainerInterface, response?: Response): ActionEvent;
        static createComplete(action: ActionInterface, container: ContainerInterface, response?: Response): ActionEvent;
    }
}
/**
 * Imatic view ajaxify DOM module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
declare module Imatic.View.Ajaxify.Dom {
    /**
     * DOM events
     */
    class DomEvents {
        /**
         * Event triggered by code to execute actions in a context
         *
         * Arguments: {
         *      action: Imatic.View.Ajaxify.Action.ActionInterface;
         * }
         */
        static ACTIONS: string;
        /**
         * Event triggered by containers after an action has been completed
         *
         * Arguments: {
         *      container: Imatic.View.Ajaxify.Container.ContainerInterface;
         *      actionEvent: Imatic.View.Ajaxify.Action.ActionEvent;
         * }
         */
        static ACTION_COMPLETE: string;
        /**
         * Event triggered before contents of an element are replaced or removed
         *
         * Arguments: {}
         */
        static BEFORE_CONTENT_UPDATE: string;
        /**
         * Event triggered after contents of an element have been set or replaced
         *
         * Arguments: {}
         */
        static AFTER_CONTENT_UPDATE: string;
        /**
         * Event triggered when there are flash messages to be handled
         *
         * This is used by the document handler.
         *
         * Arguments: {
         *      flashes: Imatic.View.Ajaxify.Message.FlashMessageInterface[];
         * }
         */
        static HANDLE_FLASH_MESSAGES: string;
        /**
         * Event triggered when flash messages are to be rendered
         *
         * This should be used by an extenstion that reimplements
         * the way flash messages are rendered.
         *
         * Arguments: {
         *      flashes: Imatic.View.Ajaxify.Message.FlashMessageInterface[];
         *      originElement: HTMLElement;
         * }
         */
        static RENDER_FLASH_MESSAGES: string;
    }
}
/**
 * Imatic view ajaxify container module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
declare module Imatic.View.Ajaxify.Container {
    import Object = Imatic.View.Ajaxify.Object.Object;
    import ObjectInterface = Imatic.View.Ajaxify.Object.ObjectInterface;
    import ConfigurationInterface = Imatic.View.Ajaxify.Configuration.ConfigurationInterface;
    import Exception = Imatic.View.Ajaxify.Exception.Exception;
    import ActionInterface = Imatic.View.Ajaxify.Action.ActionInterface;
    import ActionEvent = Imatic.View.Ajaxify.Action.ActionEvent;
    import FlashMessageInterface = Imatic.View.Ajaxify.Message.FlashMessageInterface;
    import RequestInfo = Imatic.View.Ajaxify.Ajax.RequestInfo;
    import WidgetInterface = Imatic.View.Ajaxify.Widget.WidgetInterface;
    /**
     * Container not found exception
     */
    class ContainerNotFoundException extends Exception {
        name: string;
    }
    /**
     * Container interface
     */
    interface ContainerInterface extends ObjectInterface {
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
    interface TargetHandlerInterface {
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
    class ContainerHandler {
        private selector;
        private instanceDataKey;
        private containerFactory;
        private targetHandlers;
        /**
         * Add target handler
         */
        addTargetHandler(targetHandler: TargetHandlerInterface): void;
        /**
         * Validate given element
         */
        isValidElement(element: HTMLElement): boolean;
        /**
         * Get ID from a container element
         */
        getId(containerElement: HTMLElement): string;
        /**
         * Check for container instance
         */
        hasInstance(containerElement: HTMLElement): boolean;
        /**
         * Get container instance from the given element
         */
        getInstance(containerElement: HTMLElement, autoCreate?: boolean): ContainerInterface;
        /**
         * Set container instance on the given element
         */
        setInstance(containerElement: HTMLElement, container: ContainerInterface): void;
        /**
         * Find container instance for the given target
         */
        findInstanceForTarget(target: string, context?: HTMLElement): ContainerInterface;
        /**
         * Find container instance for the given element
         */
        findInstanceForElement(element: HTMLElement, considerTarget?: boolean): ContainerInterface;
        /**
         * Get container element from given element's context
         */
        getElementFromContext(element: HTMLElement, parentsOnly?: boolean): HTMLElement;
        /**
         * Get container element using given selector
         */
        getElementFromSelector(selector: string): HTMLElement;
        /**
         * Get alive container instances for given DOM subtree
         *
         * If no element is given, the whole document is searched.
         */
        findInstances(element?: HTMLElement): ContainerInterface[];
        /**
         * Get container elements for given DOM subtree
         *
         * If no element is given, the whole document is searched.
         */
        findElements(element?: HTMLElement): HTMLElement[];
    }
    /**
     * Container factory
     */
    class ContainerFactory {
        private containerHandler;
        constructor(containerHandler: ContainerHandler);
        /**
         * Create container instance
         */
        create(element: HTMLElement): ContainerInterface;
    }
    /**
     * Container
     */
    class Container extends Object implements ContainerInterface {
        containerHandler: ContainerHandler;
        private _element;
        private currentAction;
        private currentRequest;
        private currentRequestInitiator;
        constructor(containerHandler: ContainerHandler, element?: HTMLElement);
        destroy(): void;
        loadOptions(): ConfigurationInterface;
        getId(): string;
        getContentSelector(): string;
        getCurrentRequest(): RequestInfo;
        getCurrentRequestInitiator(): WidgetInterface;
        getElement(): HTMLElement;
        setContent(content: JQuery): void;
        handleAction(action: ActionInterface): void;
        private abortCurrentAction();
        /**
         * Handle action's start
         */
        onActionStart: (event: ActionEvent) => void;
        /**
         * Handle action's completion
         */
        onActionComplete: (event: ActionEvent) => void;
        handleFlashes(flashes: FlashMessageInterface[]): void;
        getParent(): ContainerInterface;
    }
}
/**
 * Imatic view ajaxify link module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
declare module Imatic.View.Ajaxify.Link {
    import Widget = Imatic.View.Ajaxify.Widget.Widget;
    import WidgetHandler = Imatic.View.Ajaxify.Widget.WidgetHandler;
    import ActionInterface = Imatic.View.Ajaxify.Action.ActionInterface;
    /**
     * Link handler
     */
    class LinkHandler {
        private widgetHandler;
        private linkFactory;
        private linkTagNames;
        constructor(widgetHandler: WidgetHandler);
        /**
         * Validate given element
         */
        isValidElement(element: HTMLElement): boolean;
        /**
         * Validate given event
         */
        isValidEvent(event: JQueryEventObject): boolean;
        /**
         * Get link instance for given element
         */
        getInstance(element: HTMLElement): Link;
    }
    /**
     * Link
     */
    class Link extends Widget {
        url: string;
        doCreateActions(): ActionInterface[];
    }
}
/**
 * Imatic view ajaxify form module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
declare module Imatic.View.Ajaxify.Form {
    import Widget = Imatic.View.Ajaxify.Widget.Widget;
    import WidgetHandler = Imatic.View.Ajaxify.Widget.WidgetHandler;
    import ActionInterface = Imatic.View.Ajaxify.Action.ActionInterface;
    /**
     * Form handler
     */
    class FormHandler {
        private widgetHandler;
        submitMarkAttr: string;
        submitElementSelector: string;
        private formFactory;
        constructor(widgetHandler: WidgetHandler);
        /**
         * Validate given element
         */
        isValidElement(element: HTMLElement): boolean;
        /**
         * Validate given submit element
         */
        isValidSubmitElement(element: HTMLElement): boolean;
        /**
         * Mark submit element
         */
        markSubmitElement(element: HTMLElement): void;
        /**
         * Get form instance for given element
         */
        getInstance(element: HTMLElement): Form;
    }
    /**
     * Form
     */
    class Form extends Widget {
        submitMarkAttr: string;
        doCreateActions(): ActionInterface[];
        getDefaultConfirmMessage(): string;
        /**
         * Get current form data
         *
         * Returns FALSE if the data cannot be serialized for AJAX.
         */
        getFormData(): any;
        /**
         * Determine used submit button
         */
        getUsedSubmitButton(form: HTMLFormElement): HTMLButtonElement;
    }
}
/**
 * Imatic view ajaxify modal module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
declare module Imatic.View.Ajaxify.Modal {
    /**
     * Modal size
     */
    enum ModalSize {
        SMALL = 0,
        NORMAL = 1,
        LARGE = 2,
        MAX = 3,
    }
    /**
     * Modal stack handler
     */
    class ModalStackHandler {
        constructor();
        /**
         * Get the topmost modal dialog element
         */
        getTopmostModal(): HTMLElement;
        /**
         * Handle onModalShow event
         */
        private onModalShow;
        private onModalHide;
        /**
         * Handle keydown event
         */
        private onKeydown;
        /**
         * Update existing modals
         */
        private updateModals();
    }
    /**
     * Modal
     */
    class Modal {
        static uidCounter: number;
        private element;
        private uid;
        private closable;
        constructor();
        /**
         * Show the modal
         */
        show(): void;
        /**
         * Hide the modal
         */
        hide(): void;
        /**
         * Destroy the modal
         */
        destroy(): void;
        /**
         * See if the modal has an existing DOM element
         */
        hasElement(): boolean;
        /**
         * Get modal's element
         */
        getElement(): HTMLElement;
        /**
         * Set modal's size
         */
        setSize(size: ModalSize): void;
        /**
         * Set modal's closable state
         */
        setClosable(closable: boolean): void;
        /**
         * Get modal's header element
         */
        getHeaderElement(): HTMLElement;
        /**
         * Get modal's title element
         */
        getTitleElement(): HTMLElement;
        /**
         * Set modal's title
         */
        setTitle(title: string): void;
        /**
         * Get modal's body element
         */
        getBodyElement(): HTMLElement;
        /**
         * Set modal's body content
         */
        setBody(content: any): void;
        /**
         * Get modal's footer element
         */
        getFooterElement(): HTMLElement;
        /**
         * Set modal's footer content
         */
        setFooter(content: any): void;
        /**
         * Create the modal
         */
        private create();
    }
}
/**
 * Imatic view ajaxify modal container module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
declare module Imatic.View.Ajaxify.ModalContainer {
    import ConfigurationProcessorInterface = Imatic.View.Ajaxify.Configuration.ConfigurationProcessorInterface;
    import ConfigurationInterface = Imatic.View.Ajaxify.Configuration.ConfigurationInterface;
    import ContainerInterface = Imatic.View.Ajaxify.Container.ContainerInterface;
    import Container = Imatic.View.Ajaxify.Container.Container;
    import ContainerHandler = Imatic.View.Ajaxify.Container.ContainerHandler;
    import TargetHandlerInterface = Imatic.View.Ajaxify.Container.TargetHandlerInterface;
    import ActionInterface = Imatic.View.Ajaxify.Action.ActionInterface;
    import Action = Imatic.View.Ajaxify.Action.Action;
    import WidgetHandler = Imatic.View.Ajaxify.Widget.WidgetHandler;
    import WidgetInterface = Imatic.View.Ajaxify.Widget.WidgetInterface;
    import Modal = Imatic.View.Ajaxify.Modal.Modal;
    /**
     * Modal configuration defaults
     *
     * If you need to change the defaults at runtime, use:
     * imatic.Ajaxify.configBuilder.addDefaults({someKey: 'someValue'})
     */
    var ModalConfigurationDefaults: ConfigurationInterface;
    /**
     * Modal configuration processor
     */
    class ModalConfigurationProcessor implements ConfigurationProcessorInterface {
        process(data: ConfigurationInterface): void;
    }
    /**
     * Modal container handler
     * Creates and manages modal container instances
     */
    class ModalContainerHandler implements TargetHandlerInterface {
        private containerHandler;
        private widgetHandler;
        private containerFactory;
        constructor(containerHandler: ContainerHandler, widgetHandler: WidgetHandler);
        supports(target: string, element?: HTMLElement): boolean;
        findContainer(target: string, element?: HTMLElement): ContainerInterface;
    }
    /**
     * Modal container
     */
    class ModalContainer extends Container {
        originalTrigger: WidgetInterface;
        private modal;
        private actionInitiator;
        private responseTitle;
        private resendResponse;
        getModal(): Modal;
        loadOptions(): ConfigurationInterface;
        destroy(): void;
        /**
         * Execute on close action
         */
        private executeOnClose(originalTrigger, onClose);
        handleAction(action: ActionInterface): void;
        getElement(): HTMLElement;
        setContent(content: JQuery): void;
        getParent(): ContainerInterface;
    }
    /**
     * Close modal action
     */
    class CloseModalAction extends Action {
        static keywordHandler: (initiator: WidgetInterface) => ActionInterface;
        supports(container: ContainerInterface): boolean;
        doExecute(container: ContainerInterface): JQueryPromise<any>;
    }
}
/**
 * Imatic view ajaxify void container module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
declare module Imatic.View.Ajaxify.VoidContainer {
    import ContainerInterface = Imatic.View.Ajaxify.Container.ContainerInterface;
    import Container = Imatic.View.Ajaxify.Container.Container;
    import ContainerHandler = Imatic.View.Ajaxify.Container.ContainerHandler;
    import TargetHandlerInterface = Imatic.View.Ajaxify.Container.TargetHandlerInterface;
    /**
     * Void container handler
     * Creates and manages void container instances
     */
    class VoidContainerHandler implements TargetHandlerInterface {
        private containerHandler;
        constructor(containerHandler: ContainerHandler);
        supports(target: string, element?: HTMLElement): boolean;
        findContainer(target: string, element?: HTMLElement): ContainerInterface;
    }
    /**
     * Void container
     */
    class VoidContainer extends Container {
        setContent(content: any): void;
    }
}
/**
 * Imatic view ajaxify document module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
declare module Imatic.View.Ajaxify.Document {
    import ContainerHandler = Imatic.View.Ajaxify.Container.ContainerHandler;
    import WidgetHandler = Imatic.View.Ajaxify.Widget.WidgetHandler;
    import LinkHandler = Imatic.View.Ajaxify.Link.LinkHandler;
    import FormHandler = Imatic.View.Ajaxify.Form.FormHandler;
    import FlashMessageInterface = Imatic.View.Ajaxify.Message.FlashMessageInterface;
    /**
     * HTML document handler
     *
     * Provides the functionality by listening to certain DOM events.
     */
    class HTMLDocumentHandler {
        containerHandler: ContainerHandler;
        widgetHandler: WidgetHandler;
        linkHandler: LinkHandler;
        formHandler: FormHandler;
        constructor();
        /**
         * Attach the handler
         */
        attach(): void;
        /**
         * Validate given element
         */
        isValidElement(element: HTMLElement): boolean;
        /**
         * Handle onclick event
         */
        private onClick;
        /**
         * Handle onsubmit event
         */
        private onSubmit;
        /**
         * Handle action event
         */
        private onActions;
        /**
         * Handle beforeContentUpdate event
         */
        private onBeforeContentUpdate;
        /**
         * Handle onHandleFlashMessages event
         */
        private onHandleFlashMessages;
        /**
         * Show flash messages
         */
        showFlashMessages(flashes: FlashMessageInterface[], originElement: HTMLElement): void;
        /**
         * Attempt to execute a list of actions
         */
        private dispatchActions(actions, contextualContainer?);
        /**
         * Attempt to execute a single action using the given container
         */
        private dispatchAction(action, container?);
    }
}
/**
 * Imatic view ajaxify module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
declare module Imatic.View.Ajaxify {
    import HTMLDocumentHandler = Imatic.View.Ajaxify.Document.HTMLDocumentHandler;
    import ConfigurationBuilder = Imatic.View.Ajaxify.Configuration.ConfigurationBuilder;
    import RequestHelper = Imatic.View.Ajaxify.Ajax.RequestHelper;
    import ActionHelper = Imatic.View.Ajaxify.Action.ActionHelper;
    var documentHandler: HTMLDocumentHandler;
    var configBuilder: ConfigurationBuilder;
    var actionHelper: ActionHelper;
    var requestHelper: RequestHelper;
}
