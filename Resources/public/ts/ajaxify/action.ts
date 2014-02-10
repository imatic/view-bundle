/// <reference path="container.ts"/>

/**
 * Imatic view ajaxify action module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module imatic.view.ajaxify.action {

    "use_strict";
    
    import ContainerInterface   = imatic.view.ajaxify.container.ContainerInterface;
    
    /**
     * Action interface
     * Represents an interaction between Widget and its Container    
     */
    export interface ActionInterface
    {
        complete: boolean;
        successful: boolean;
        onComplete: (action: ActionInterface) => void;

        /**
         * Execute the action
         */
        execute: (container: ContainerInterface) => void;
        
        /**
         * Abort the action
         */
        abort: () => void;
    }
    
}
