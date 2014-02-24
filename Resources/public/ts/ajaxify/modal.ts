/// <reference path="event.ts"/>
/// <reference path="jquery.ts"/>

/**
 * Imatic view ajaxify modal module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module imatic.view.ajaxify.modal {

    "use_strict";

    import DomEvents = imatic.view.ajaxify.event.DomEvents;
    import jQuery    = imatic.view.ajaxify.jquery.jQuery;

    /**
     * Modal size
     */
    export enum ModalSize {
        SMALL,
        NORMAL,
        LARGE
    }

    /**
     * Modal
     */
    export class Modal
    {
        static uidCounter = 0;
        private element: HTMLElement;
        private uid: number;
        private closable: boolean = true;

        /**
         * Constructor
         */
        constructor(private document: HTMLDocument) {
            this.uid = ++Modal.uidCounter;
        }

        /**
         * Show the modal
         */
        show(): void {
            if (!this.element) {
                this.create();
            }

            // toggle footer
            var footer = jQuery(this.getFooterElement());
            if (footer.is(':empty')) {
                footer.hide();
            } else {
                footer.show();
            }

            // toggle header
            var title = jQuery(this.getTitleElement());
            var header = jQuery(this.getHeaderElement());
            if (title.is(':empty')) {
                header.hide();
            } else {
                header.show();
            }

            // options
            var options: {[key: string]: any} = {};

            if (!this.closable) {
                options['backdrop'] = 'static';
                options['keyboard'] = false;
            }

            jQuery(this.element)['modal'](options);
        }

        /**
         * Hide the modal
         */
        hide(): void {
            if (this.element) {
                jQuery(this.element)['modal']('hide');
            }
        }

        /**
         * Destroy the modal
         */
        destroy(): void {
            if (this.element) {
                var element = this.element;
                this.element = null;

                jQuery(element)
                    .trigger(DomEvents.BEFORE_CONTENT_UPDATE)
                    .remove()
                ;
            }
        }

        /**
         * See if the modal has an existing DOM element
         */
        hasElement(): boolean {
            return this.element ? true : false;
        }

        /**
         * Get modal's element
         */
        getElement(): HTMLElement {
            if (!this.element) {
                this.create();
            }

            return this.element;
        }

        /**
         * Set modal's size
         */
        setSize(size: ModalSize): void {
            if (!this.element) {
                this.create();
            }

            var smallClass = 'modal-sm';
            var largeClass = 'modal-lg';
            var dialog = jQuery('div.modal-dialog', this.element);

            switch (size) {
                case ModalSize.SMALL:
                      dialog
                        .removeClass(largeClass)
                        .addClass(smallClass)
                    ;
                    break;
                case ModalSize.NORMAL:
                    dialog
                        .removeClass(smallClass)
                        .removeClass(largeClass)
                    ;
                    break;
                case ModalSize.LARGE:
                    dialog
                        .removeClass(smallClass)
                        .addClass(largeClass)
                    ;
                    break;
            }
        }

        /**
         * Set modal's closable state
         */
        setClosable(closable: boolean): void {
            if (!this.element) {
                this.create();
            }

            this.closable = closable;

            var closeButton = jQuery('div.modal-header > button.close', this.element);
            if (closable) {
                closeButton.show();
            } else {
                closeButton.hide();
            }
        }

        /**
         * Get modal's header element
         */
        getHeaderElement(): HTMLElement {
            if (!this.element) {
                this.create();
            }

            return jQuery('div.modal-header', this.element).get(0);
        }

        /**
         * Get modal's title element
         */
        getTitleElement(): HTMLElement {
            if (!this.element) {
                this.create();
            }

            return jQuery('div.modal-header > h4.modal-title', this.element).get(0);
        }

        /**
         * Set modal's title
         */
        setTitle(title: string): void {
            jQuery(this.getTitleElement())
                .text(title)
            ;
        }

        /**
         * Get modal's body element
         */
        getBodyElement(): HTMLElement {
            if (!this.element) {
                this.create();
            }

            return jQuery('div.modal-body', this.element).get(0);
        }

        /**
         * Set modal's body content
         */
        setBody(content: any): void {
            jQuery(this.getBodyElement())
                .trigger(DomEvents.BEFORE_CONTENT_UPDATE)
                .empty()
                .append(content)
            ;
        }

        /**
         * Get modal's footer element
         */
        getFooterElement(): HTMLElement {
            if (!this.element) {
                this.create();
            }

            return jQuery('div.modal-footer', this.element).get(0);
        }

        /**
         * Set modal's footer content
         */
        setFooter(content: any): void {
            var footer = jQuery(this.getFooterElement());

            footer
                .trigger(DomEvents.BEFORE_CONTENT_UPDATE)
                .empty()
                .append(content)
            ;
        }

        /**
         * Create the modal
         */
        private create(): void {
            var html = '<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="imatic_view_ajaxify_modal_title_' + this.uid + '" aria-hidden="true">'
                + '<div class="modal-dialog">'
                    + '<div class="modal-content">'
                        + '<div class="modal-header">'
                            + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
                            + '<h4 class="modal-title" id="imatic_view_ajaxify_modal_title_' + this.uid + '"></h4>'
                        + '</div>'
                        + '<div class="modal-body"></div>'
                        + '<div class="modal-footer"></div>'
                    + '</div>'
                + '</div>'
                + '</div>'
            ;

            this.element = jQuery(html, this.document).appendTo(this.document.body)[0];

            jQuery(this.element).on('hidden.bs.modal', (): void => {
                this.destroy();
            });
        }
    }

}
