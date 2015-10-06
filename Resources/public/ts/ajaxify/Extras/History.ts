/// <reference path="../../history/history.d.ts" />

import * as Ajaxify from '../Ajaxify';
import {RequestInfo} from '../Ajax';
import {DomEvents} from '../Dom';
import {RequestAction, ActionEvent} from '../Action';
import {ContainerInterface} from '../Container';

/**
 * Function to verify availability of History.js
 */
function isHistoryjsAvailable(): boolean {
    return window['History'] && 'undefined' !== typeof window['History']['Adapter'];
}

/**
 * Get instance of History.js
 */
function getHistoryjs(): Historyjs {
    return <Historyjs> window['History'];
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
     * Attach the handler
     */
    attach(): void {
        var historyjs = getHistoryjs();

        // initial state
        historyjs.replaceState(
            this.getCurrentData(),
            window.document.title,
            window.location.toString()
        );

        // listen to history state changes
        historyjs.Adapter.bind(
            window,
            'statechange',
            () => { this.onStateChange(); }
        );

        // listen to ajaxify action events
        $(document).on(
            DomEvents.ACTION_COMPLETE,
            (event: JQueryEventObject) => { this.onActionComplete(event); }
        );
    }

    /**
     * Handle ajaxify action completion
     */
    onActionComplete(event: JQueryEventObject): void {
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
            getHistoryjs().pushState(
                this.getCurrentData(),
                actionEvent.response.fullTitle || window.document.title,
                actionEvent.response.request.url
            );
        }
    }

    /**
     * Handle history state change
     */
    onStateChange(): void {
        var state = getHistoryjs().getState();
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
    private getCurrentData(): any {
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
    if (isHistoryjsAvailable()) {
        var handler = new HistoryHandler();
        handler.attach();
    }
});
