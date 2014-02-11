/// <reference path="configuration.ts"/>
/// <reference path="container.ts"/>
/// <reference path="widget.ts"/>
/// <reference path="action.ts"/>

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
    import LoadHtmlAction       = imatic.view.ajaxify.action.LoadHtmlAction;

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
         * Validate given event
         */
        isValidEvent(event: MouseEvent): boolean {
            return event.which && 1 == event.which;
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
            return this.configBuilder.build(
                this.element,
                this.container.getConfiguration()
            );
        }

        /**
         * Create action
         */
        createAction(): ActionInterface {
            return new LoadHtmlAction(this, this.url, this.jQuery);
        }
    }

}
