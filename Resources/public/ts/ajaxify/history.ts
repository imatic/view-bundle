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

    import Ajaxify              = imatic.view.ajaxify;
    import RequestHelper        = imatic.view.ajaxify.ajax.RequestHelper;
    import RequestInfo          = imatic.view.ajaxify.ajax.RequestInfo;
    import jQuery               = imatic.view.ajaxify.jquery.jQuery;
    import DomEvents            = imatic.view.ajaxify.event.DomEvents;
    import EventInterface       = imatic.view.ajaxify.event.EventInterface;
    import RequestAction        = imatic.view.ajaxify.action.RequestAction;
    import ContainerInterface   = imatic.view.ajaxify.container.ContainerInterface;

    declare var window: Window;

    /**
     * History.js instance
     */
    export var History = <Historyjs> window['History'];

    /**
     * Function to verify History.js availability
     */
    function historyjsIsAvailable(): boolean {
        return History && 'undefined' !== typeof History.Adapter;
    }

    /**
     * Container state interface
     */
    interface ContainerStateInterface
    {
        id: string;
        request: RequestInfo;
    }

    /**
     * History data interface
     */
    interface HistoryDataInterface
    {
        containerStates: ContainerStateInterface[];
    }

    /**
     * History handler
     */
    export class HistoryHandler
    {
        /**
         * Initialize the handler
         */
        static initialize(): void {
            if (historyjsIsAvailable()) {
                History.replaceState(
                    HistoryHandler.getCurrentData(),
                    window.document.title,
                    window.location.toString()
                );
            }
        }

        /**
         * Handle browser state change
         */
        static onStateChange(): void {
            var state = History.getState();
            var documentHandler = Ajaxify.getDocumentHandler();
            var containerHandler = documentHandler.containerHandler;

            if (state.data && state.data.containerStates) {
                for (var i = 0; i < state.data.containerStates.length; ++i) {
                    var containerState = state.data.containerStates[i];
                    var containerElement = documentHandler.document.getElementById(containerState.id);

                    if (containerElement && containerHandler.hasInstance(containerElement)) {
                        var container = containerHandler.getInstance(containerElement);

                        // get request information
                        var requestInfo;
                        if (containerState.request) {
                            // from state
                            requestInfo = containerState.request;
                        } else {
                            // initial
                            requestInfo = RequestHelper.parseRequestString(
                                container.getConfiguration()['historyInitial']
                            );
                        }

                        // trigger action
                        var action = HistoryStateChangeAction.createFromRequestInfo(requestInfo);
                        jQuery(containerElement).trigger(
                            DomEvents.ACTION,
                            [action]
                        );
                    }
                }
            }
        }

        /**
         * Record container state change
         */
        static containerStateChange(containerId: string, title: string, requestInfo: RequestInfo): void {
            if (historyjsIsAvailable()) {
                History.pushState(
                    HistoryHandler.getCurrentData(),
                    title || window.document.title,
                    requestInfo.url
                );
            }
        }

        /**
         * Get current data
         */
        static getCurrentData(): any {
            var data: HistoryDataInterface = {containerStates: []};
            var containerHandler = Ajaxify.getDocumentHandler().containerHandler;
            var containerElements = containerHandler.findElements();

            // find all containers with enabled history
            for (var i = 0; i < containerElements.length; ++i) {
                var containerElementId = containerHandler.getId(containerElements[i]);
                if (containerElementId && jQuery(containerElements[i]).data('history')) {
                    // store current state
                    var currentContainerRequest;
                    if (containerHandler.hasInstance(containerElements[i])) {
                        currentContainerRequest = containerHandler.getInstance(containerElements[i]).getCurrentRequest();
                    } else {
                        currentContainerRequest = null;
                    }

                    data.containerStates.push({
                        id: containerElementId,
                        request: currentContainerRequest,
                    });
                }
            }

            return data;
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
        static createFromRequestInfo(requestInfo: RequestInfo): HistoryStateChangeAction {
            var action = new HistoryStateChangeAction(null, requestInfo);

            action.requestUid = requestInfo.uid;

            return action;
        }

        /**
         * Execute the action
         */
        execute(container: ContainerInterface): void {
            // check container's current request
            var currentRequest = container.getCurrentRequest();
            if (this.requestUid != (currentRequest ? currentRequest.uid : null)) {

                // set request UID to NULL if reverting to initial state
                if (!this.requestUid) {
                    this.events.addCallback('complete', (event: EventInterface): void => {
                        event['container'].getCurrentRequest().uid = null;
                    }, -100);
                }

                super.execute(container);
            } else {
                this.complete = true;
                this.successful = true;
            }
        }
    }

    // initialize on document ready
    if (historyjsIsAvailable()) {
        jQuery(window.document).ready(function () {
            // initialize
            HistoryHandler.initialize();

            // bind to the "statechange" event
            History.Adapter.bind(window, 'statechange', HistoryHandler.onStateChange);
        });
    }

}
