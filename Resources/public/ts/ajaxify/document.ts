/// <reference path="configuration.ts"/>
/// <reference path="container.ts"/>
/// <reference path="widget.ts"/>
/// <reference path="link.ts"/>
/// <reference path="form.ts"/>

/**
 * Imatic view ajaxify document module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module imatic.view.ajaxify.document {

    "use_strict";
    
    import ConfigurationBuilder = imatic.view.ajaxify.configuration.ConfigurationBuilder;
    import ContainerInterface   = imatic.view.ajaxify.container.ContainerInterface;
    import ContainerHandler     = imatic.view.ajaxify.container.ContainerHandler;
    import WidgetInterface      = imatic.view.ajaxify.widget.WidgetInterface;
    import LinkHandler          = imatic.view.ajaxify.link.LinkHandler;
    import FormHandler          = imatic.view.ajaxify.form.FormHandler;

    /**
     * HTML document handler
     * 
     * Provides the functionality by listening to certain DOM events.          
     */         
    export class HTMLDocumentHandler
    {
        private configBuilder = new ConfigurationBuilder(this.document, this.jQuery);
        private containerHandler = new ContainerHandler(this.configBuilder, this.document, this.jQuery);
        private linkHandler = new LinkHandler(this.configBuilder, this.jQuery); 
        private formHandler = new FormHandler(this.configBuilder, this.jQuery);

        /**
         * Constructor
         */                 
        constructor(private document: HTMLDocument, private jQuery: any) {}

        /**
         * Attach the handler
         */                 
        attach(): void {
            var handler = this;

            this.jQuery(this.document).on('click', function (e) { handler.onClick(e); });
            this.jQuery(this.document).on('submit', function (e) { handler.onSubmit(e); });
        }

        /**
         * Handle onclick event
         */                 
        private onClick(event: Event): void {
            var element = <HTMLElement> event.target;
            
            if (this.linkHandler.isValidLink(element)) {
                var container = this.containerHandler.getContainer(element);
                var link = this.linkHandler.getLink(container, element);
                
                this.dispatch(container, link);
                event.preventDefault();
            }
        }

        /**
         * Handle onsubmit event
         */
        private onSubmit(event: Event): void {
            var element = <HTMLElement> event.target;
            
            if (this.formHandler.isValidForm(element)) {
                var container = this.containerHandler.getContainer(element);
                var form = this.formHandler.getForm(container, element);
                
                this.dispatch(container, form);
                event.preventDefault();
            }
        }

        /**
         * Perform widget <=> container interaction
         */
        private dispatch(container: ContainerInterface, widget: WidgetInterface): void {
            var action = widget.createAction();
            
            container.handleAction(action);
        }
    }

}
