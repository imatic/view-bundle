import * as Ajaxify from './Ajaxify';
import {DomEvents} from './Dom';
import {EventInterface} from './Event';
import {Response} from './Ajax';
import {Modal, ModalSize} from './Modal';
import {ConfigurationInterface, ConfigurationProcessorInterface} from './Configuration';
import {Container, ContainerInterface, ContainerHandler, ContainerNotFoundException, TargetHandlerInterface} from './Container';
import {Action, ActionInterface, ActionEvent, RequestAction, ResponseAction} from './Action';
import {WidgetInterface, WidgetHandler} from './Widget';
import {Form} from './Form';

/**
 * Modal configuration defaults
 */
export var ModalConfigurationDefaults: ConfigurationInterface = {
    modalSize: ModalSize.NORMAL,
    modalClosable: true,
    modalTitle: '',
    modalFooter: '',
    modalOnClose: '',
    modalOnCloseMod: '',
    modalCloseOnFormSuccess: true,
    modalForwardFormResponse: true
};

/**
 * Modal configuration processor
 */
export class ModalConfigurationProcessor implements ConfigurationProcessorInterface
{
    process(data: ConfigurationInterface): void {
        if ('string' === typeof data['modalSize']) {
            data['modalSize'] = ModalSize[data['modalSize'].toUpperCase()];
        }
    }
}

/**
 * Modal container handler
 * Creates and manages modal container instances
 */
export class ModalContainerHandler implements TargetHandlerInterface
{
    private containerFactory = new ModalContainerFactory(
        this.containerHandler,
        this.widgetHandler
    );

    constructor(
        private containerHandler: ContainerHandler,
        private widgetHandler: WidgetHandler
    ) {}

    supports(target: string, element?: HTMLElement): boolean {
        return 'modal' === target && null != element;
    }

    findContainer(target: string, element?: HTMLElement): ContainerInterface {
        return this.containerFactory.create(element);
    }
}

/**
 * Modal container factory
 */
class ModalContainerFactory
{
    constructor(
        private containerHandler: ContainerHandler,
        private widgetHandler: WidgetHandler
    ) {}

    /**
     * Create container instance
     */
    create(trigger: HTMLElement): ContainerInterface {
        var container = new ModalContainer(
            this.containerHandler,
            null
        );

        if (this.widgetHandler.hasInstance(trigger)) {
            container.originalTrigger = this.widgetHandler.getInstance(trigger);
        }

        return container;
    }
}

/**
 * Modal container
 */
export class ModalContainer extends Container
{
    originalTrigger: WidgetInterface;

    private modal: Modal;
    private actionInitiator: WidgetInterface;
    private responseTitle: string;
    private resendResponse: Response;
    private performedNonGetRequests: boolean = false;

    constructor(
        containerHandler: ContainerHandler,
        element: HTMLElement = null
    ) {
        super(containerHandler, element);

        this.modal = new Modal();

        // perform additional tasks when the modal is actually created
        this.modal.addCallback('created', (event: EventInterface) => {
            this.onModalCreated();
        });
    }

    getModal(): Modal {
        return this.modal;
    }

    private onModalCreated() {
        var modalElement = this.modal.getElement();

        // remember if any non-GET requests happened within the modal
        $(modalElement).on(DomEvents.ACTION_COMPLETE, (event: JQueryEventObject) => {
            var actionEvent = <ActionEvent> event['actionEvent'];

            if (actionEvent.response && 'GET' !== actionEvent.response.request.method) {
                this.performedNonGetRequests = true;
            }
        });

        // redirect action start/complete events through the original trigger
        $(modalElement).on(DomEvents.ACTION_START + ' ' + DomEvents.ACTION_COMPLETE, (event: JQueryEventObject) => {
            if (this.originalTrigger) {
                event.stopPropagation();

                $(this.originalTrigger.getElement()).trigger(
                    $.Event(event.type + '.' + event.namespace, {
                        container: event['container'],
                        actionEvent: event['actionEvent'],
                    })
                );
            }
        });
    }

    loadOptions(): ConfigurationInterface {
        return (this.originalTrigger
            ? this.originalTrigger.getOptions()
            : Ajaxify.configBuilder.buildFromData({})
        );
    }

    destroy(): void {
        if (this.modal.hasElement()) {
            this.modal.destroy();
        }

        if (this.originalTrigger) {
            this.executeOnClose(
                this.originalTrigger,
                <string> this.originalTrigger.getOption('modalOnClose'),
                <string> this.originalTrigger.getOption('modalOnCloseMod')
            );
        }

        super.destroy();
    }

