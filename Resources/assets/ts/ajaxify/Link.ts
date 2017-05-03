import * as Ajaxify from './Ajaxify';
import {ContainerInterface} from './Container';
import {CssClasses} from './Css';
import {RequestInfo} from './Ajax';
import {Widget, WidgetHandler} from './Widget';
import {ActionInterface, RequestAction} from './Action';
import {Url} from './Url';

/**
 * Link handler
 */
export class LinkHandler
{
    private linkFactory = new LinkFactory();
    private linkTagNames = ['A', 'BUTTON'];

    constructor(
        private widgetHandler: WidgetHandler
    ) {}

    /**
     * Validate given element
     */
    isValidElement(element: HTMLElement): boolean {
        return (
            // check tag name
            -1 !== this.linkTagNames.indexOf(element.tagName)
            // ignore links that target frames/new windows
            && (
                !element.hasAttribute('target')
                || '_self' === element.getAttribute('target').toLowerCase()
            )
            // check url/action attributes
            && (
                $(element).attr('href')
                || $(element).data('href')
                || $(element).data('action')
            )
        );
    }

    /**
     * Find valid link element for the given node
     */
    findValidElement(element: HTMLElement): HTMLElement {
        var valid;

        while(!(valid = this.isValidElement(element))) {
            if (element.parentNode && 1 === element.parentNode.nodeType) {
                element = <HTMLElement> element.parentNode;
            } else {
                break;
            }
        }

        return valid ? element : null;
    }

    /**
     * Validate given event
     */
    isValidEvent(event: JQueryEventObject): boolean {
        return (
            event.which
            && 1 == event.which
            && !event.shiftKey
            && !event.ctrlKey
            && !event.metaKey
        );
    }

    /**
     * Get link instance for given element
     */
    getInstance(element: HTMLElement): Link {
        var link;

        if (this.widgetHandler.hasInstance(element)) {
            link = this.widgetHandler.getInstance(element);
        } else {
            link = this.linkFactory.create(element);
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
    create(element: HTMLElement): Link {
        return new Link(element);
    }
}

/**
 * Link
 */
export class Link extends Widget
{
    doCreateActions(): ActionInterface[] {
        var actions = [];

        var actionString = this.getOption('action');

        if (actionString) {
            // use action string
            $.merge(actions, Ajaxify.actionHelper.parseActionString(actionString, this));
        } else {
            // use URL from href or data-href
            var url = $(this.element).attr('href') || $(this.element).data('href');

            if (typeof url !== 'undefined') {
                var parsedUrl = new Url(url);

                // ignore external, non-HTTP URLS and anchor links
                if (parsedUrl.isLocal() && parsedUrl.isHttp() && '#' !== url.charAt(0)) {
                    actions.push(new RequestAction(
                        this,
                        new RequestInfo(
                            url,
                            this.getOption('method') || 'GET',
                            null,
                            this.getOption('contentSelector') || null
                        )
                    ));
                }
            }
        }

        return actions;
    }
}
