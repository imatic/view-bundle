/// <reference path="event.ts"/>
/// <reference path="jquery.ts"/>

/**
 * Imatic view ajaxify bootstrap notify module
 *
 * This optional module integrates container flash messages
 * with https://github.com/goodybag/bootstrap-notify
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module imatic.view.ajaxify.bootstrapNotify {

    "use_strict";

    import DomEvents = imatic.view.ajaxify.event.DomEvents;
    import jQuery    = imatic.view.ajaxify.jquery.jQuery;

    declare var window: Window;

    /**
     * Defines which flash types do automatically fade out
     * Unknown types do not fade out.
     */
    var fadeOutMap = {
        success: true,
        info: true,
        danger: false,
        warning: false,
    };

    /**
     * Function to verify availability of bootstrap-notify
     */
    export function bootstrapNotifyIsAvailable(): boolean {
        return 'undefined' !== typeof jQuery.fn['notify'];
    }

    /**
     * Handle flash messages using bootstrap-notify
     */
    export function handleFlashMessages(event: JQueryEventObject) {
        var notificationContainer = document.getElementById('notifications');

        if (notificationContainer) {
            for (var i = 0; i < event['flashes'].length; ++i) {
                var flash = event['flashes'][i];

                // prepare notification options
                var options = {
                    message: {text: flash.message},
                    type: flash.type,
                    fadeOut: {enabled: fadeOutMap[flash.type], delay: 5000},
                };

                // show notification
                jQuery(notificationContainer)['notify'](options).show();
            }

            // fix close link behavior
            jQuery('a.close', notificationContainer).click(handleNotificationCloseLinkClick);

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
    jQuery(window.document).ready(function () {
        if (bootstrapNotifyIsAvailable()) {
            // attach to the "HANDLE_FLASH_MESSAGES" event
            jQuery(window.document.body).on(
                DomEvents.HANDLE_FLASH_MESSAGES,
                handleFlashMessages
            );
        }
    });
}
