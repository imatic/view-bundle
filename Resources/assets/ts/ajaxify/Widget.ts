import * as Ajaxify from './Ajaxify';
import {CssClasses} from './Css';
import {ConfigurationInterface} from './Configuration';
import {AjaxifyObject, AjaxifyObjectInterface} from './AjaxifyObject';
import {ActionInterface, NoAction, ActionEvent} from './Action';

/**
 * Widget interface
 * Represents an object that generates actions for it's container.
 */
export interface WidgetInterface extends AjaxifyObjectInterface
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
        return $(widgetElement).data(this.instanceDataKey) ? true : false;
    }

    /**
     * Get widget instance
     */
    getInstance(widgetElement: HTMLElement): WidgetInterface {
        var widget = $(widgetElement).data(this.instanceDataKey);
        if (!widget) {
            throw new Error('Widget instance not found'); // TODO: cutom exception?
        }

        return widget;
    }

    /**
     * Set widget instance
     */
    setInstance(widgetElement: HTMLElement, widget: WidgetInterface): void {
        $(widgetElement)
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

        if ($(element).is(selector) && this.hasInstance(element)) {
            widgets.push(this.getInstance(element));
        }

        $(selector, element).each(function () {
            if (self.hasInstance(this)) {
                widgets.push(self.getInstance(this));
            }
        });

        return widgets;
    }
}

/**
 * Widget
 *
 * Base class for other element-based widgets.
 */
export class Widget extends AjaxifyObject implements WidgetInterface
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
        return Ajaxify.configBuilder.buildFromDom(this.element);
    }

    createActions(): ActionInterface[] {
        var confirmOption = this.getOption('confirm');

        if (confirmOption) {
            var message = ('string' === typeof confirmOption
                ? confirmOption
                : this.getDefaultConfirmMessage()
            );

            if (!confirm(confirmOption)) {
                return [new NoAction(this)];
            }
        }

        var actions = this.doCreateActions();

        for (var i = 0; i < actions.length; ++i) {
            actions[i].listen('begin', (event: ActionEvent): void => {
                if (0 === this.pendingActions.length) {
                    this.busyElement = $(this.element).is(':visible')
                        ? this.element
                        : $(this.element).parents(':visible')[0] as HTMLElement || this.element
                    ;
                    $(this.busyElement).addClass(CssClasses.COMPONENT_BUSY);
                }

                this.pendingActions.push(event.action);
            });
            actions[i].listen('complete', (event: ActionEvent): void => {
                this.pendingActions.splice(
                    this.pendingActions.indexOf(event.action),
                    1
                );

                if (0 === this.pendingActions.length) {
                    $(this.busyElement).removeClass(CssClasses.COMPONENT_BUSY);
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
