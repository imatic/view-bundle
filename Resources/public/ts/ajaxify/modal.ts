/**
 * Imatic view ajaxify modal module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module imatic.view.ajaxify.modal {

    "use_strict";

    /**
     * Modal configuration interface
     * Represents a set of options required for modal dialogs.     
     */
    export interface ModalConfigurationInterface
    {
        modalSize: ModalSize;
        modalClosable: boolean;
        modalActions: string;
        modalTitle: string;
        modalHeader: string;
        modalFooter: string;
    }
    
    export enum ModalSize {
        SMALL,
        NORMAL,
        LARGE
    }
    
    export var ModalConfigurationDefaults = {
        modalSize: ModalSize.NORMAL,
        modalClosable: true,
        modalActions: '',
        modalTitle: '',
        modalHeader: '',
        modalFooter: '',
    };

}
