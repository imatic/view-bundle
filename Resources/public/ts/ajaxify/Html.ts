/// <reference path="Jquery.ts"/>

/**
 * Imatic view ajaxify html module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module Imatic.View.Ajaxify.Html {

    "use_strict";

    import jQuery = Imatic.View.Ajaxify.Jquery.jQuery;

    /**
     * HTML fragment
     */
    export class HtmlFragment
    {
        private dom: any;

        constructor(html: string) {
            this.dom = jQuery('<div />')
                .append(jQuery.parseHTML(html, null, true))
            ;
        }

        /**
         * Get the root element
         */
        root(): JQuery {
            return this.dom;
        }

        /**
         * Get all elements
         */
        all(): JQuery {
            return this.dom.contents();
        }

        /**
         * See if the DOM contains element(s) matching given selector
         */
        contains(selector: string): boolean {
            return this.dom.find(selector).length > 0;
        }

        /**
         * Get set of elements matching given selector
         */
        find(selector: string): JQuery {
            return this.dom.find(selector);
        }
    }

}
