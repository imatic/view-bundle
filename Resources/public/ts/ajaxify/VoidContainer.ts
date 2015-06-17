/// <reference path="Configuration.ts"/>
/// <reference path="Event.ts"/>
/// <reference path="Container.ts"/>
/// <reference path="Action.ts"/>
/// <reference path="Form.ts"/>
/// <reference path="Modal.ts"/>

/**
 * Imatic view ajaxify void container module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module Imatic.View.Ajaxify.VoidContainer {

    "use_strict";

    import ajaxify                  = Imatic.View.Ajaxify;
    import ContainerInterface       = Imatic.View.Ajaxify.Container.ContainerInterface;
    import Container                = Imatic.View.Ajaxify.Container.Container;
    import ContainerHandler         = Imatic.View.Ajaxify.Container.ContainerHandler;
    import TargetHandlerInterface   = Imatic.View.Ajaxify.Container.TargetHandlerInterface;

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
