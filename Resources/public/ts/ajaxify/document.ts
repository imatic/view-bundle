/// <reference path="configuration.ts"/>
/// <reference path="event.ts"/>
/// <reference path="container.ts"/>
/// <reference path="widget.ts"/>
/// <reference path="action.ts"/>
/// <reference path="link.ts"/>
/// <reference path="form.ts"/>
/// <reference path="modal_container.ts"/>
/// <reference path="void_container.ts"/>
/// <reference path="jquery.ts"/>

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
    import ActionInterface              = imatic.view.ajaxify.action.ActionInterface;
    import ModalContainerHandler        = imatic.view.ajaxify.modalContainer.ModalContainerHandler;
    import ModalConfigurationDefaults   = imatic.view.ajaxify.modalContainer.ModalConfigurationDefaults;
    import ModalConfigurationProcessor  = imatic.view.ajaxify.modalContainer.ModalConfigurationProcessor;
    import VoidContainerHandler         = imatic.view.ajaxify.voidContainer.VoidContainerHandler;
    import LinkHandler                  = imatic.view.ajaxify.link.LinkHandler;
    import FormHandler                  = imatic.view.ajaxify.form.FormHandler;
    import jQuery                       = imatic.view.ajaxify.jquery.jQuery;

    /**
     * HTML document handler
     *
     * Provides the functionality by listening to certain DOM events.
     */
    export class HTMLDocumentHandler
    {
        private document: HTMLDocument;
        private configBuilder: ConfigurationBuilder;
        private containerHandler: ContainerHandler;
        private widgetHandler: WidgetHandler;
        private linkHandler: LinkHandler;
        private formHandler: FormHandler;

        /**
         * Constructor
         */
        constructor(document: HTMLDocument) {
            this.document = document;

            // config builder
            this.configBuilder = new ConfigurationBuilder(document);
            this.configBuilder.addDefaults(ModalConfigurationDefaults);
            this.configBuilder.addProcessor(new ModalConfigurationProcessor());

            // widget handler
            this.widgetHandler = new WidgetHandler();

            // link handler
            this.linkHandler = new LinkHandler(this.widgetHandler, this.configBuilder);

            // form handler
            this.formHandler = new FormHandler(this.widgetHandler, this.configBuilder);

            // container handler
            this.containerHandler = new ContainerHandler(
                this.configBuilder,
                this.document
            );

            // modal container handler
            var modalContainerHandler = new ModalContainerHandler(
                this.containerHandler,
                this.widgetHandler,
                this.configBuilder,
                this.document
            );
            this.containerHandler.addTargetHandler(modalContainerHandler);

            // void container handler
            var voidContainerHandler = new VoidContainerHandler(
                this.containerHandler,
                this.configBuilder,
                this.document
            );
            this.containerHandler.addTargetHandler(voidContainerHandler);
        }

        /**
         * Attach the handler
         */
        attach(): void {
            jQuery(this.document)
                .on('click', this.onClick)
                .on('submit', this.onSubmit)
                .on(DomEvents.ACTION, this.onAction)
                .on(DomEvents.BEFORE_CONTENT_UPDATE, this.onBeforeContentUpdate)
                .on(DomEvents.HISTORY_INITIAL_STATE, this.onHistoryInitialState)
            ;
        }

        /**
         * Validate given element
         */
        private isValidElement(element: HTMLElement): boolean {
            return false !== jQuery(element).data('ajaxify');
        }

        /**
         * Handle onclick event
         */
        private onClick = (event: JQueryEventObject): void => {
            var element = <HTMLElement> event.target;

            try {
                if (
                    this.linkHandler.isValidElement(element)
                    && this.isValidElement(element)
                    && this.linkHandler.isValidEvent(event)
                ) {
                    var context = this.getContainerContext(element);
                    var link = this.linkHandler.getInstance(element, context.containerElement);

                    this.dispatch(context.container, link);
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
        private onSubmit = (event: JQueryEventObject): void => {
            var element = <HTMLElement> event.target;

            try {
                if (
                    this.formHandler.isValidElement(element)
                    && this.isValidElement(element)
                ) {
                    var context = this.getContainerContext(element);
                    var form = this.formHandler.getInstance(element, context.containerElement);

                    this.dispatch(context.container, form);
                    event.preventDefault();
                }
            } catch (e) {
                if (!(e instanceof ContainerNotFoundException)) {
                    throw e;
                }
            }
        }

        /**
         * Handle action event
         */
        private onAction = (event: JQueryEventObject, ...args: any[]): any => {
            var element = <HTMLElement> event.target;

            try {
                var container = this.containerHandler.findInstance(element, false);

                container.handleAction(<ActionInterface> arguments[1]);
            } catch (e) {
                if (!(e instanceof ContainerNotFoundException)) {
                    throw e;
                }
            }
        }

        /**
         * Handle beforeContentUpdate event
         */
        private onBeforeContentUpdate = (event: JQueryEventObject): void => {
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
         * Handle onHistoryInitialState event
         */
        private onHistoryInitialState = (event: JQueryEventObject): void => {
            // reset() all living container instances in the document
            var containers = this.containerHandler.findInstances(this.document.body);
            for (var i = 0; i < containers.length; ++i) {
                containers[i].reset();
            }
        }

        /**
         * Get container context for given element
         *
         * This method finds the related container instance and also
         * the contextual container's element.
         */
        private getContainerContext(element: HTMLElement): {
            container: ContainerInterface;
            containerElement: HTMLElement;
        } {
            var container = this.containerHandler.findInstance(element);
            var containerElement;

            try {
                containerElement = (container.isContextual()
                    ? container.getElement()
                    : this.containerHandler.getElementFromContext(element)
                );
            } catch (e) {
                if (!(e instanceof ContainerNotFoundException)) {
                    throw e;
                }
            }

            return {
                container: container,
                containerElement: containerElement,
            };
        }

        /**
         * Perform widget <=> container interaction
         */
        private dispatch(container: ContainerInterface, widget: WidgetInterface): void {
            var action = widget.createAction();

            if (action) {
                container.handleAction(action);
            }
        }
    }

}
