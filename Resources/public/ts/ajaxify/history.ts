/// <reference path="../history/history.d.ts"/>
/// <reference path="Jquery.ts"/>
/// <reference path="Ajax.ts"/>
/// <reference path="Action.ts"/>
/// <reference path="Container.ts"/>
/// <reference path="Dom.ts"/>

/**
 * Imatic view ajaxify history module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module Imatic.View.Ajaxify.History {

    "use_strict";

    import ajaxify              = Imatic.View.Ajaxify;
    import jQuery               = Imatic.View.Ajaxify.Jquery.jQuery;
    import RequestInfo          = Imatic.View.Ajaxify.Ajax.RequestInfo;
    import DomEvents            = Imatic.View.Ajaxify.Dom.DomEvents;
    import RequestAction        = Imatic.View.Ajaxify.Action.RequestAction;
    import ActionEvent          = Imatic.View.Ajaxify.Action.ActionEvent;
    import ContainerInterface   = Imatic.View.Ajaxify.Container.ContainerInterface;

    declare var window: Window;

    /**
     * History.js instance
     */
    export var History = <Historyjs> window['History'];

    /**
     * Function to verify History.js availability
     */
    export function historyjsIsAvailable(): boolean {
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
            var documentHandler = ajaxify.documentHandler;
            var containerHandler = documentHandler.containerHandler;

            if (state.data && state.data.containerStates) {
                for (var i = 0; i < state.data.containerStates.length; ++i) {
                    var containerState = state.data.containerStates[i];
                    var containerElement = ajaxify.domDocument.getElementById(containerState.id);

                    if (containerElement && containerHandler.hasInstance(containerElement)) {
                        var container = containerHandler.getInstance(containerElement);

                        // get request information
                        var requestInfo;
                        if (containerState.request) {
                            // from state
                            requestInfo = containerState.request;
                        } else {
                            // initial
                            requestInfo = ajaxify.requestHelper.parseRequestString(
                                container.getOption('initial')
                            );
                        }

                        // trigger action
                        var action = new HistoryStateChangeAction(null, requestInfo);

                        jQuery(containerElement).trigger(
                            jQuery.Event(DomEvents.ACTIONS, {actions: [action]})
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
            var containerHandler = ajaxify.documentHandler.containerHandler;
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
        doExecute(container: ContainerInterface): jQuery.Promise {
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
                return jQuery.Deferred().resolve().promise();
            }
        }
    }
 
    // initialize on document ready
    jQuery(window.document).ready(function () {
        if (historyjsIsAvailable()) {
            // initialize
            HistoryHandler.initialize();

            // bind to the "statechange" event
            History.Adapter.bind(window, 'statechange', HistoryHandler.onStateChange);
        }
    });

}
