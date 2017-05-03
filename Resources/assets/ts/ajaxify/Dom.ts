/**
 * DOM events
 */
export class DomEvents
{
    /**
     * Event triggered by code to execute actions in a context
     *
     * Arguments: {
     *      actions: ActionInterface[];
     * }
     */
    static ACTIONS = 'actions.ajaxify.imatic';

    /**
     * Event triggered by containers when action has just started executing
     *
     * Arguments: {
     *      container: ContainerInterface;
     *      actionEvent: ActionEvent;
     * }
     */
    static ACTION_START = 'action_start.ajaxify.imatic';

    /**
     * Event triggered by containers after an action has been completed
     *
     * Arguments: {
     *      container: ContainerInterface;
     *      actionEvent: ActionEvent;
     * }
     */
    static ACTION_COMPLETE = 'action_complete.ajaxify.imatic';

    /**
     * Event triggered before contents of an element are replaced or removed
     *
     * Arguments: {}
     */
    static BEFORE_CONTENT_UPDATE = 'before_content_update.ajaxify.imatic';

    /**
     * Event triggered after contents of an element have been set or replaced
     *
     * Arguments: {}
     */
    static AFTER_CONTENT_UPDATE = 'after_content_update.ajaxify.imatic';

    /**
     * Event triggered when there are flash messages to be handled
     *
     * This is used by the document handler.
     *
     * Arguments: {
     *      flashes: FlashMessageInterface[];
     * }
     */
    static HANDLE_FLASH_MESSAGES = 'handle_flash_messages.ajaxify.imatic';

    /**
     * Event triggered when flash messages are to be rendered
     *
     * This should be used by an extenstion that reimplements
     * the way flash messages are rendered.
     *
     * Arguments: {
     *      flashes: FlashMessageInterface[];
     *      originElement: HTMLElement;
     * }
     */
    static RENDER_FLASH_MESSAGES = 'render_flash_messages.ajaxify.imatic';

    /**
     * Even triggered when an error has occured
     *
     * Arguments: {
     *      message: string;
     *      response?: Response;
     * }
     */
    static HANDLE_ERROR = 'handle_error.ajaxify.imatic';
}
