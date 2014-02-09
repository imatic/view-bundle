/**
 * Imatic view ajaxify module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module imatic.view.ajaxify {

    "use_strict";

    // interfaces

    interface WidgetInterface
    {
        getConfiguration: () => any;
        createAction: () => ActionInterface;
    }

    interface ContainerInterface
    {
        getConfiguration: () => any;
        handleAction: (action: ActionInterface) => void;
        setHtml: (html: string) => void;
    }

    interface ActionInterface
    {
        complete: boolean;
        successfull: boolean;
        onComplete: (action: ActionInterface) => void;

        execute: (container: ContainerInterface) => void;
        abort: () => void;
    }

    interface ModalOptionsInterface
    {
        modalSize: ModalSize;
        modalClosable: boolean;
        modalActions: string;
        modalTitle: string;
        modalHeader: string;
        modalFooter: string;
    }

    enum ModalSize {
        SMALL,
        NORMAL,
        LARGE
    }

    interface FlashMessageInterface
    {
        type: string;
        message: string;
    }


    // exceptions

    class Exception implements Error
    {
        name: string;

        constructor(public message: string) {}
        toString(): string {
            return this.message;
        }
    }

    class ContainerNotFoundException extends Exception {
        name = "ContainerNotFound";
    }


    // registry

    class ContainerRegistry
    {
        private registry = {};
        private registryIdSequence = 0;
        private idDataAttribute = 'container-id';

        constructor(private jQuery) {}

        has(element: HTMLElement): boolean {

            return this.registry[this.id(element)] ? true : false;
        }

        get(element: HTMLElement): ContainerInterface {
            var id = this.id(element);
            var container = this.registry[id];
            if (!container) {
                throw new ContainerNotFoundException('Container with ID "' + id + '" was not found in the registry');
            }

            return container;
        }

        add(element: HTMLElement, container: ContainerInterface): number {
            var id = ++this.registryIdSequence;

            this.registry[id] = container;
            this.jQuery(element).data(this.idDataAttribute, id);

            return id;
        }

        private id(element: HTMLElement): string {
            return this.jQuery(element).data(this.idDataAttribute) || '';
        }
    }


    // configuration

    class ConfigurationBuilder
    {
        private defaults  = {
            modalSize: ModalSize.NORMAL,
            modalClosable: true,
            modalActions: '',
            modalTitle: '',
            modalHeader: '',
            modalFooter: '',
        };

        constructor(private document: HTMLDocument, private jQuery) {}

        build(element?: HTMLElement, parentConfig?) {
            // default
            var config = this.jQuery.extend({}, this.defaults);

            // parent
            if (parentConfig) {
                this.jQuery.extend(config, parentConfig);
            }

            // local
            if (element) {
                this.jQuery.extend(config, this.jQuery(element).data());
            }

            return this.process(config);
        }

        private process(config) {
            if (typeof config.modalSize === 'string') {
                config.modalSize = ModalSize[config.modalSize.toUpper()];
            }

            return config;
        }
    }


    // factories

    class ContainerFactory
    {
        constructor(
            private configBuilder: ConfigurationBuilder,
            private document: HTMLDocument,
            private jQuery
        ) {}

        create(element: HTMLElement): ContainerInterface {
            return new Container(
                this.configBuilder,
                element,
                this.jQuery
            );
        }
    }

    class LinkFactory
    {
        constructor(
            private configBuilder: ConfigurationBuilder,
            private jQuery
        ) {}

        create(container: ContainerInterface, element: HTMLElement): Link {
            var link = new Link(
                this.configBuilder,
                container,
                element,
                this.jQuery
            );

            link.url = this.jQuery(element).attr('href') || this.jQuery(element).data('href');

            return link;
        }

    }

    class FormFactory
    {
        constructor(
            private configBuilder: ConfigurationBuilder,
            private jQuery
        ) {}

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


    // container and widgets

    class Container implements ContainerInterface
    {
        private currentAction: ActionInterface;

        constructor(
            private configBuilder: ConfigurationBuilder,
            private element: HTMLElement,
            private jQuery
        ) {}

        getConfiguration(): any {
            return this.configBuilder.build(this.element);
        }

        handleAction(action: ActionInterface): void {
            // abort current action
            if (this.currentAction) {
                if (!this.currentAction.complete) {
                    this.currentAction.abort();
                }
            }

            // execute aaction
            this.currentAction = action;
            action.onComplete = this.onActionComplete;
            action.execute(this);
        }

        onActionComplete = (action: ActionInterface): void => {

        };

        setHtml(html: string): void {
            this.jQuery(this.element).html(html);
        }
    }

    class Link implements WidgetInterface
    {
        url: string;

        constructor(
            private configBuilder: ConfigurationBuilder,
            private container: ContainerInterface,
            private element: HTMLElement,
            private jQuery
        ) {}

        getConfiguration(): any {
            return this.configBuilder.build(this.element);
        }

        createAction(): ActionInterface {
            return new LoadHtmlAction(this.url, this.jQuery);
        }
    }

    class Form implements WidgetInterface
    {
        constructor(
            private configBuilder: ConfigurationBuilder,
            private container: ContainerInterface,
            private element: HTMLElement,
            private jQuery
        ) {}

        getConfiguration(): any {
            return this.configBuilder.build(this.element);
        }

        createAction(): ActionInterface {
            return new SubmitFormAction(this, this.jQuery);
        }
    }


    // handlers

    export class HTMLDocumentHandler
    {
        private configBuilder = new ConfigurationBuilder(this.document, this.jQuery);

        private containerFactory = new ContainerFactory(this.configBuilder, this.document, this.jQuery);
        private containerRegistry = new ContainerRegistry(this.jQuery);
        private containerSelector = '[data-role="component"]';

        private linkFactory = new LinkFactory(this.configBuilder, this.jQuery);
        private linkTagNames = ['A', 'BUTTON'];

        private formFactory = new FormFactory(this.configBuilder, this.jQuery);

        constructor(private document: HTMLDocument, private jQuery) {}

        attach(): void {
            var handler = this;

            this.jQuery(this.document).on('click', function (e) { handler.onClick(e); });
            this.jQuery(this.document).on('submit', function (e) { handler.onSubmit(e); });
        }

        private onClick(event: Event): void {
            var element = <HTMLElement> event.target;

            if (-1 !== this.linkTagNames.indexOf(element.tagName)) {
                var container = this.getContainer(element);
                var link = this.linkFactory.create(container, element);

                this.dispatch(container, link);

                event.preventDefault();
            }
        }

        private onSubmit(event: Event): void {
            var element = <HTMLElement> event.target;

            if ('FORM' === element.tagName) {
                var container = this.getContainer(element);
                var form = this.formFactory.create(container, element);

                this.dispatch(container, form);

                event.preventDefault();
            }
        }

        private getContainer(element: HTMLElement): ContainerInterface {
            var target = this.jQuery(element).data('target');

            var container;
            if ('modal' === target) {
                // modal
                throw new Error('Not implemented');
            } else {
                // element
                var containerElement;
                if (!target || '.' === target) {
                    // parent container
                    containerElement = this.getContainerElementFromContext(element);
                } else {
                    // specified by selector
                    containerElement = this.getContainerElementFromSelector(target);
                }

                // check registry
                if (this.containerRegistry.has(containerElement)) {
                    container = this.containerRegistry.get(containerElement);
                } else {
                    container = this.containerFactory.create(containerElement);
                    this.containerRegistry.add(containerElement, container);
                }
            }

            return container;
        }

        private getContainerElementFromContext(element: HTMLElement): HTMLElement {
            var parentContainers = this.jQuery(element).parents(this.containerSelector);
            if (parentContainers.length < 1) {
                throw new ContainerNotFoundException('Could not determine the container from context');
            }

            return parentContainers[0];
        }

        private getContainerElementFromSelector(selector: string): ContainerInterface {
            var containerElement = this.jQuery(selector, this.document)[0];
            if (!containerElement) {
                throw new ContainerNotFoundException('Container specified by selector "' + selector + '" was not found');
            }
            if (!this.jQuery(containerElement).is(this.containerSelector)) {
                throw new ContainerNotFoundException('Container specified by selector "' + selector + '" is not a valid container');
            }

            return containerElement;
        }

        private dispatch(container: ContainerInterface, widget: WidgetInterface): void {
            var action = widget.createAction();
            container.handleAction(action);
        }
    }

    // actions

    class LoadHtmlAction implements ActionInterface
    {
        complete = false;
        successfull = false;
        onComplete: (action: ActionInterface) => void;
        private request: AjaxRequest;

        constructor(private url: string, private jQuery) {}

        execute(container: ContainerInterface): void {
            var self = this;

            this.request = new AjaxRequest(this.jQuery);
            this.request.execute({
                type: 'GET',
                dataType: 'html',
                url: this.url,
                cache: false,
                success: function (response: ServerResponse) {
                    self.successfull = true;
                    container.setHtml(response.data);
                },
                complete: function () {
                    self.complete = true;
                    if (self.onComplete) {
                        self.onComplete(self);
                    }
                },
            });
        }

        abort(): void {
            if (!this.complete) {
                this.request.xhr.abort();
            }
        }
    }

    class SubmitFormAction implements ActionInterface
    {
        complete = false;
        successfull = false;
        onComplete: (action: ActionInterface) => void;

        constructor(private form: Form, private jQuery) {}

        execute(container: ContainerInterface): void {
            throw new Error('Not implemented');
        }

        abort(): void {
        }
    }

    class AjaxRequest
    {
        xhr: XMLHttpRequest;

        constructor(private jQuery) {}

        execute(options) {
            var onSuccess = options.success;

            options.success = function (data, status, xhr) {
                if (onSuccess) {
                    var serverResponse = new ServerResponse(this.jQuery, data, xhr);
                    onSuccess(serverResponse);
                }
            };

            this.xhr = this.jQuery.ajax(options);
        }
    }

    class ServerResponse
    {
        title: string;
        flashes: FlashMessageInterface[];
        data: any;

        constructor(jQuery, data: any, xhr: XMLHttpRequest) {
            this.title = xhr.getResponseHeader('X-Title') || '';
            this.flashes = [];
            this.data = data;

            var flashesJson = xhr.getResponseHeader('X-Flash-Messages');
            if (flashesJson) {
                this.flashes = jQuery.parseJSON(flashesJson);
            }
        }
    }

}
