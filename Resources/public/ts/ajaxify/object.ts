/// <reference path="configuration.ts"/>
/// <reference path="event.ts"/>

/**
 * Imatic view ajaxify object module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module imatic.view.ajaxify.object {

    "use_strict";

    import ConfigurationInterface       = imatic.view.ajaxify.configuration.ConfigurationInterface;
    import EventDispatcher              = imatic.view.ajaxify.event.EventDispatcher;
    import EventDispatcherInterface     = imatic.view.ajaxify.event.EventDispatcherInterface;
    import EventInterface               = imatic.view.ajaxify.event.EventInterface;
    import ListenerCallbackInterface    = imatic.view.ajaxify.event.ListenerCallbackInterface;

    /**
     * Base object interface
     */
    export interface ObjectInterface
    {
        /**
         * Run the object's cleanup code
         *
         * The object is not safe to use after it has been destroyed.
         */
        destroy: () => void;

        /**
         * See if an option is defined
         */
        hasOption: (name: string) => boolean;

        /**
         * Get value of an option
         */
        getOption: (name: string) => any;

        /**
         * Get all options
         */
        getOptions: () => ConfigurationInterface;

        /**
         * Attach a callback for the given event
         */
        listen: (eventName: string, callback: ListenerCallbackInterface, priority?: number) => void;

        /**
         * Emit an event
         */
        emit: (event: EventInterface) => EventInterface;
    }

    /**
     * Base object with event and configuration support
     */
    export class Object implements ObjectInterface
    {
        private options: ConfigurationInterface = null;
        private eventDispatcher: EventDispatcherInterface = null;

        destroy(): void {
        }

        hasOption(name: string): boolean {
            if (null === this.options) {
                this.initOptions();
            }

            return this.options.hasOwnProperty(name);
        }

        getOption(name: string): any {
            if (null === this.options) {
                this.initOptions();
            }

            return this.options[name];
        }

        getOptions(): ConfigurationInterface {
            if (null === this.options) {
                this.initOptions();
            }

            return this.options;
        }

        loadOptions(): ConfigurationInterface {
            return {};
        }

        /**
         * Option lazy-loading
         */
        private initOptions(): void {
            this.options = this.loadOptions();
        }

        listen(eventName: string, callback: ListenerCallbackInterface, priority: number = 0): void {
            if (null === this.eventDispatcher) {
                this.initEventDispatcher();
            }

            this.eventDispatcher.addCallback(eventName, callback, priority);
        }

        emit(event: EventInterface): EventInterface {
            if (null === this.eventDispatcher) {
                this.initEventDispatcher();
            }

            return this.eventDispatcher.emit(event);
        }

        getEventDispatcher(): EventDispatcherInterface {
            if (null === this.eventDispatcher) {
                this.initEventDispatcher();
            }

            return this.eventDispatcher;
        }

        /**
         * Initialize the event dispatcher
         */
        private initEventDispatcher(): void {
            this.eventDispatcher = new EventDispatcher();
        }
    }

}
