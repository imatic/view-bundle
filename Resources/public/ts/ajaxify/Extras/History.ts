/// <reference path="../../history/history.d.ts"/>
/// <reference path="../../jquery/jquery.d.ts"/>
/// <reference path="../Ajaxify.d.ts"/>

/**
 * Imatic view ajaxify history module
 *
 * This optional module integrates containers with
 * https://github.com/browserstate/history.js/
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module Imatic.View.Ajaxify.History {

    "use_strict";

    import Ajaxify              = Imatic.View.Ajaxify;
    import RequestInfo          = Imatic.View.Ajaxify.Ajax.RequestInfo;
    import DomEvents            = Imatic.View.Ajaxify.Dom.DomEvents;
    import RequestAction        = Imatic.View.Ajaxify.Action.RequestAction;
    import ActionEvent          = Imatic.View.Ajaxify.Action.ActionEvent;
    import ContainerInterface   = Imatic.View.Ajaxify.Container.ContainerInterface;

    /**
     * History.js instance
     */
    var History = <Historyjs> window['History'];

    /**
     * Function to verify availability of History.js
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
            History.replaceState(
                HistoryHandler.getCurrentData(),
                window.document.title,
                window.location.toString()
            );

            $(document).on(DomEvents.ACTION_COMPLETE, this.onActionComplete);
        }

        /**
         * Handle action completion
         */
        static onActionComplete(event: JQueryEventObject): void {
            var actionEvent = <ActionEvent> event['actionEvent'];
            var container = <ContainerInterface> event['container'];
            var containerId;

            if (
                actionEvent.response
                && actionEvent.response.valid
                && actionEvent.action.hasInitiator()
                && container.getOption('history')
                && (containerId = container.getId())
            ) {
                History.pushState(
                    HistoryHandler.getCurrentData(),
                    actionEvent.response.fullTitle || window.document.title,
                    actionEvent.response.request.url
                );
            }
        }

        /**
         * Handle browser state change
         */
        static onStateChange(): void {
            var state = History.getState();
            var documentHandler = Ajaxify.documentHandler;
            var containerHandler = documentHandler.containerHandler;

            if (state.data && state.data.containerStates) {
                for (var i = 0; i < state.data.containerStates.length; ++i) {
                    var containerState = state.data.containerStates[i];
                    var containerElement = document.getElementById(containerState.id);

                    if (containerElement && containerHandler.hasInstance(containerElement)) {
                        var container = containerHandler.getInstance(containerElement);

                        // get request information
                        var requestInfo;
                        if (containerState.request) {
                            // from state
                            requestInfo = containerState.request;
                        } else {
                            // initial
                            requestInfo = Ajaxify.requestHelper.parseRequestString(
                                container.getOption('initial')
                            );
                        }

                        // trigger action
                        var action = new HistoryStateChangeAction(null, requestInfo);

                        $(containerElement).trigger(
                            $.Event(DomEvents.ACTIONS, {actions: [action]})
                        );
                    }
                }
            }
        }

        /**
         * Get current data
         */
        static getCurrentData(): any {
            var data: HistoryDataInterface = {containerStates: []};
            var containerHandler = Ajaxify.documentHandler.containerHandler;
            var containerElements = containerHandler.findElements();

            // find all containers with enabled history
            for (var i = 0; i < containerElements.length; ++i) {
                var containerElementId = containerHandler.getId(containerElements[i]);
                if (containerElementId && $(containerElements[i]).data('history')) {
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
        doExecute(container: ContainerInterface): JQueryPromise<any> {
            var currentRequest = container.getCurrentRequest();

            // check container's current request
            if (this.getInfo().uid != (currentRequest ? currentRequest.uid : null)) {
                // set request UID to NULL if reverting to initial state
                if (!this.getInfo().uid) {
                    this.listen('complete', (event: ActionEvent): void => {
                        event.container.getCurrentRequest().uid = null;
                    }, -100);
                }

                return super.doExecute(container);
            } else {
                return $.Deferred().resolve().promise();
            }
        }
    }
 
    // initialize on document ready
    $(document).ready(function () {
        if (historyjsIsAvailable()) {
            // initialize
            HistoryHandler.initialize();

            // bind to the "statechange" event
            History.Adapter.bind(window, 'statechange', HistoryHandler.onStateChange);
        }
    });

}
