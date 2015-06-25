/// <reference path="Main.ts"/>
/// <reference path="Event.ts"/>
/// <reference path="Dom.ts"/>

/**
 * Imatic view ajaxify bootstrap notify module
 *
 * This optional module integrates container flash messages
 * with https://github.com/goodybag/bootstrap-notify
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module Imatic.View.Ajaxify.BootstrapNotify {

    "use_strict";

    import DomEvents    = Imatic.View.Ajaxify.Dom.DomEvents;

    declare var window: Window;

    /**
     * Defines which flash types do automatically fade out
     * Unknown types do not fade out.
     */
    var fadeOutDelayMap = {
        success: 5000,
        info: 5000,
        warning: 10000,
        danger: 10000,
    };
    var fallbackDelay = 10000;

    /**
     * Function to verify availability of bootstrap-notify
     */
    export function bootstrapNotifyIsAvailable(): boolean {
        return 'undefined' !== typeof $.fn['notify'];
    }

    /**
     * Render flash messages using bootstrap-notify
     */
    export function renderFlashMessages(event: JQueryEventObject) {
        var notificationContainer = document.getElementById('notifications');

        if (notificationContainer) {
            for (var i = 0; i < event['flashes'].length; ++i) {
                var flash = event['flashes'][i];

                // prepare notification options
                var options = {
                    message: {text: flash.message},
                    type: flash.type,
                    fadeOut: {
                        enabled: true,
                        delay: fadeOutDelayMap[flash.type] || fallbackDelay,
                    },
                };

                // show notification
                $(notificationContainer)['notify'](options).show();
            }

            // fix close link behavior
            $('a.close', notificationContainer).click(handleNotificationCloseLinkClick);

            // prevent default implementation from running
            return false;
        }
    }

    /**
     * Handle click on notification's close link
     */
    function handleNotificationCloseLinkClick()
    {
        // prevent the browser from following the dummy "#" url
        return false;
    }

    // init on ready
    $(window.document).ready(function () {
        if (bootstrapNotifyIsAvailable()) {
            // attach to the "RENDER_FLASH_MESSAGES" event
            $(window.document.body).on(
                DomEvents.RENDER_FLASH_MESSAGES,
                renderFlashMessages
            );
        }
    });
}
