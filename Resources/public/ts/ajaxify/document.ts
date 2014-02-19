/// <reference path="configuration.ts"/>
/// <reference path="event.ts"/>
/// <reference path="container.ts"/>
/// <reference path="widget.ts"/>
/// <reference path="link.ts"/>
/// <reference path="form.ts"/>
/// <reference path="modal_container.ts"/>
/// <reference path="void_container.ts"/>

/**
 * Imatic view ajaxify document module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module imatic.view.ajaxify.document {

    "use_strict";

    import ConfigurationBuilder         = imatic.view.ajaxify.configuration.ConfigurationBuilder;
    import DomEvents                    = imatic.view.ajaxify.event.DomEvents;
    import ContainerInterface           = imatic.view.ajaxify.container.ContainerInterface;
    import ContainerHandler             = imatic.view.ajaxify.container.ContainerHandler;
    import ContainerNotFoundException   = imatic.view.ajaxify.container.ContainerNotFoundException;
    import WidgetInterface              = imatic.view.ajaxify.widget.WidgetInterface;
    import WidgetHandler                = imatic.view.ajaxify.widget.WidgetHandler;
    import ModalContainerHandler        = imatic.view.ajaxify.modalContainer.ModalContainerHandler;
    import ModalConfigurationDefaults   = imatic.view.ajaxify.modalContainer.ModalConfigurationDefaults;
    import ModalConfigurationProcessor  = imatic.view.ajaxify.modalContainer.ModalConfigurationProcessor;
    import VoidContainerHandler         = imatic.view.ajaxify.voidContainer.VoidContainerHandler;
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
        private widgetHandler: WidgetHandler;
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

            // widget handler
            this.widgetHandler = new WidgetHandler(this.jQuery);

            // link handler
            this.linkHandler = new LinkHandler(this.widgetHandler, this.configBuilder, this.jQuery);

            // form handler
            this.formHandler = new FormHandler(this.widgetHandler, this.configBuilder, this.jQuery);

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

            // void container handler
            var voidContainerHandler = new VoidContainerHandler(
                this.containerHandler,
                this.configBuilder,
                this.document,
                this.jQuery
            );
            this.containerHandler.addTargetHandler(voidContainerHandler);
        }

        /**
         * Attach the handler
         */
        attach(): void {
            this.jQuery(this.document)
                .on('click', this.onClick)
                .on('submit', this.onSubmit)
                .on(DomEvents.ON_BEFORE_CONTENT_UPDATE, this.onBeforeContentUpdate)
            ;
        }

        /**
         * Validate given element
         */
        private isValidElement(element: HTMLElement): boolean {
            return false !== this.jQuery(element).data('ajaxify');
        }

        /**
         * Handle onclick event
         */
        private onClick = (event: MouseEvent): void => {
            var element = <HTMLElement> event.target;

            try {
                if (
                    this.linkHandler.isValidElement(element)
                    && this.isValidElement(element)
                    && this.linkHandler.isValidEvent(event)
                ) {
                    var container = this.containerHandler.findInstance(element);
                    var link = this.linkHandler.getInstance(container, element);

                    this.dispatch(container, link);
                    event.preventDefault();
                }
            } catch (e) {
                if (!(e instanceof ContainerNotFoundException)) {
                    throw e;
                }
            }
        }

        /**
         * Handle onsubmit event
         */
        private onSubmit = (event: Event): void => {
            var element = <HTMLElement> event.target;

            try {
                if (
                    this.formHandler.isValidElement(element)
                    && this.isValidElement(element)
                ) {
                    var container = this.containerHandler.findInstance(element);
                    var form = this.formHandler.getInstance(container, element);

                    this.dispatch(container, form);
                    event.preventDefault();
                }
            } catch (e) {
                if (!(e instanceof ContainerNotFoundException)) {
                    throw e;
                }
            }
        }

        /**
         * Handle onBeforeContentUpdate event
         */
        private onBeforeContentUpdate = (event: Event): void => {
            var element = <HTMLElement> event.target;

            // destroy() all living widget instances in the DOM subtree
            var widgets = this.widgetHandler.findInstances(element);
            for (var i = 0; i < widgets.length; ++i) {
                widgets[i].destroy();
            }

            // destroy() all living container instances in the DOM subtree
            var containers = this.containerHandler.findInstances(element);
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
