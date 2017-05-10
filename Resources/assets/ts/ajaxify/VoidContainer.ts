import {Container, ContainerInterface, ContainerHandler, TargetHandlerInterface} from './Container';

/**
 * Void container handler
 * Creates and manages void container instances
 */
export class VoidContainerHandler implements TargetHandlerInterface
{
    constructor(
        private containerHandler: ContainerHandler
    ) {}

    supports(target: string, element?: HTMLElement): boolean {
        return 'void' === target;
    }

    findContainer(target: string, element?: HTMLElement): ContainerInterface {
        return new VoidContainer(this.containerHandler, null);
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
