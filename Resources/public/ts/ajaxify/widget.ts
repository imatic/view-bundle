/// <reference path="action.ts"/>
/// <reference path="event.ts"/>
/// <reference path="css.ts"/>
/// <reference path="jquery.ts"/>
/// <reference path="configuration.ts"/>

/**
 * Imatic view ajaxify widget module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module imatic.view.ajaxify.widget {

    "use_strict";

    import ActionInterface      = imatic.view.ajaxify.action.ActionInterface;
    import ConfigurationBuilder = imatic.view.ajaxify.configuration.ConfigurationBuilder;
    import EventInterface       = imatic.view.ajaxify.event.EventInterface;
    import CssClasses           = imatic.view.ajaxify.css.CssClasses;
    import jQuery               = imatic.view.ajaxify.jquery.jQuery;

    /**
     * Widget interface
     * Represents an object that generates actions for it's container.
     */
    export interface WidgetInterface
    {
        /**
         * Destructor
         */
        destroy: () => void;

        /**
         * Get widget's configuration
         */
        getConfiguration: () => {[key: string]: any;};

        /**
         * Create action
         *
         * NULL may be returned
         */
        createAction: () => ActionInterface;

        /**
         * Get widget's element
         */
        getElement: () => HTMLElement;
    }

    /**
     * Widget handler
     */
    export class WidgetHandler
    {
        public instanceDataKey = 'widgetInstance';
        public instanceMarkAttr = 'data-has-widget-instance';

        /**
         * Check for widget instance
         */
        hasInstance(widgetElement: HTMLElement): boolean {
            return jQuery(widgetElement).data(this.instanceDataKey) ? true : false;
        }

        /**
         * Get widget instance
         */
        getInstance(widgetElement: HTMLElement): WidgetInterface {
            var widget = jQuery(widgetElement).data(this.instanceDataKey);
            if (!widget) {
                throw new Error('Widget instance not found'); // TODO: cutom exception?
            }

            return widget;
        }

        /**
         * Set widget instance
         */
        setInstance(widgetElement: HTMLElement, widget: WidgetInterface): void {
            jQuery(widgetElement)
                .data(this.instanceDataKey, widget)
                .attr(this.instanceMarkAttr, 'true')
                .addClass(CssClasses.WIDGET)
            ;
        }

        /**
         * Get alive widget instances for given DOM subtree
         */
        findInstances(element: HTMLElement): WidgetInterface[] {
            var self = this;
            var selector = '[' + this.instanceMarkAttr + ']';
            var widgets: WidgetInterface[] = [];

            if (jQuery(element).is(selector) && this.hasInstance(element)) {
                widgets.push(this.getInstance(element));
            }

            jQuery(selector, element).each(function () {
                widgets.push(self.getInstance(this));
            });

            return widgets;
        }
    }

    /**
     * Widget
     * Base class for other element-based widgets.
     */
    export class Widget implements WidgetInterface
    {
        /**
         * Constructor
         */
        constructor(
            public configBuilder: ConfigurationBuilder,
            public element: HTMLElement,
            public containerElement: HTMLElement
        ) {}

        /**
         * Destructor
         */
        destroy(): void {
        }

        /**
         * Get form's configuration
         */
        getConfiguration(): {[key: string]: any;} {
            return this.configBuilder.build(
                this.element,
                this.containerElement ? [this.containerElement] : []
            );
        }

        /**
         * Create action
         */
        createAction(): ActionInterface {
            var config = this.getConfiguration();

            if (config['confirm']) {
                var message = ('string' === typeof config['confirm']
                    ? config['confirm']
                    : this.getDefaultConfirmMessage()
                );

                if (!confirm(message)) {
                    return null;
                }
            }

            var action = this.doCreateAction(config);

            action.events.addCallback('begin', (event: EventInterface): void => {
                jQuery(this.element).addClass(CssClasses.COMPONENT_BUSY);
            });
            action.events.addCallback('complete', (event: EventInterface): void => {
                jQuery(this.element).removeClass(CssClasses.COMPONENT_BUSY);
            });

            return action;
        }

        /**
         * Get widget's element
         */
        getElement(): HTMLElement {
            return this.element;
        }

        /**
         * Get default confirmation message
         */
        getDefaultConfirmMessage(): string {
            return 'Are you sure you want to perform this action?';
        }

        /**
         * Create action instance
         */
        doCreateAction(config: {[key: string]: any;}): ActionInterface {
            throw new Error('Not implemented');
        }
    }

}
