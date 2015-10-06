import * as Ajaxify from './Ajaxify';
import {ContainerInterface} from './Container';
import {CssClasses} from './Css';
import {RequestInfo} from './Ajax';
import {Widget, WidgetHandler} from './Widget';
import {ActionInterface, RequestAction} from './Action';

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
        var link = new Link(element);

        link.url = $(element).attr('href') || $(element).data('href');

        return link;
    }
}

/**
 * Link
 */
export class Link extends Widget
{
    url: string;

    doCreateActions(): ActionInterface[] {
        var actions = [];

        var actionString = this.getOption('action');

        if (actionString) {
            $.merge(actions, Ajaxify.actionHelper.parseActionString(actionString, this));
        }

        if (this.url) {
            actions.push(new RequestAction(
                this,
                new RequestInfo(
                    this.url,
                    this.getOption('method') || 'GET',
                    null,
                    this.getOption('contentSelector') || null
                )
            ));
        }

        return actions;
    }
}
