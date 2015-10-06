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
        $.extend(this.defaults, data);
    }

    /**
     * Build configuration using already existing data set
     */
    buildFromData(data: ConfigurationInterface): ConfigurationInterface {
        var config = $.extend({}, this.defaults, data);

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
            $.extend(data, $(parentElements[i]).data());
        }

        $.extend(data, $(baseElement).data());

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
