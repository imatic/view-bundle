/// <reference path="../jquery/jquery.d.ts"/>

/**
 * Imatic view ajaxify jquery module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module Imatic.View.Ajaxify.Jquery {

    "use_strict";

    declare var window: Window;

    if ('undefined' === typeof window['jQuery']) {
        throw new Error('jQuery is not available');
    }

    /**
     * jQuery instance
     */
    export var jQuery = <JQueryStatic> window['jQuery'];

}
