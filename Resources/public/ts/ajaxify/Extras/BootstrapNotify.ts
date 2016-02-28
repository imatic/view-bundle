import {DomEvents} from '../Dom';

/**
 * Flash types
 */
var flashTypes = {
    success: {delay: 5000, icon: 'glyphicon glyphicon-ok-sign'},
    info: {delay: 5000, icon: 'glyphicon glyphicon-info-sign'},
    warning: {delay: 10000, icon: 'glyphicon glyphicon-warning-sign'},
    danger: {delay: 10000, icon: 'glyphicon glyphicon-exclamation-sign'},
    error: {delay: 10000, icon: 'glyphicon glyphicon-exclamation-sign'},
    default: {delay: 10000, icon: 'glyphicon glyphicon-asterisk'},
};

/**
 * Function to verify availability of bootstrap-notify
 */
export function isBootstrapNotifyAvailable(): boolean {
    return 'undefined' !== typeof $['notify'];
}

/**
 * Render flash messages using bootstrap-notify
 */
export function renderFlashMessages(event: JQueryEventObject) {
    for (var i = 0; i < event['flashes'].length; ++i) {
        var flash = event['flashes'][i];
        var flashType = flashTypes[flash.type] || flashTypes.default;

        // prepare notification options and settings
        var options = {
            message: flash.message,
            delay: flashType.delay,
            icon: flashType.icon,
        };
        var settings = {
            type: flash.type,
            mouse_over: 'pause',
            animate: {
                enter: 'animated fadeInRight',
                exit: 'animated fadeOutRight',
            },
            z_index: 100000,
        };

        // show notification
        $['notify'](options, settings);
    }

    // prevent default implementation from running
    return false;
}

// init on ready
$(window.document).ready(function () {
    if (isBootstrapNotifyAvailable()) {
        // attach to the "RENDER_FLASH_MESSAGES" event
        $(window.document.body).on(DomEvents.RENDER_FLASH_MESSAGES, renderFlashMessages);
    }
});
