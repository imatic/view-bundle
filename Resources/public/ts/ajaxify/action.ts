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
            private jQuery: any,
            private options: {url: string}
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
            var response;
            this.request = new AjaxRequest(this.jQuery);

            this.events.dispatch('begin', new Event({action: this}));

            this.request.execute({
                type: 'GET',
                dataType: 'html',
                url: this.options.url,
                cache: false,
                success: (serverResponse: ServerResponse): void => {
                    this.successful = true;
                    response = serverResponse;
                },
                complete: (): void => {
                    this.complete = true;

                    if (this.successful) {
                        container.setHtml(response.data);
                    }

                    this.events.dispatch('complete', new Event({
                        action: this,
                        response: response,
                    }));
                },
            });
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
