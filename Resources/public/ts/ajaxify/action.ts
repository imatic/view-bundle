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

    import ContainerInterface       = imatic.view.ajaxify.container.ContainerInterface;
    import DataType                 = imatic.view.ajaxify.ajax.DataType;
    import Request                  = imatic.view.ajaxify.ajax.Request;
    import Response                 = imatic.view.ajaxify.ajax.Response;
    import WidgetInterface          = imatic.view.ajaxify.widget.WidgetInterface;
    import EventDispatcherInterface = imatic.view.ajaxify.event.EventDispatcherInterface;
    import EventDispatcher          = imatic.view.ajaxify.event.EventDispatcher;
    import Event                    = imatic.view.ajaxify.event.Event;

    /**
     * Action interface
     * Represents an interaction between Widget and its Container.
     */
    export interface ActionInterface
    {
        events: EventDispatcherInterface;
        initiator: WidgetInterface;

        /**
         * See if the action is complete
         */
        isComplete: () => boolean;

        /**
         * See if the action was successful
         */
        isSuccessful: () => boolean;

        /**
         * Execute the action
         */
        execute: (container: ContainerInterface) => void;

        /**
         * Abort the action
         */
        abort: () => void;
    }

    /**
     * No action
     */
    export class NoAction implements ActionInterface
    {
        events = new EventDispatcher();
        private successful = false;
        private complete = false;

        /**
         * Constructor
         */
        constructor(
            public initiator: WidgetInterface
        ) {}

        /**
         * See if the action is complete
         */
        isComplete(): boolean {
            return this.complete;
        }

        /**
         * See if the action was successful
         */
        isSuccessful(): boolean {
            return this.successful;
        }

        /**
         * Execute the action
         */
        execute(container: ContainerInterface): void {
            this.successful = true;
            this.complete = true;
        }

        /**
         * Abort the action
         */
        abort(): void {
        }
    }

    /**
     * Request action
     *
     * Loads remote HTML contents.
     */
    export class RequestAction implements ActionInterface
    {
        events = new EventDispatcher();
        complete = false;
        successful = false;
        request: Request;

        /**
         * Constructor
         */
        constructor(
            public initiator: WidgetInterface,
            public options: {
                url: string;
                method: string;
                data: any;
                contentSelector: string;
            }
        ) {}

        /**
         * See if the action is complete
         */
        isComplete(): boolean {
            return this.complete;
        }

        /**
         * See if the action was successful
         */
        isSuccessful(): boolean {
            return this.successful;
        }

        /**
         * Execute the action
         */
        execute(container: ContainerInterface): void {
            this.request = new Request(
                this.options.url,
                this.options.method,
                this.options.data,
                DataType.HTML,
                this.options.contentSelector || container.getContentSelector()
            );

            this.events.dispatch('begin', new Event({
                action: this,
                container: container,
                request: this.request,
            }));

            this.request.execute((response: Response): void => {
                this.complete = true;
                this.successful = response.successful;

                // handle response
                if (response.valid) {
                    var event = this.events.dispatch('apply', new Event({
                        action: this,
                        container: container,
                        response: response,
                        proceed: true,
                    }));

                    if (event['proceed']) {
                        container.setContent(response.data);
                    }
                }

                // complete event
                this.events.dispatch('complete', new Event({
                    action: this,
                    container: container,
                    response: response,
                }));
            });
        }

        /**
         * Abort the action
         */
        abort(): void {
            if (!this.complete) {
                this.request.getXhr().abort();
            }
        }
    }

    /**
     * Response action
     *
     * Uses already existing HTML response.
     */
    export class ResponseAction implements ActionInterface
    {
        public events = new EventDispatcher();

        /**
         * Constructor
         */
        constructor(
            public initiator: WidgetInterface,
            private response: Response,
            private contentSelector?: string
        ) {
            if (DataType.HTML !== response.dataType) {
                throw new Error('Expected response with data type "HTML"');
            }
        }

        /**
         * See if the action is complete
         */
        isComplete(): boolean {
            return true;
        }

        /**
         * See if the action was successful
         */
        isSuccessful(): boolean {
            return this.response.valid && this.response.successful;
        }

        /**
         * Execute the action
         */
        execute(container: ContainerInterface): void {
            this.events.dispatch('begin', new Event({
                action: this,
                container: container,
                request: null,
            }));

            // handle response
            if (this.response.valid) {
                var event = this.events.dispatch('apply', new Event({
                    action: this,
                    container: container,
                    response: this.response,
                    proceed: true,
                }));

                if (event['proceed']) {
                    container.setContent(this.response.data);
                }
            }

            // complete event
            this.events.dispatch('complete', new Event({
                action: this,
                container: container,
                response: this.response,
            }));
        }

        /**
         * Abort the action
         */
        abort(): void {
        }
    }

}
