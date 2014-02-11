/**
 * Imatic view ajaxify configuration module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module imatic.view.ajaxify.configuration {

    "use_strict";

    /**
     * Configuration processor interface
     */
    export interface ConfigurationProcessorInterface
    {
        /**
         * Process configuration
         */
        process: (config: any) => void;
    }

    /**
     * Configuration builder
     */
    export class ConfigurationBuilder
    {
        private defaults = {};
        private processors: ConfigurationProcessorInterface[] = [];

        /**
         * Constructor
         */
        constructor(private document: HTMLDocument, private jQuery: any) {}

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
            this.jQuery.extend(this.defaults, config);
        }

        /**
         * Build configuration for given element
         */
        build(element?: HTMLElement, parentConfig?: any) {
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

            this.process(config);

            return config;
        }

        /**
         * Process loaded configuration
         */
        private process(config): void {
            for (var i = 0; i < this.processors.length; ++i) {
                this.processors[i].process(config);
            }
        }
    }

}
