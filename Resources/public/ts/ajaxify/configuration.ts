/// <reference path="modal.ts"/>

/**
 * Imatic view ajaxify configuration module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module imatic.view.ajaxify.configuration {

    "use_strict";
    
    import ModalSize                    = imatic.view.ajaxify.modal.ModalSize;
    import ModalConfigurationDefaults   = imatic.view.ajaxify.modal.ModalConfigurationDefaults;
    
    /**
     * Configuration builder
     */         
    export class ConfigurationBuilder
    {
        private defaults = {};

        /**
         * Constructor
         */                 
        constructor(private document: HTMLDocument, private jQuery: any) {
            // set defaults
            jQuery.extend(
                this.defaults,
                ModalConfigurationDefaults
            ); 
        }

        /**
         * Build configuration for given element
         */
        build(element?: HTMLElement, parentConfig?) {
            // default
            var config = this.jQuery.extend({}, this.defaults);

            // parent
            if (parentConfig) {
                this.jQuery.extend(config, parentConfig);
            }

            // local
            if (element) {
                this.jQuery.extend(config, this.jQuery(element).data());
            }

            return this.process(config);
        }

        /**
         * Process loaded configuration
         */
        private process(config) {
            if (typeof config.modalSize === 'string') {
                config.modalSize = ModalSize[config.modalSize.toUpper()];
            }

            return config;
        }
    }

}
