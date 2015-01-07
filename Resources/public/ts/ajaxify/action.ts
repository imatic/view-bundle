/// <reference path="object.ts"/>
/// <reference path="container.ts"/>
/// <reference path="widget.ts"/>
/// <reference path="ajax.ts"/>
/// <reference path="event.ts"/>

/**
 * Imatic view ajaxify action module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module imatic.view.ajaxify.action {

    "use_strict";

    import ajaxify                  = imatic.view.ajaxify;
    import jQuery                   = imatic.view.ajaxify.jquery.jQuery;
    import Object                   = imatic.view.ajaxify.object.Object;
    import ObjectInterface          = imatic.view.ajaxify.object.ObjectInterface;
    import ContainerInterface       = imatic.view.ajaxify.container.ContainerInterface;
    import DataType                 = imatic.view.ajaxify.ajax.DataType;
    import Request                  = imatic.view.ajaxify.ajax.Request;
    import RequestInfo              = imatic.view.ajaxify.ajax.RequestInfo;
    import Response                 = imatic.view.ajaxify.ajax.Response;
    import WidgetInterface          = imatic.view.ajaxify.widget.WidgetInterface;
    import EventDispatcherInterface = imatic.view.ajaxify.event.EventDispatcherInterface;
    import EventDispatcher          = imatic.view.ajaxify.event.EventDispatcher;
    import Event                    = imatic.view.ajaxify.event.Event;

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
            var action = null;
            var segment = jQuery.trim(actionSegment);

            if (segment.length > 0) {
                // try to match the @key-word syntax
                var match = segment.match(/^@([A-Za-z0-9_\-]+)$/);

                // find and invoke the handler
                if (match && this.keywordHandlers[match[1]]) {
                    action = this.keywordHandlers[match[1]](initiator);
                }

                // if no action was matched, fall back to request strings
                if (!action) {
                    action = new RequestAction(
                        initiator,
                        ajaxify.requestHelper.parseRequestString(segment)
                    );
                }
            }

            return action;
        }
    }

    /**
     * Action interface
     * Represents an interaction between Widget and its Container.
     */
    export interface ActionInterface extends ObjectInterface
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
         * See if the action is complete
         */
        isComplete: () => boolean;

        /**
         * See if the action was successful
         */
        isSuccessful: () => boolean;

        /**
         * See if the action supports the given container
         */
        supports: (container: ContainerInterface) => boolean;

        /**
         * Execute the action
         */
        execute: (container: ContainerInterface) => jQuery.Promise;

        /**
         * Abort the action
         */
        abort: () => void;
    }

    /**
     * Base action
     */
    export class Action extends Object implements ActionInterface
    {
        private initiator: WidgetInterface = null;
        private complete: boolean = false;
        private successful: boolean = false;

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

        isComplete(): boolean {
            return this.complete;
        }

        isSuccessful(): boolean {
            return this.successful;
        }

        supports(container: ContainerInterface): boolean {
            return true;
        }

        execute(container: ContainerInterface): jQuery.Promise {
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
        doExecute(container: ContainerInterface): jQuery.Promise {
            throw new Error('Not implemented');
        }

        abort(): void {
        }
    }

    /**
     * No action
     */
    export class NoAction extends Action
    {
        doExecute(container: ContainerInterface): jQuery.Promise {
            return jQuery.Deferred().resolve().promise();
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

        doExecute(container: ContainerInterface): jQuery.Promise {
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
            var info = jQuery.extend(true, {},  this.info);

            // use container's content selector if none was given
            if (!info.contentSelector) {
                info.contentSelector = container.getContentSelector();
            }

            // special URLs
            if ('@reload' === info.url || '@current' === info.url) {

                // determine current request
                var currentRequest = container.getCurrentRequest();
                if (!currentRequest) {
                    currentRequest = ajaxify.requestHelper.parseRequestString(
                        container.getOption('initial')
                    );
                }
                var currentRequestInitiator = container.getCurrentRequestInitiator();
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

                    // change the data if the request method
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
        handleResponse(container: ContainerInterface, response: Response): void {
            // handle response
            if (response.valid) {
                var event = <ActionEvent> this.emit(ActionEvent.createApply(this, container, response));

                if (event.proceed) {
                    container.setContent(response.data);
                }
            }

            // flash messages
            if (response.flashes.length > 0) {
                container.handleFlashes(response.flashes);
            } else if (!response.valid && !response.aborted) {
                container.handleFlashes([{
                    type: 'danger',
                    message: 'An error occured'
                }]);
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

        doExecute(container: ContainerInterface): jQuery.Promise {
            this.emit(ActionEvent.createBegin(this, container, null));

            // handle response
            if (this.response.valid) {
                var event = <ActionEvent> this.emit(ActionEvent.createApply(this, container, this.response));

                if (event.proceed) {
                    container.setContent(this.response.data);
                }
            }

            // complete event
            this.emit(ActionEvent.createComplete(this, container, this.response));

            return jQuery.Deferred().resolve().promise();
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
            request: Request
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
            response: Response
        ): ActionEvent {
            var event = new this();

            event.name = 'apply';
            event.action = action;
            event.container = container;
            event.response = response;
            event.proceed = true;

            return event;
        }

        static createComplete(
            action: ActionInterface,
            container: ContainerInterface,
            response: Response
        ): ActionEvent {
            var event = new this();

            event.name = 'complete';
            event.action = action;
            event.container = container;
            event.response = response;

            return event;
        }
    }

}
