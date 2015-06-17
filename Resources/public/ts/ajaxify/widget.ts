/// <reference path="Object.ts"/>
/// <reference path="Action.ts"/>
/// <reference path="Css.ts"/>
/// <reference path="Jquery.ts"/>
/// <reference path="Configuration.ts"/>

/**
 * Imatic view ajaxify widget module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module Imatic.View.Ajaxify.Widget {

    "use_strict";

    import ajaxify                  = Imatic.View.Ajaxify;
    import jQuery                   = Imatic.View.Ajaxify.Jquery.jQuery;
    import Object                   = Imatic.View.Ajaxify.Object.Object;
    import ObjectInterface          = Imatic.View.Ajaxify.Object.ObjectInterface;
    import ConfigurationInterface   = Imatic.View.Ajaxify.Configuration.ConfigurationInterface;
    import ActionInterface          = Imatic.View.Ajaxify.Action.ActionInterface;
    import CssClasses               = Imatic.View.Ajaxify.Css.CssClasses;
    import ActionEvent              = Imatic.View.Ajaxify.Action.ActionEvent;

    /**
     * Widget interface
     * Represents an object that generates actions for it's container.
     */
    export interface WidgetInterface extends ObjectInterface
    {
        /**
         * Create actions
         */
        createActions: () => ActionInterface[];

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
                .addClass(CssClasses.WIDGET)
            ;
        }

        /**
         * Get alive widget instances for given DOM subtree
         */
        findInstances(element: HTMLElement): WidgetInterface[] {
            var self = this;
            var selector = '.' + CssClasses.WIDGET;
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
     *
     * Base class for other element-based widgets.
     */
    export class Widget extends Object implements WidgetInterface
    {
        private pendingActions: ActionInterface[] = [];
        private busyElement: HTMLElement = null;

        constructor(
            public element: HTMLElement
        ) {
            super();
        }

        destroy(): void {
            for (var i = 0; i < this.pendingActions.length; ++i) {
                this.pendingActions[i].abort();
            }

            this.pendingActions = [];
            this.element = null;

            super.destroy();
        }

        loadOptions(): ConfigurationInterface {
            return ajaxify.configBuilder.buildFromDom(this.element);
        }

        createActions(): ActionInterface[] {
            var confirmOption = this.getOption('confirm');

            if (confirmOption) {
                var message = ('string' === typeof confirmOption
                    ? confirmOption
                    : this.getDefaultConfirmMessage()
                );

                if (!confirm(confirmOption)) {
                    return [new Imatic.View.Ajaxify.Action.NoAction(this)];
                }
            }

            var actions = this.doCreateActions();

            for (var i = 0; i < actions.length; ++i) {
                actions[i].listen('begin', (event: ActionEvent): void => {
                    if (0 === this.pendingActions.length) {
                        this.busyElement = jQuery(this.element).is(':visible')
                            ? this.element
                            : jQuery(this.element).parents(':visible')[0] || this.element
                        ;
                        jQuery(this.busyElement).addClass(CssClasses.COMPONENT_BUSY);
                    }

                    this.pendingActions.push(event.action);
                });
                actions[i].listen('complete', (event: ActionEvent): void => {
                    this.pendingActions.splice(
                        this.pendingActions.indexOf(event.action),
                        1
                    );

                    if (0 === this.pendingActions.length) {
                        jQuery(this.busyElement).removeClass(CssClasses.COMPONENT_BUSY);
                        this.busyElement = null;
                    }
                });
            }

            return actions;
        }

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
         * Create action instances
         */
        doCreateActions(): ActionInterface[] {
            return [];
        }
    }

}
