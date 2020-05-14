import * as Ajaxify from './Ajaxify';
import {DomEvents} from './Dom';
import {EventDispatcher, Event} from './Event';

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
        $(document)
            .on('show.bs.modal', this.onModalShow)
            .on('hidden.bs.modal', this.onModalHide)
            .on('keydown', this.onKeydown)
        ;
    }

    /**
     * Get the topmost modal dialog element
     */
    getTopmostModal(): HTMLElement {
        var modals = $('div.modal', document.body);

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
            return modals[topmostIndex] as HTMLElement;
        } else {
            return null;
        }
    }

    /**
     * Handle onModalShow event
     */
    private onModalShow = (event: JQueryEventObject): void => {
        var modal = $(event.target).data('bs.modal');

        // check if this event is valid
        // (other components - such as bootstrap datepicker - fire this event as well)
        if (modal) {
            // extend the backdrop() method to hook our logic
            // - the logic cannot be right here because the backdrop is not yet initialized
            // - shown.bs.modal cannot be used because it waits for the animations
            var backdropMethod = modal['backdrop'];
            var that = this;
            modal['backdrop'] = function () {
                backdropMethod.apply(modal, arguments);

                that.updateModals();
            };
        }
    };

    private onModalHide = (event: JQueryEventObject): void => {
        this.updateModals();
    };

    /**
     * Handle keydown event
     */
    private onKeydown = (event: JQueryEventObject): void => {
        if (27 === event.keyCode) {
            var topmostModal = this.getTopmostModal();

            if (topmostModal) {
                var modal = $(topmostModal).data('bs.modal');

                if (true === modal.options.backdrop) {
                    $(topmostModal)['modal']('hide');
                }
            }
        }
    };

    /**
     * Update existing modals
     */
    private updateModals(): void {
        var modals = $('div.modal', document.body);
        var zIndex = null;

        for (var i = 0; i < modals.length; ++i) {
            var modal = $(modals[i]);
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
                    modalObj['$backdrop'].addClass('in');
                } else {
                    modalObj['$backdrop'].removeClass('in');
                }
            }
        }

        if (modals.length > 0) {
            $(document.body).addClass('modal-open');
        } else {
            $(document.body).removeClass('modal-open');
        }
    }
}

/**
 * Modal
 */
export class Modal extends EventDispatcher
{
    static uidCounter = 0;

    private element: HTMLElement;
    private uid: number;
    private closable: boolean = true;

    constructor() {
        super();

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
        var footer = $(this.getFooterElement());
        if (footer.is(':empty')) {
            footer.hide();
        } else {
            footer.show();
        }

        // toggle header
        var title = $(this.getTitleElement());
        var header = $(this.getHeaderElement());
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

        $(this.element)['modal'](options);
    }

    /**
     * Hide the modal
     */
    hide(): void {
        if (this.element) {
            $(this.element)['modal']('hide');
        }
    }

    /**
     * Destroy the modal
     */
    destroy(): void {
        if (this.element) {
            var element = this.element;
            this.element = null;

            $(element)
                .trigger(DomEvents.BEFORE_CONTENT_UPDATE)
                .remove()
            ;

            this.dispatch('destroyed', new ModalEvent(this));
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

        var dialog = $('div.modal-dialog', this.element);

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

        var closeButton = $('div.modal-header > button.close', this.element);
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

        return $('div.modal-header', this.element).get(0) as HTMLElement;
    }

    /**
     * Get modal's title element
     */
    getTitleElement(): HTMLElement {
        if (!this.element) {
            this.create();
        }

        return $('div.modal-header > h4.modal-title', this.element).get(0) as HTMLElement;
    }

    /**
     * Set modal's title
     */
    setTitle(title: string): void {
        $(this.getTitleElement())
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

        return $('div.modal-body', this.element).get(0) as HTMLElement;
    }

    /**
     * Set modal's body content
     */
    setBody(content: any): void {
        $(this.getBodyElement())
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

        return $('div.modal-footer', this.element).get(0) as HTMLElement;
    }

    /**
     * Set modal's footer content
     */
    setFooter(content: any): void {
        var footer = $(this.getFooterElement());

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
        var html = '<div tabindex="-1" class="modal fade" role="dialog" aria-labelledby="imatic_view_ajaxify_modal_title_' + this.uid + '" aria-hidden="true">'
            + '<div class="modal-dialog">'
                + '<div class="modal-content">'
                    + '<div class="modal-header">'
                        + '<h4 class="modal-title" id="imatic_view_ajaxify_modal_title_' + this.uid + '"></h4>'
                        + '<button type="button" class="close" data-dismiss="modal" aria-label="Close">'
                            + '<span aria-hidden="true">&times;</span>'
                        + '</button>'
                    + '</div>'
                    + '<div class="modal-body"></div>'
                    + '<div class="modal-footer"></div>'
                + '</div>'
            + '</div>'
            + '</div>'
        ;

        this.element = $(html).appendTo(document.body)[0] as HTMLElement;

        $(this.element).on('hidden.bs.modal', (): void => {
            this.destroy();
        });

        this.dispatch('created', new ModalEvent(this));
    }
}

/**
 * Modal event
 */
export class ModalEvent extends Event
{
    constructor(public modal: Modal) {
        super();
    }
}
