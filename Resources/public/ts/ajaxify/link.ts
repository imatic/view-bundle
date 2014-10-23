/// <reference path="configuration.ts"/>
/// <reference path="container.ts"/>
/// <reference path="widget.ts"/>
/// <reference path="css.ts"/>
/// <reference path="action.ts"/>
/// <reference path="jquery.ts"/>

/**
 * Imatic view ajaxify link module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module imatic.view.ajaxify.link {

    "use_strict";

    import ajaxify              = imatic.view.ajaxify;
    import jQuery               = imatic.view.ajaxify.jquery.jQuery;

    import ContainerInterface   = imatic.view.ajaxify.container.ContainerInterface;
    import Widget               = imatic.view.ajaxify.widget.Widget;
    import WidgetHandler        = imatic.view.ajaxify.widget.WidgetHandler;
    import ActionInterface      = imatic.view.ajaxify.action.ActionInterface;
    import RequestAction        = imatic.view.ajaxify.action.RequestAction;
    import CssClasses           = imatic.view.ajaxify.css.CssClasses;

    /**
     * Link handler
     */
    export class LinkHandler
    {
        private linkFactory = new LinkFactory();
        private linkTagNames = ['A', 'BUTTON'];

        /**
         * Constructor
         */
        constructor(
            private widgetHandler: WidgetHandler
        ) {}

        /**
         * Validate given element
         */
        isValidElement(element: HTMLElement): boolean {
            if (
                -1 !== this.linkTagNames.indexOf(element.tagName)
                && (
                    jQuery(element).attr('href')
                    || jQuery(element).data('href')
                )
            ) {
                return true;
            } else {
                return false;
            }
        }

        /**
         * Validate given event
         */
        isValidEvent(event: JQueryEventObject): boolean {
            return event.which && 1 == event.which && !event.shiftKey && !event.ctrlKey && !event.metaKey;
        }

        /**
         * Get link instance for given element
         */
        getInstance(element: HTMLElement, containerElement?: HTMLElement): Link {
            var link;

            if (this.widgetHandler.hasInstance(element)) {
                link = this.widgetHandler.getInstance(element);
            } else {
                link = this.linkFactory.create(element, containerElement);
                this.widgetHandler.setInstance(element, link);
            }

            return link;
        }
    }

    /**
     * Link factory
     */
    class LinkFactory
    {
        /**
         * Create a link
         */
        create(element: HTMLElement, containerElement?: HTMLElement): Link {
            var link = new Link(
                element,
                containerElement
            );

            link.url = jQuery(element).attr('href') || jQuery(element).data('href');

            return link;
        }
    }

    /**
     * Link
     */
    export class Link extends Widget
    {
        url: string;

        /**
         * Create action instance
         */
        doCreateAction(config: {[key: string]: any;}): ActionInterface {
            return new RequestAction(this, {
                url: this.url,
                method: config['method'] || 'GET',
                data: null,
                contentSelector: config['contentSelector'] || null,
            });
        }
    }

}
