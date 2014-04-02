/// <reference path="../jquery/jquery.d.ts"/>

/**
 * Imatic view toggle module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module imatic.view.toggle {

    "use_strict";

    declare var window: Window;

    if ('undefined' === typeof window['jQuery']) {
        throw new Error('jQuery is not available');
    }

    /**
     * jQuery instance
     */
    var jQuery = <JQueryStatic> window['jQuery'];

    /**
     * Initialize toggle
     */
    export function init(document: HTMLDocument)
    {
        jQuery(document).on('click', onClick);
    }

    /**
     * Handle onclick event
     */
    function onClick(event: JQueryEventObject): void {
        var element = <HTMLElement> event.target;

        var toggle = jQuery(element).data('toggle');
        
        if (toggle) {
            var target = jQuery(toggle);

            if (target.length > 0) {
                if (target.is(':animated')) {
                    target.stop(true, true);
                }

                target.slideToggle();
                event.preventDefault();
            }
        }
    }

}

declare var document: HTMLDocument;

imatic.view.toggle.init(document);
