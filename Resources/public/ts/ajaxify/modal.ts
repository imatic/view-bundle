/// <reference path="event.ts"/>

/**
 * Imatic view ajaxify modal module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module imatic.view.ajaxify.modal {

    "use_strict";

    import DomEvents = imatic.view.ajaxify.event.DomEvents;

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
        constructor(
            private jQuery: any,
            private document: HTMLDocument
        ) {
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
            var footer = this.jQuery(this.getFooterElement());
            if (footer.is(':empty')) {
                footer.hide();
            } else {
                footer.show();
            }

            // toggle header
            var title = this.jQuery(this.getTitleElement());
            var header = this.jQuery(this.getHeaderElement());
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

            this.jQuery(this.element).modal(options);
        }

        /**
         * Hide the modal
         */
        hide(): void {
            if (this.element) {
                this.jQuery(this.element).modal('hide');
            }
        }

        /**
         * Destroy the modal
         */
        destroy(): void {
            if (this.element) {
                this.jQuery(this.element).remove();
                this.element = null;
            }
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
            var dialog = this.jQuery('div.modal-dialog', this.element);

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

            var closeButton = this.jQuery('div.modal-header > button.close', this.element);
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

            return this.jQuery('div.modal-header', this.element).get(0);
        }

        /**
         * Get modal's title element
         */
        getTitleElement(): HTMLElement {
            if (!this.element) {
                this.create();
            }

            return this.jQuery('div.modal-header > h4.modal-title', this.element).get(0);
        }

        /**
         * Set modal's title
         */
        setTitle(title: string): void {
            this.jQuery(this.getTitleElement())
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

            return this.jQuery('div.modal-body', this.element).get(0);
        }

        /**
         * Set modal's body content
         */
        setBody(content: any): void {
            this.jQuery(this.getBodyElement())
                .trigger(DomEvents.ON_BEFORE_CONTENT_UPDATE)
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

            return this.jQuery('div.modal-footer', this.element).get(0);
        }

        /**
         * Set modal's footer content
         */
        setFooter(content: any): void {
            var footer = this.jQuery(this.getFooterElement());

            footer
                .trigger(DomEvents.ON_BEFORE_CONTENT_UPDATE)
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

            this.element = this.jQuery(html, this.document).appendTo(this.document.body)[0];

            this.jQuery(this.element).on('hidden.bs.modal', (): void => {
                this.destroy();
            });
        }
    }

}
