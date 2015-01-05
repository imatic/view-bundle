/// <reference path="configuration.ts"/>
/// <reference path="event.ts"/>
/// <reference path="container.ts"/>
/// <reference path="action.ts"/>
/// <reference path="form.ts"/>
/// <reference path="modal.ts"/>

/**
 * Imatic view ajaxify void container module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module imatic.view.ajaxify.voidContainer {

    "use_strict";

    import ajaxify                  = imatic.view.ajaxify;
    import ContainerInterface       = imatic.view.ajaxify.container.ContainerInterface;
    import Container                = imatic.view.ajaxify.container.Container;
    import ContainerHandler         = imatic.view.ajaxify.container.ContainerHandler;
    import TargetHandlerInterface   = imatic.view.ajaxify.container.TargetHandlerInterface;

    /**
     * Void container handler
     * Creates and manages void container instances
     */
    export class VoidContainerHandler implements TargetHandlerInterface
    {
        constructor(
            private containerHandler: ContainerHandler
        ) {}

        supports(target: string, element: HTMLElement): boolean {
            return 'void' === target;
        }

        findContainer(target: string, element: HTMLElement): ContainerInterface {
            var container;

            if (this.containerHandler.hasInstance(element)) {
                container = this.containerHandler.getInstance(element);
            } else {
                container = new VoidContainer(this.containerHandler, null);
                this.containerHandler.setInstance(element, container);
            }

            return container;
        }
    }

    /**
     * Void container
     */
    export class VoidContainer extends Container
    {
        setContent(content: any): void {
        }
    }

}
