/// <reference path="container.ts"/>
/// <reference path="configuration.ts"/>
/// <reference path="widget.ts"/>
/// <reference path="action.ts"/>
/// <reference path="event.ts"/>
/// <reference path="jquery.ts"/>

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
    import jQuery               = imatic.view.ajaxify.jquery.jQuery;

    /**
     * Form handler
     */
    export class FormHandler
    {
        private formFactory = new FormFactory(this.configBuilder);

        /**
         * Constructor
         */
        constructor(
            private widgetHandler: WidgetHandler,
            private configBuilder: ConfigurationBuilder
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
        getInstance(element: HTMLElement, containerElement?: HTMLElement): Form {
            var form;

            if (this.widgetHandler.hasInstance(element)) {
                form = this.widgetHandler.getInstance(element);
            } else {
                form = this.formFactory.create(element, containerElement);
                this.widgetHandler.setInstance(element, form);
            }

            return form;
        }
    }

    /**
     * Form factory
     */
    class FormFactory
    {
        /**
         * Constructor
         */
        constructor(
            private configBuilder: ConfigurationBuilder
        ) {}

        /**
         * Create form
         */
        create(element: HTMLElement, containerElement?: HTMLElement): Form {
            var form = new Form(
                this.configBuilder,
                <HTMLFormElement> element,
                containerElement
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
            private element: HTMLFormElement,
            private containerElement: HTMLElement
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
                this.containerElement ? [this.containerElement] : []
            );
        }

        /**
         * Create action
         */
        createAction(): ActionInterface {
            var config = this.getConfiguration();

            var action = new LoadHtmlAction(this, {
                url: this.element.action,
                method: this.element.method || 'GET',
                data: jQuery(this.element).serialize(),
                contentSelector: config.contentSelector || null,
            });

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
    }

}
