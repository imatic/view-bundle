/// <reference path="container.ts"/>
/// <reference path="configuration.ts"/>
/// <reference path="widget.ts"/>
/// <reference path="action.ts"/>

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
    import ActionInterface      = imatic.view.ajaxify.action.ActionInterface;
    
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
            private configBuilder: ConfigurationBuilder,
            private jQuery: any
        ) {}
        
        /**
         * Validate given element
         */                 
        isValidForm(element: HTMLElement): boolean {
            return 'FORM' === element.tagName;
        }
        
        /**
         * Get form instance for given element
         */
        getForm(container: ContainerInterface, element: HTMLElement): Form {
            return this.formFactory.create(container, element);
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
         * Get form's configuration
         */
        getConfiguration(): any {
            return this.configBuilder.build(this.element);
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
        complete = false;
        successful = false;
        onComplete: (action: ActionInterface) => void;

        /**
         * Constructor
         */
        constructor(private form: Form, private jQuery: any) {}

        /**
         * Execute the action
         */
        execute(container: ContainerInterface): void {
            throw new Error('Not implemented');
        }

        /**
         * Abort the action
         */
        abort(): void {
        }
    }

}
