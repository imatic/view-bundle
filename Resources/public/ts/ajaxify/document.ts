/// <reference path="configuration.ts"/>
/// <reference path="event.ts"/>
/// <reference path="container.ts"/>
/// <reference path="widget.ts"/>
/// <reference path="link.ts"/>
/// <reference path="form.ts"/>
/// <reference path="modal.ts"/>

/**
 * Imatic view ajaxify document module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module imatic.view.ajaxify.document {

    "use_strict";

    import ConfigurationBuilder         = imatic.view.ajaxify.configuration.ConfigurationBuilder;
    import Events                       = imatic.view.ajaxify.event.Events;
    import ContainerInterface           = imatic.view.ajaxify.container.ContainerInterface;
    import ContainerHandler             = imatic.view.ajaxify.container.ContainerHandler;
    import WidgetInterface              = imatic.view.ajaxify.widget.WidgetInterface;
    import ModalContainerHandler        = imatic.view.ajaxify.modal.ModalContainerHandler;
    import ModalConfigurationDefaults   = imatic.view.ajaxify.modal.ModalConfigurationDefaults;
    import ModalConfigurationProcessor  = imatic.view.ajaxify.modal.ModalConfigurationProcessor;
    import LinkHandler                  = imatic.view.ajaxify.link.LinkHandler;
    import FormHandler                  = imatic.view.ajaxify.form.FormHandler;

    /**
     * HTML document handler
     *
     * Provides the functionality by listening to certain DOM events.
     */
    export class HTMLDocumentHandler
    {
        private document: HTMLDocument;
        private jQuery: any;
        private configBuilder: ConfigurationBuilder;
        private containerHandler: ContainerHandler;
        private linkHandler: LinkHandler;
        private formHandler: FormHandler;

        /**
         * Constructor
         */
        constructor(document: HTMLDocument, jQuery: any) {
            this.document = document;
            this.jQuery = jQuery;

            // config builder
            this.configBuilder = new ConfigurationBuilder(document, jQuery);
            this.configBuilder.addDefaults(ModalConfigurationDefaults);
            this.configBuilder.addProcessor(new ModalConfigurationProcessor());

            // link handler
            this.linkHandler = new LinkHandler(this.configBuilder, this.jQuery);

            // form handler
            this.formHandler = new FormHandler(this.configBuilder, this.jQuery);

            // container handler
            this.containerHandler = new ContainerHandler(
                this.configBuilder,
                this.document,
                this.jQuery
            );

            // modal container handler
            var modalContainerHandler = new ModalContainerHandler(
                this.containerHandler,
                this.configBuilder,
                this.document,
                this.jQuery
            );
            this.containerHandler.addTargetHandler(modalContainerHandler);
        }

        /**
         * Attach the handler
         */
        attach(): void {
            this.jQuery(this.document)
                .on('click', this.onClick)
                .on('submit', this.onSubmit)
                .on(Events.ON_BEFORE_CONTENT_UPDATE, this.onBeforeContentUpdate)
            ;
        }

        /**
         * Handle onclick event
         */
        private onClick = (event: MouseEvent): void => {
            var element = <HTMLElement> event.target;

            if (
                this.linkHandler.isValidLink(element)
                && this.linkHandler.isValidEvent(event)
            ) {
                var container = this.containerHandler.findContainer(element);
                var link = this.linkHandler.getLink(container, element);

                this.dispatch(container, link);
                event.preventDefault();
            }
        }

        /**
         * Handle onsubmit event
         */
        private onSubmit = (event: Event): void => {
            var element = <HTMLElement> event.target;

            if (this.formHandler.isValidForm(element)) {
                var container = this.containerHandler.findContainer(element);
                var form = this.formHandler.getForm(container, element);

                this.dispatch(container, form);
                event.preventDefault();
            }
        }

        /**
         * Handle onBeforeContentUpdate event
         */
        private onBeforeContentUpdate = (event: Event): void => {
            var element = <HTMLElement> event.target;

            // call destroy() on all containers that are about to be replaced
            var containers = this.containerHandler.getAliveContainers(element);
            for (var i = 0; i < containers.length; ++i) {
                containers[i].destroy();
            }
        };

        /**
         * Perform widget <=> container interaction
         */
        private dispatch(container: ContainerInterface, widget: WidgetInterface): void {
            var action = widget.createAction();

            container.handleAction(action);
        }
    }

}
