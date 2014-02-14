/// <reference path="container.ts"/>
/// <reference path="configuration.ts"/>
/// <reference path="widget.ts"/>
/// <reference path="action.ts"/>
/// <reference path="event.ts"/>

/**
 * Imatic view ajaxify form module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module imatic.view.ajaxify.form {

    "use_strict";

    import ContainerInterface   = imatic.view.ajaxify.container.ContainerInterface;
    import ConfigurationBuilder = imatic.view.ajaxify.configuration.ConfigurationBuilder;
    import WidgetInterface      = imatic.view.ajaxify.widget.WidgetInterface;
    import WidgetHandler        = imatic.view.ajaxify.widget.WidgetHandler;
    import ActionInterface      = imatic.view.ajaxify.action.ActionInterface;
    import LoadHtmlAction       = imatic.view.ajaxify.action.LoadHtmlAction;
    import EventDispatcher      = imatic.view.ajaxify.event.EventDispatcher;
    import EventInterface       = imatic.view.ajaxify.event.EventInterface;
    import CssClasses           = imatic.view.ajaxify.css.CssClasses;

    /**
     * Form handler
     */

    export class FormHandler
    {
        private formFactory = new FormFactory(this.configBuilder, this.jQuery);

        /**
         * Constructor
         */
        constructor(
            private widgetHandler: WidgetHandler,
            private configBuilder: ConfigurationBuilder,
            private jQuery: any
        ) {}

        /**
         * Validate given element
         */
        isValidElement(element: HTMLElement): boolean {
            return 'FORM' === element.tagName;
        }

        /**
         * Get form instance for given element
         */
        getInstance(container: ContainerInterface, element: HTMLElement): Form {
            var form;

            if (this.widgetHandler.hasInstance(element)) {
                form = this.widgetHandler.getInstance(element);
            } else {
                form = this.formFactory.create(container, element);
                this.widgetHandler.setInstance(element, form);
            }

            return form;
        }
    }

    /**
     * Form factory
     */
    export class FormFactory
    {
        /**
         * Constructor
         */
        constructor(
            private configBuilder: ConfigurationBuilder,
            private jQuery: any
        ) {}

        /**
         * Create form
         */
        create(container: ContainerInterface, element: HTMLElement): Form {
            var form = new Form(
                this.configBuilder,
                container,
                <HTMLFormElement> element,
                this.jQuery
            );

            return form;
        }
    }

    /**
     * Form
     */
    export class Form implements WidgetInterface
    {
        /**
         * Constructor
         */
        constructor(
            private configBuilder: ConfigurationBuilder,
            private container: ContainerInterface,
            private element: HTMLFormElement,
            private jQuery: any
        ) {}

        /**
         * Destructor
         */
        destroy(): void {
        }

        /**
         * Get form's configuration
         */
        getConfiguration(): any {
            return this.configBuilder.build(
                this.element,
                this.container.getConfiguration()
            );
        }

        /**
         * Create action
         */
        createAction(): ActionInterface {
            var action = new LoadHtmlAction(this, this.jQuery, {
                url: this.element.action,
                method: this.element.method || 'GET',
                data: this.jQuery(this.element).serialize(),
            });

            action.events.addCallback('begin', (event: EventInterface): void => {
                this.jQuery(this.element).addClass(CssClasses.COMPONENT_BUSY);
            });
            action.events.addCallback('complete', (event: EventInterface): void => {
                this.jQuery(this.element).removeClass(CssClasses.COMPONENT_BUSY);
            });

            return action;
        }

        /**
         * Get widget's element
         */
        getElement(): HTMLElement {
            return this.element;
        }
    }

}