    /**
     * Execute on close action
     */
    private executeOnClose(originalTrigger: WidgetInterface, onClose?: string, onCloseMod?: string) {
        var actions;

        if (onCloseMod && this.performedNonGetRequests) {
            // perform on close actions (only when a non-GET request has been made within the modal)
            actions = Ajaxify.actionHelper.parseActionString(onCloseMod, originalTrigger);
        } else if (onClose) {
            // perform on close actions
            actions = Ajaxify.actionHelper.parseActionString(onClose, originalTrigger);
        } else if (this.resendResponse) {
            // resend response
            this.resendResponse.flashes = [];
            actions = [new ResponseAction(originalTrigger, this.resendResponse)];
            this.resendResponse = null;
        }

        if (actions && actions.length > 0) {
            $(originalTrigger.getElement()).trigger(
                $.Event(DomEvents.ACTIONS, {actions: actions})
            );
        }
    }

    handleAction(action: ActionInterface): void {
        action.listen('begin', (event: ActionEvent): void => {
            var options = this.getOptions();

            if (event.request) {
                var requestInfo = event.request.getInfo();

                requestInfo.headers['X-Modal-Dialog'] = '1';
                if (options['modalCloseOnFormSuccess'] && !options['modalForwardFormResponse']) {
                    requestInfo.headers['X-Prefer-No-Redirects'] = '1';
                }
            }

            this.actionInitiator = event.action.getInitiator();

            // dom event
            var eventTarget = this.getElement() || this.originalTrigger.getElement();
            if (eventTarget) {
                $(eventTarget).trigger(
                    $.Event(DomEvents.ACTION_START, {
                        container: this,
                        actionEvent: event,
                    })
                );
            }
        });

        action.listen('apply', (event: ActionEvent): void => {
            if (event.response && event.response.valid) {
                this.responseTitle = event.response.title || null;
                this.resendResponse = null;

                // handle successful form submit
                if (
                    event.response.successful
                    && this.actionInitiator instanceof Form
                    && $(this.modal.getElement()).has(this.actionInitiator.getElement()).length > 0
                ) {
                    // close on form success
                    if (this.getOption('modalCloseOnFormSuccess')) {
                        // store response for resend
                        if (this.getOption('modalForwardFormResponse')) {
                            this.resendResponse = event.response;
                        }

                        // stop the action and close
                        event.proceed = false;
                        this.modal.hide();
                    }
                }
            }
        });

        super.handleAction(action);
    }

    getElement(): HTMLElement {
        if (this.modal.hasElement()) {
            return this.modal.getElement();
        }
    }

    setContent(content: JQuery): void {
        if (!this.actionInitiator) {
            throw new Error('Cannot set content when action initiator is not yet known');
        }
        var options = (this.originalTrigger ? this.originalTrigger: this.actionInitiator).getOptions();

        var title = '';
        var footer = null;

        // configure modal
        this.modal.setSize(options['modalSize']);
        this.modal.setClosable(options['modalClosable']);

        // find title
        var titleElement;
        if (options['modalTitle'] && 'none' !== options['modalTitle']) {
            titleElement = $(options['modalTitle'], content).get(0);
            if (titleElement) {
                title = $(titleElement).text();
                $(titleElement).remove();
            }
        }

        // use response title
        if ('' === title && !options['modalTitle'] && this.responseTitle) {
            title = this.responseTitle;
        }

        // find footer
        if (options['modalFooter']) {
            footer = $(options['modalFooter'], content);
            if (footer.length > 0) {
                footer.detach();
            } else {
                footer = null;
            }
        }

        // attach container instance to the modal's element
        var modalElement = this.modal.getElement();
        if (!this.containerHandler.hasInstance(modalElement)) {
            $(modalElement).attr('data-role', 'container');
            this.containerHandler.setInstance(modalElement, this);
        }

        // set contents
        this.modal.setTitle(title);
        this.modal.setFooter(footer ? footer.contents() : null);
        this.modal.setBody(content.contents());

        // show the modal
        this.modal.show();
    }

    getParent(): ContainerInterface {
        if (this.originalTrigger) {
            try {
                return this.containerHandler.findInstanceForElement(<HTMLElement> this.originalTrigger.getElement().parentNode, false);
            } catch (e) {
                if (!(e instanceof ContainerNotFoundException)) {
                    throw e;
                }
            }
        }

        return null;
    }
}

/**
 * Close modal action
 */
export class CloseModalAction extends Action
{
    static keywordHandler = (initiator: WidgetInterface): ActionInterface => {
        return new CloseModalAction(initiator);
    };

    supports(container: ContainerInterface): boolean {
        return container instanceof ModalContainer;
    }

    doExecute(container: ContainerInterface): JQueryPromise<any> {
        (<ModalContainer> container).getModal().hide();

        return $.Deferred().resolve().promise();
    }
}
