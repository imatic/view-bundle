import * as Ajaxify from './Ajaxify';
import {ContainerInterface} from './Container';
import {WidgetInterface} from './Widget';
import {AjaxifyObject, AjaxifyObjectInterface} from './AjaxifyObject';
import {DataType, Request, RequestInfo, Response} from './Ajax';
import {EventDispatcherInterface, EventDispatcher, Event} from './Event';

/**
 * Action helper
 *
 * Provides helper methods related to actions.
 */
export class ActionHelper
{
    private keywordHandlers: {[keyword: string]: (initiator: WidgetInterface) => ActionInterface} = {};

    /**
     * Register a keyword handler
     */
    addKeywordHandler(keyword: string, callback: (initiator: WidgetInterface) => ActionInterface): void {
        this.keywordHandlers[keyword] = callback;
    }

    /**
     * Parse action string (segments separated by "|")
     */
    parseActionString(actionString: string, initiator?: WidgetInterface): ActionInterface[] {
        var actions: ActionInterface[] = [];
        var segments = actionString.split(/\s*\|\s*/);

        for (var i = 0; i < segments.length; ++i) {
            var action = this.parseActionSegment(segments[i], initiator);

            if (action) {
                actions.push(action);
            }
        }

        return actions;
    }

    /**
     * Parse single action segment
     */
    parseActionSegment(actionSegment: string, initiator?: WidgetInterface): ActionInterface {
        var action: ActionInterface = null;
        var segment = $.trim(actionSegment);

        if (segment.length > 0) {
            // match and remove the target first
            var targetMatch = segment.match(/\s+with\s+(.+)$/i);
            if (targetMatch) {
                segment = segment.substring(0, segment.length - targetMatch[0].length);
            }

            // try to match the @key-word syntax
            var keywordMatch = segment.match(/^@([\w\-]+)$/);

            // find and invoke the handler
            if (keywordMatch && this.keywordHandlers[keywordMatch[1]]) {
                action = this.keywordHandlers[keywordMatch[1]](initiator);
            }

            // if no kewyword was matched, fall back to request strings
            if (!action) {
                action = new RequestAction(
                    initiator,
                    Ajaxify.requestHelper.parseRequestString(segment)
                );
            }

            // set the target
            if (targetMatch) {
                action.setTarget(targetMatch[1]);
            }
        }

        return action;
    }
}

/**
 * Action interface
 * Represents an interaction between Widget and its Container.
 */
export interface ActionInterface extends AjaxifyObjectInterface
{
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
export class Action extends AjaxifyObject implements ActionInterface
{
    private initiator: WidgetInterface = null;
    private target: string = null;
    private complete: boolean = false;
    private successful: boolean = false;

    static createKeywordHandler(): (initiator: WidgetInterface) => ActionInterface {
        return (initiator: WidgetInterface): ActionInterface => {
            return new this(initiator);
        };
    }

    constructor(initiator: WidgetInterface) {
        super();

        if (initiator) {
            this.setInitiator(initiator);
        }
    }

    hasInitiator(): boolean {
        return this.initiator ? true : false;
    }

    getInitiator(): WidgetInterface {
        return this.initiator;
    }

    setInitiator(initiator: WidgetInterface): void {
        this.initiator = initiator;
    }

    hasTarget(): boolean {
        return null != this.target;
    }

    getTarget(): string {
        return this.target;
    }

    setTarget(target: string): void {
        this.target = target;
    }

    isComplete(): boolean {
        return this.complete;
    }

    isSuccessful(): boolean {
        return this.successful;
    }

    supports(container: ContainerInterface): boolean {
        return null !== container;
    }

    execute(container: ContainerInterface): JQueryPromise<any> {
        this.complete = false;
        this.successful = false;

        return this
            .doExecute(container)
            .done((): void => { this.successful = true; })
            .always((): void => { this.complete = true; })
        ;
    }

    /**
     * Execute the action
     */
    doExecute(container: ContainerInterface): JQueryPromise<any> {
        throw new Error('Not implemented');
    }

    abort(): void {
    }
}

/**
 * No action
 *
 * Does nothing.
 */
export class NoAction extends Action
{
    doExecute(container: ContainerInterface): JQueryPromise<any> {
        return $.Deferred().resolve().promise();
    }
}

/**
 * Clear action
 *
 * Sets empty content.
 */
export class ClearAction extends Action
{
    doExecute(container: ContainerInterface): JQueryPromise<any> {
        this.emit(ActionEvent.createBegin(this, container));

        var event = <ActionEvent> this.emit(ActionEvent.createApply(this, container));

        if (event.proceed) {
            container.setContent($());
        }

        this.emit(ActionEvent.createComplete(this, container));

        return $.Deferred().resolve().promise();
    }
}

/**
 * Reload page action
 *
 * Reloads the entire page.
 */
export class ReloadPageAction extends Action
{
    doExecute(container: ContainerInterface): JQueryPromise<any> {
        document.location.reload();

        return $.Deferred().resolve().promise();
    }

