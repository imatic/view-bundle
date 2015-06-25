/**
 * Imatic view ajaxify DOM module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module Imatic.View.Ajaxify.Dom {

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
         *      action: Imatic.View.Ajaxify.Action.ActionInterface;
         * }
         */
        static ACTIONS = 'imatic.ajaxify.actions';

        /**
         * Event triggered by containers after an action has been completed
         *
         * Arguments: {
         *      container: Imatic.View.Ajaxify.Container.ContainerInterface;
         *      actionEvent: Imatic.View.Ajaxify.Action.ActionEvent;
         * }
         */
        static ACTION_COMPLETE = 'imatic.ajaxify.action_complete';

        /**
         * Event triggered before contents of an element are replaced or removed
         *
         * Arguments: {}
         */
        static BEFORE_CONTENT_UPDATE = 'imatic.ajaxify.before_content_update';

        /**
         * Event triggered after contents of an element have been set or replaced
         *
         * Arguments: {}
         */
        static AFTER_CONTENT_UPDATE = 'imatic.ajaxify.after_content_update';

        /**
         * Event triggered when there are flash messages to be handled
         *
         * This is used by the document handler.
         *
         * Arguments: {
         *      flashes: Imatic.View.Ajaxify.Message.FlashMessageInterface[];
         * }
         */
        static HANDLE_FLASH_MESSAGES = 'imatic.ajaxify.handle_flash_messages';

        /**
         * Event triggered when flash messages are to be rendered
         *
         * This should be used by an extenstion that reimplements
         * the way flash messages are rendered.
         *
         * Arguments: {
         *      flashes: Imatic.View.Ajaxify.Message.FlashMessageInterface[];
         *      originElement: HTMLElement;
         * }
         */
        static RENDER_FLASH_MESSAGES = 'imatic.ajaxify.render_flash_messages';
    }
}
