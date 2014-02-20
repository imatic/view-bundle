/**
 * Imatic view ajaxify jquery module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module imatic.view.ajaxify.jquery {

    declare var window: Window;

    if (typeof window['jQuery'] === 'undefined') {
        throw new Error('jQuery is not available');
    }

    export var jQuery = window['jQuery'];

}
