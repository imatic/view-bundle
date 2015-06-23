/// <reference path="Jquery.ts"/>

/**
 * Imatic view ajaxify configuration module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module Imatic.View.Ajaxify.Configuration {

    "use_strict";

    import jQuery = Imatic.View.Ajaxify.Jquery.jQuery;

    /**
     * Configuration interface
     */
    export interface ConfigurationInterface
    {
        [key: string]: any;
    }

    /**
     * Configuration processor interface
     */
    export interface ConfigurationProcessorInterface
    {
        /**
         * Procesconfiguration
         */
        process: (data: ConfigurationInterface) => void;
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
         * Add defaulconfiguration
         */
        addDefaults(data: ConfigurationInterface): void {
            jQuery.extend(this.defaults, data);
        }

        /**
         * Build configuration using already existing data set
         */
        buildFromData(data: ConfigurationInterface): ConfigurationInterface {
            var config = jQuery.extend({}, this.defaults, data);

            this.process(config);

            return config;
        }

        /**
         * Build configuration using DOM element data attributes
         *
         * The base element's data has greater priority.
         *
         * The parent elements should be ordered parent first, ancestors later.
         * (Parent's data overrides first ancestor's data and so on.)
         */
        buildFromDom(baseElement: HTMLElement, parentElements: HTMLElement[] = []): ConfigurationInterface {
            var data: ConfigurationInterface = {};

            for (var i = parentElements.length - 1; i >= 0; --i) {
                jQuery.extend(data, jQuery(parentElements[i]).data());
            }

            jQuery.extend(data, jQuery(baseElement).data());

            return this.buildFromData(data);
        }

        /**
         * Process loadeconfiguration
         */
        private process(data: ConfigurationInterface): void {
            for (var i = 0; i < this.processors.length; ++i) {
                this.processors[i].process(data);
            }
        }
    }

}
