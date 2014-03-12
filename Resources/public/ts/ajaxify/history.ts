/// <reference path="history.d.ts"/>
/// <reference path="jquery.ts"/>
/// <reference path="event.ts"/>
/// <reference path="ajax.ts"/>
/// <reference path="action.ts"/>
/// <reference path="container.ts"/>

/**
 * Imatic view ajaxify history module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module imatic.view.ajaxify.history {

    "use_strict";

    import Response             = imatic.view.ajaxify.ajax.Response;
    import RequestInfo          = imatic.view.ajaxify.ajax.RequestInfo;
    import jQuery               = imatic.view.ajaxify.jquery.jQuery;
    import DomEvents            = imatic.view.ajaxify.event.DomEvents;
    import RequestAction        = imatic.view.ajaxify.action.RequestAction;
    import ContainerInterface   = imatic.view.ajaxify.container.ContainerInterface;

    declare var window: Window;

    /**
     * History.js instance
     */
    export var History = <Historyjs> window['History'];

    /**
     * History handler
     */
    export class HistoryHandler
    {
        /**
         * Handle container state change
         */
        static containerStateChange(containerId: string, response: Response, currentContentSelector: string): void {
            if (History) {
                History.pushState(
                    {
                        ajaxifyContainerId: containerId,
                        ajaxifyRequestInfo: response.request,
                        ajaxifyContentSelector: currentContentSelector,
                    },
                    response.fullTitle || window.document.title,
                    response.request.url
                );
            }
        }
    }

    /**
     * History state change action
     */
    export class HistoryStateChangeAction extends RequestAction
    {
        requestUid: number;

        /**
         * Create from request info
         */
        static createFromRequestInfo(requestInfo: RequestInfo, contentSelector: string): HistoryStateChangeAction {
            var action = new HistoryStateChangeAction(null, {
                url: requestInfo.url,
                method: requestInfo.method,
                data: requestInfo.data,
                contentSelector: contentSelector,
            });

            action.requestUid = requestInfo.uid;

            return action;
        }

        /**
         * Execute the action
         */
        execute(container: ContainerInterface): void {
            // check container's current request UID
            if (this.requestUid && this.requestUid !== container.getCurrentRequestUid()) {
                // the current UID request is different, proceed
                super.execute(container);
            } else {
                // the current UID request is the same, do nothing
                this.complete = true;
                this.successful = true;
            }
        }
    }

    // initialize on document ready
    if (History) {
        jQuery(window.document).ready(function () {

            // setup initial state
            History.replaceState(
                {},
                window.document.title,
                window.location.toString()
            );

            // bind to the "statechange" event
            History.Adapter.bind(window, 'statechange', function () {
                var target, event, eventArgs = [];
                var state = History.getState();

                // determine type of state
                if (state.data && state.data.ajaxifyContainerId) {
                    console.log('container state change');
                    // container state change
                    target = jQuery('#' + state.data.ajaxifyContainerId);
                    if (target.length > 0) {
                        event = DomEvents.ACTION;
                        eventArgs.push(
                            HistoryStateChangeAction.createFromRequestInfo(
                                state.data.ajaxifyRequestInfo,
                                state.data.ajaxifyContentSelector
                            )
                        );
                    }
                } else {
                    // detect initial state
                    // TODO: detection
                    target = jQuery(window.document.body);
                    event = DomEvents.HISTORY_INITIAL_STATE;
                }

                // trigger event
                if (event) {
                    target.trigger(
                        event,
                        eventArgs
                    );
                }
            });
        });
    }

}
