/// <reference path="container.ts"/>
/// <reference path="widget.ts"/>
/// <reference path="ajax.ts"/>

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

    /**
     * Action interface
     * Represents an interaction between Widget and its Container
     */
    export interface ActionInterface
    {
        /**
         * See if the action is complete
         */
        isComplete: () => boolean;

        /**
         * See if the action was successful
         */
        isSuccessful: () => boolean;

        /**
         * Set callback to be invoked when the action completes
         */
        setOnComplete: (onComplete: (action: ActionInterface) => void) => void;

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
        private complete = false;
        private successful = false;
        private onComplete: (action: ActionInterface) => void;
        private request: AjaxRequest;

        /**
         * Constructor
         */
        constructor(
            private widget: WidgetInterface,
            private url: string,
            private jQuery: any
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
         * Set callback to be invoked when the action completes
         */
        setOnComplete(onComplete: (action: ActionInterface) => void): void {
            this.onComplete = onComplete;
        }

        /**
         * Execute the action
         */
        execute(container: ContainerInterface): void {
            var self = this;

            this.request = new AjaxRequest(this.jQuery);
            this.request.execute({
                type: 'GET',
                dataType: 'html',
                url: this.url,
                cache: false,
                success: function (response: ServerResponse) {
                    self.successful = true;
                    container.setHtml(response.data);
                },
                complete: function () {
                    self.complete = true;
                    if (self.onComplete) {
                        self.onComplete(self);
                    }
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
