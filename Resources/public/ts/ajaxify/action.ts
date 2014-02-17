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
    import AjaxRequest              = imatic.view.ajaxify.ajax.AjaxRequest;
    import ServerResponse           = imatic.view.ajaxify.ajax.ServerResponse;
    import WidgetInterface          = imatic.view.ajaxify.widget.WidgetInterface;
    import EventDispatcherInterface = imatic.view.ajaxify.event.EventDispatcherInterface;
    import EventDispatcher          = imatic.view.ajaxify.event.EventDispatcher;
    import Event                    = imatic.view.ajaxify.event.Event;

    /**
     * Action interface
     * Represents an interaction between Widget and its Container
     */
    export interface ActionInterface
    {
        events: EventDispatcherInterface;

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
     * Load HTML action
     */
    export class LoadHtmlAction implements ActionInterface
    {
        public events = new EventDispatcher();

        private complete = false;
        private successful = false;
        private request: AjaxRequest;

        /**
         * Constructor
         */
        constructor(
            private initiator: WidgetInterface,
            private jQuery: any,
            private options: {
                url: string;
                method: string;
                data: {[name: string]: any};
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
            this.request = new AjaxRequest(this.jQuery);

            this.events.dispatch('begin', new Event({action: this}));

            this.request.execute(
                this.options.url,
                this.options.method,
                this.options.data,
                (response: ServerResponse): void => {
                    this.complete = true;
                    this.successful = response.successful;

                    // handle response
                    if (response.valid) {
                        var event = this.events.dispatch('apply', new Event({
                            proceed: true,
                            response: response,
                            initiator: this.initiator,
                        }));

                        if (event['proceed']) {
                            container.setHtml(
                                response.data,
                                this.options.contentSelector
                            );
                        }
                    }

                    // complete event
                    this.events.dispatch('complete', new Event({
                        action: this,
                        response: response,
                        initiator: this.initiator,
                    }));
                }
            );
        }

        /**
         * Abort the action
         */
        abort(): void {
            if (!this.complete) {
                this.request.xhr.abort();
            }
        }
    }

}