    supports(container: ContainerInterface): boolean {
        return true;
    }
}

/**
 * Request action
 *
 * Loads remote HTML contents.
 */
export class RequestAction extends Action
{
    private request: Request = null;

    constructor(
        initiator: WidgetInterface,
        private info: RequestInfo
    ) {
        super(initiator);
    }

    /**
     * Get request info
     */
    getInfo(): RequestInfo {
        return this.info;
    }

    doExecute(container: ContainerInterface): JQueryPromise<any> {
        var info = this.prepareRequest(container);

        this.request = new Request(
            info,
            DataType.HTML
        );

        this.emit(ActionEvent.createBegin(this, container, this.request));

        return this
            .request
            .execute()
            .always((response: Response): void => {
                this.handleResponse(container, response);
            })
        ;
    }

    abort(): void {
        if (!this.isComplete()) {
            this.request.getXhr().abort();
        }
    }

    /**
     * Prepare the request
     */
    prepareRequest(container: ContainerInterface): RequestInfo {
        var info = $.extend(true, {}, this.info);

        // use container's content selector if none was given
        if (!info.contentSelector) {
            info.contentSelector = container.getContentSelector();
        }

        // special URLs
        if (
            '@reload' === info.url
            || '@current' === info.url
            || '@reset' === info.url
        ) {
            // determine current request
            var currentRequest = null;
            var currentRequestInitiator = null;

            if ('@reset' !== info.url) {
                currentRequest = container.getCurrentGetRequest();
                currentRequestInitiator = container.getCurrentGetRequestInitiator();
            }
            if (!currentRequest) {
                currentRequest = container.getInitialRequest();
                currentRequestInitiator = null;
            }

            // replace this action's initiator
            if (currentRequestInitiator) {
                this.setInitiator(currentRequestInitiator);
            }

            // modify request
            if ('@reload' === info.url) {
                // reload using complete current request info
                info = currentRequest;
            } else {
                // change the URL
                info.url = currentRequest.url;

                // change the data too if the request method
                // is GET and the request has no data of its own
                if (
                    'GET' === info.method
                    && 'GET' === currentRequest.method
                    && !info.hasData()
                ) {
                    info.data = currentRequest.data;
                }
            }
        }

        return info;
    }

    /**
     * Handle response
     */
    private handleResponse(container: ContainerInterface, response: Response): void {
        // handle response
        var event = <ActionEvent> this.emit(ActionEvent.createApply(this, container, response));

        if (event.proceed) {
            container.setContent(response.data);
        }

        // flash messages
        if (response.flashes.length > 0) {
            container.handleFlashes(response.flashes);
        } else if (!response.valid && !response.aborted) {
            container.handleError('Internal server error', response);
        }

        // complete event
        this.emit(ActionEvent.createComplete(this, container, response));
    }
}

/**
 * Response action
 *
 * Uses already existing HTML response.
 */
export class ResponseAction extends Action
{
    constructor(
        initiator: WidgetInterface,
        private response: Response
    ) {
        super(initiator);
    }

    doExecute(container: ContainerInterface): JQueryPromise<any> {
        this.emit(ActionEvent.createBegin(this, container));

        // handle response
        var event = <ActionEvent> this.emit(ActionEvent.createApply(this, container, this.response));

        if (event.proceed) {
            container.setContent(this.response.data);
        }

        // complete event
        this.emit(ActionEvent.createComplete(this, container, this.response));

        return $.Deferred().resolve().promise();
    }
}

/**
 * Action event
 */
export class ActionEvent extends Event
{
    action: ActionInterface;
    container: ContainerInterface;
    request: Request;
    response: Response;
    proceed: boolean;

    static createBegin(
        action: ActionInterface,
        container: ContainerInterface,
        request: Request = null
    ): ActionEvent {
        var event = new this();

        event.name = 'begin';
        event.action = action;
        event.container = container;
        event.request = request;

        return event;
    }

    static createApply(
        action: ActionInterface,
        container: ContainerInterface,
        response: Response = null
    ): ActionEvent {
        var event = new this();

        event.name = 'apply';
        event.action = action;
        event.container = container;
        event.response = response;
        event.proceed = response.valid;

        return event;
    }

    static createComplete(
        action: ActionInterface,
        container: ContainerInterface,
        response: Response = null
    ): ActionEvent {
        var event = new this();

        event.name = 'complete';
        event.action = action;
        event.container = container;
        event.response = response;

        return event;
    }
}
