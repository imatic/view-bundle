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
    import EventDispatcher      = imatic.view.ajaxify.event.EventDispatcher;
    import Event                = imatic.view.ajaxify.event.Event;

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
                element,
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
            private element: HTMLElement,
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
            return new SubmitFormAction(this, this.jQuery);
        }
    }

    /**
     * Submit form action
     */
    export class SubmitFormAction implements ActionInterface
    {
        public events = new EventDispatcher();

        private complete = false;
        private successful = false;
        private onComplete: (action: ActionInterface) => void;

        /**
         * Constructor
         */
        constructor(
            private widget: WidgetInterface,
            private jQuery: any
        ) {}

        /**
         * See if the action is complete
         */
        isComplete(): boolean {
            return this.complete;
        }

        /**
         * See if the action was successful
         */
        isSuccessful(): boolean {
            return this.successful;
        }

        /**
         * Execute the action
         */
        execute(container: ContainerInterface): void {

        }

        /**
         * Abort the action
         */
        abort(): void {

        }
    }

}
