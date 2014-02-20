/// <reference path="jquery.ts"/>

/**
 * Imatic view ajaxify html module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module imatic.view.ajaxify.html {

    "use_strict";

    import jQuery = imatic.view.ajaxify.jquery.jQuery;

    /**
     * HTML fragment
     */
    export class HtmlFragment
    {
        private dom: any;

        /**
         * Constructor
         */
        constructor(html: string, jQuery: any) {
            this.dom = jQuery('<div />')
                .append(jQuery.parseHTML(html))
            ;
        }

        /**
         * Get the root element
         */
        root(): any {
            return this.dom;
        }

        /**
         * Get all elements
         */
        all(): any {
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
        find(selector: string): any {
            return this.dom.find(selector);
        }
    }

}
