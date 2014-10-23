/// <reference path="jquery.ts"/>

/**
 * Imatic view ajaxify configuration module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module imatic.view.ajaxify.configuration {

    "use_strict";

    import jQuery = imatic.view.ajaxify.jquery.jQuery;

    /**
     * Configuration processor interface
     */
    export interface ConfigurationProcessorInterface
    {
        /**
         * Process configuration
         */
        process: (config: {[key: string]: any;}) => void;
    }

    /**
     * Configuration builder
     */
    export class ConfigurationBuilder
    {
        private defaults = {};
        private processors: ConfigurationProcessorInterface[] = [];

        /**
         * Add configuration processor
         */
        addProcessor(processor: ConfigurationProcessorInterface): void {
            this.processors.push(processor);
        }

        /**
         * Add default configuration
         */
        addDefaults(config: any): void {
            jQuery.extend(this.defaults, config);
        }

        /**
         * Build configuration for given elements
         */
        build(element?: HTMLElement, parentElements: HTMLElement[] = []): {[key: string]: any;} {
            // default
            var config = jQuery.extend({}, this.defaults);

            // parents
            if (parentElements.length > 0) {
                for (var i = parentElements.length - 1; i >= 0; --i) {
                    jQuery.extend(config, jQuery(parentElements[i]).data());
                }
                
            }

            // local
            if (element) {
                jQuery.extend(config, jQuery(element).data());
            }

            this.process(config);

            return config;
        }

        /**
         * Process loaded configuration
         */
        private process(config: {[key: string]: any;}): void {
            for (var i = 0; i < this.processors.length; ++i) {
                this.processors[i].process(config);
            }
        }
    }

}
