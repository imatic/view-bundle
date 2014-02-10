/// <reference path="configuration.ts"/>
/// <reference path="container.ts"/>
/// <reference path="widget.ts"/>
/// <reference path="action.ts"/>
/// <reference path="ajax.ts"/>

/**
 * Imatic view ajaxify link module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module imatic.view.ajaxify.link {

    "use_strict";
    
    import ConfigurationBuilder = imatic.view.ajaxify.configuration.ConfigurationBuilder;
    import ContainerInterface   = imatic.view.ajaxify.container.ContainerInterface;
    import WidgetInterface      = imatic.view.ajaxify.widget.WidgetInterface;
    import ActionInterface      = imatic.view.ajaxify.action.ActionInterface;
    import AjaxRequest          = imatic.view.ajaxify.ajax.AjaxRequest;
    import ServerResponse       = imatic.view.ajaxify.ajax.ServerResponse;
    
    /**
     * Link handler
     */         
    export class LinkHandler
    {
        private linkFactory = new LinkFactory(this.configBuilder, this.jQuery);
        private linkTagNames = ['A', 'BUTTON'];
        
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
        isValidLink(element: HTMLElement): boolean {
            return -1 !== this.linkTagNames.indexOf(element.tagName);
        }
        
        /**
         * Get link instance for given element
         */
        getLink(container: ContainerInterface, element: HTMLElement): Link {
            return this.linkFactory.create(container, element);
        }
    }

    /**
     * Link factory
     */
    export class LinkFactory
    {
        /**
         * Constructor
         */
        constructor(
            private configBuilder: ConfigurationBuilder,
            private jQuery: any
        ) {}

        /**
         * Create a link
         */
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

    /**
     * Link
     */
    export class Link implements WidgetInterface
    {
        url: string;

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
         * Get link's configuration
         */
        getConfiguration(): any {
            return this.configBuilder.build(this.element);
        }

        /**
         * Create action
         */
        createAction(): ActionInterface {
            return new LoadHtmlAction(this.url, this.jQuery);
        }
    }
    
    /**
     * Load HTML action
     */
    export class LoadHtmlAction implements ActionInterface
    {
        complete = false;
        successfull = false;
        onComplete: (action: ActionInterface) => void;
        private request: AjaxRequest;

        /**
         * Constructor
         */
        constructor(private url: string, private jQuery: any) {}

        /**
         * Execute the action
         */
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

        /**
         * Abort the action
         */
        abort(): void {
            if (!this.complete) {
                this.request.xhr.abort();
            }
        }
    }

}
