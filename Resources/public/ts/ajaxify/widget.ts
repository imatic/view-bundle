/// <reference path="action.ts"/>

/**
 * Imatic view ajaxify widget module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module imatic.view.ajaxify.widget {

    "use_strict";
    
    import ActionInterface = imatic.view.ajaxify.action.ActionInterface;

    /**
     * Widget interface
     * Represents an object that generates actions for it's container     
     */
    export interface WidgetInterface
    {
        /**
         * Get widget's configuration
         */
        getConfiguration: () => any;
        
        /**
         * Create action
         */
        createAction: () => ActionInterface;
    }

}
