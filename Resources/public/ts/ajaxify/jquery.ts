/// <reference path="jquery.d.ts"/>

/**
 * Imatic view ajaxify jquery module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module imatic.view.ajaxify.jquery {

    declare var window: Window;

    if ('undefined' === typeof window['jQuery']) {
        throw new Error('jQuery is not available');
    }

    export var jQuery = <JQueryStatic> window['jQuery'];

}
