/// <reference path="configuration.ts"/>
/// <reference path="container.ts"/>
/// <reference path="widget.ts"/>
/// <reference path="event.ts"/>
/// <reference path="css.ts"/>
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
    import WidgetHandler        = imatic.view.ajaxify.widget.WidgetHandler;
    import EventInterface       = imatic.view.ajaxify.event.EventInterface;
    import ActionInterface      = imatic.view.ajaxify.action.ActionInterface;
    import LoadHtmlAction       = imatic.view.ajaxify.action.LoadHtmlAction;
    import CssClasses           = imatic.view.ajaxify.css.CssClasses;

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
            private widgetHandler: WidgetHandler,
            private configBuilder: ConfigurationBuilder,
            private jQuery: any
        ) {}

        /**
         * Validate given element
         */
        isValidElement(element: HTMLElement): boolean {
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
        getInstance(container: ContainerInterface, element: HTMLElement): Link {
            var link;

            if (this.widgetHandler.hasInstance(element)) {
                link = this.widgetHandler.getInstance(element);
            } else {
                link = this.linkFactory.create(container, element);
                this.widgetHandler.setInstance(element, link);
            }

            return link;
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
         * Destructor
         */
        destroy(): void {
        }

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
            var action = new LoadHtmlAction(this, this.jQuery, {
                url: this.url,
                method: 'GET',
                data: null,
            });

            action.events.addCallback('begin', (event: EventInterface): void => {
                this.jQuery(this.element).addClass(CssClasses.COMPONENT_BUSY);
            });
            action.events.addCallback('complete', (event: EventInterface): void => {
                this.jQuery(this.element).removeClass(CssClasses.COMPONENT_BUSY);
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
