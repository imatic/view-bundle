/// <reference path="action.ts"/>
/// <reference path="css.ts"/>
/// <reference path="jquery.ts"/>

/**
 * Imatic view ajaxify widget module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module imatic.view.ajaxify.widget {

    "use_strict";

    import ActionInterface  = imatic.view.ajaxify.action.ActionInterface;
    import CssClasses       = imatic.view.ajaxify.css.CssClasses;
    import jQuery           = imatic.view.ajaxify.jquery.jQuery;

    /**
     * Widget interface
     * Represents an object that generates actions for it's container
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
        getConfiguration: () => any;

        /**
         * Create action
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
                .attr(this.instanceMarkAttr, true)
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

}
