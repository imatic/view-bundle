/// <reference path="Event.ts"/>
/// <reference path="Jquery.ts"/>
/// <reference path="Dom.ts"/>

/**
 * Imatic view ajaxify modal module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module Imatic.View.Ajaxify.Modal {

    "use_strict";

    import Ajaxify      = Imatic.View.Ajaxify;
    import jQuery       = Imatic.View.Ajaxify.Jquery.jQuery;
    import DomEvents    = Imatic.View.Ajaxify.Dom.DomEvents;

    /**
     * Modal size
     */
    export enum ModalSize {
        SMALL,
        NORMAL,
        LARGE,
        MAX
    }

    /**
     * Modal stack handler
     */
    export class ModalStackHandler
    {
        constructor() {
            jQuery(Ajaxify.domDocument)
                .on('show.bs.modal', this.onModalShow)
                .on('keydown', this.onKeydown)
            ;
        }

        /**
         * Get the topmost modal dialog element
         */
        getTopmostModal(): HTMLElement {
            var modals = jQuery('div.modal', Ajaxify.domDocument.body);

            var topmostIndex = null;
            var topmostZIndex = 0;

            for (var i = 0; i < modals.length; ++i) {
                var zIndex = Number($(modals[i]).css('z-index'));

                if (null === topmostIndex || zIndex > topmostZIndex) {
                    topmostIndex = i;
                    topmostZIndex = zIndex;
                }
            }

            if (null !== topmostIndex) {
                return modals[topmostIndex];
            } else {
                return null;
            }
        }

        /**
         * Handle onModalShow event
         */
        private onModalShow = (event: JQueryEventObject): void => {
            var modal = jQuery(event.target).data('bs.modal');

            if (!modal) {
                // bootstrap-datepicker fires show.bs.modal for some reason
                return;
            }

            // extend the backdrop() method to hook our logic
            // - the logic cannot be right here because the backdrop is not yet initialized
            // - shown.bs.modal cannot be used because it waits for the animations
            var backdropMethod = modal['backdrop'];
            modal['backdrop'] = (): void => {
                this.updateZIndexes();

                backdropMethod.apply(modal, arguments);
            };
        };

        /**
         * Handle keydown event
         */
        private onKeydown = (event: JQueryEventObject): void => {
            if (27 === event.keyCode) {
                var topmostModal = this.getTopmostModal();

                if (topmostModal) {
                    var modal = jQuery(topmostModal).data('bs.modal');
                    
                    if (true === modal.options.backdrop) {
                        jQuery(topmostModal)['modal']('hide');
                    }
                }
            }
        };

        /**
         * Update z-indexes of existing modals
         */
        private updateZIndexes(): void {
            var modals = jQuery('div.modal', Ajaxify.domDocument.body);
            var zIndex = null;

            for (var i = 0; i < modals.length; ++i) {
                var modal = jQuery(modals[i]);
                var modalObj = modal.data('bs.modal');

                if (null === zIndex) {
                    zIndex = Number(modal.css('z-index'));
                } else {
                    zIndex += 10;
                }

                modal.css('z-index', zIndex);

                if (modalObj['$backdrop']) {
                    if (i === modals.length - 1) {
                        modalObj['$backdrop'].css('z-index', zIndex - 5);
                        modalObj['$backdrop'].css('visibility', 'visible');
                    } else {
                        modalObj['$backdrop'].css('visibility', 'hidden');
                    }
                }
            }
        }
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

        constructor() {
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
            var options: {[key: string]: any} = {
                keyboard: false,
            };

            if (!this.closable) {
                options['backdrop'] = 'static';
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

            var dialog = jQuery('div.modal-dialog', this.element);

            dialog
                .removeClass()
                .addClass('modal-dialog')
            ;

            switch (size) {
                case ModalSize.SMALL: dialog.addClass('modal-sm'); break;
                case ModalSize.LARGE: dialog.addClass('modal-lg'); break;
                case ModalSize.MAX: dialog.addClass('modal-max'); break;
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
                .trigger(DomEvents.AFTER_CONTENT_UPDATE)
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
                .trigger(DomEvents.AFTER_CONTENT_UPDATE)
            ;
        }

        /**
         * Create the modal
         */
        private create(): void {
            var html = '<div class="modal fade" role="dialog" aria-labelledby="imatic_view_ajaxify_modal_title_' + this.uid + '" aria-hidden="true">'
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

            this.element = jQuery(html).appendTo(Ajaxify.domDocument.body)[0];

            jQuery(this.element).on('hidden.bs.modal', (): void => {
                this.destroy();
            });
        }
    }

}
