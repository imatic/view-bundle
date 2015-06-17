/**
 * Imatic view ajaxify DOM module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module imatic.view.ajaxify.dom {

    "use_strict";

    /**
     * DOM events
     */
    export class DomEvents
    {
        /**
         * Event triggered by code to execute actions in a context
         *
         * Arguments: {
         *      action: imatic.view.ajaxify.action.ActionInterface;
         * }
         */
        static ACTIONS = 'imatic.view.ajaxify.event.actions';

        /**
         * Event triggered before contents of an element are replaced or removed
         *
         * Arguments: {}
         */
        static BEFORE_CONTENT_UPDATE = 'imatic.view.ajaxify.event.before_content_update';

        /**
         * Event triggered after contents of an element have been set or replaced
         *
         * Arguments: {}
         */
        static AFTER_CONTENT_UPDATE = 'imatic.view.ajaxify.event.after_content_update';

        /**
         * Event triggered when there are flash messages to be handled
         *
         * This is used by the document handler.
         *
         * Arguments: {
         *      flashes: imatic.view.ajaxify.message.FlashMessageInterface[];
         * }
         */
        static HANDLE_FLASH_MESSAGES = 'imatic.view.ajaxify.event.handle_flash_messages';

        /**
         * Event triggered when flash messages are to be rendered
         *
         * This should be used by an extenstion that reimplements
         * the way flash messages are rendered.
         *
         * Arguments: {
         *      flashes: imatic.view.ajaxify.message.FlashMessageInterface[];
         *      originElement: HTMLElement;
         * }
         */
        static RENDER_FLASH_MESSAGES = 'imatic.view.ajaxify.event.render_flash_messages';
    }

}
