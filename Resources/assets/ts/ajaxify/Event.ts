/**
 * Event dispatcher interface
 */
export interface EventDispatcherInterface
{
    /**
     * Add a callback
     */
    addCallback: (eventName: string, callback: ListenerCallbackInterface, priority?: number) => void;

    /**
     * Remove a callback
     */
    removeCallback: (eventName: string, callback: ListenerCallbackInterface) => void;

    /**
     * Add a listener
     */
    addListener: (eventName: string, listener: ListenerInterface) => void;

    /**
     * Remove a listener
     */
    removeListener: (eventName: string, listener: ListenerInterface) => void;

    /**
     * Emit an event
     */
    emit: (event: EventInterface) => EventInterface;

    /**
     * Dispatch an event
     */
    dispatch: (eventName: string, event?: EventInterface) => EventInterface;
}

/**
 * Event interface
 */
export interface EventInterface
{
    name: string;

    /**
     * Stop event propagation
     */
    stopPropagation: () => void;

    /**
     * See if event propagation is stopped
     */
    isPropagationStopped: () => boolean;
}

/**
 * Listener callback interface
 */
export interface ListenerCallbackInterface
{
    (event: EventInterface): void;
}

/**
 * Listener interface
 */
export interface ListenerInterface
{
    callback: ListenerCallbackInterface;
    priority: number;
}

/**
 * Event
 */
export class Event implements EventInterface
{
    name: string;
    private propagationStopped = false;

    stopPropagation(): void {
        this.propagationStopped = true;
    }

    isPropagationStopped(): boolean {
        return this.propagationStopped;
    }
}

/**
 * Event dispatcher
 */
export class EventDispatcher implements EventDispatcherInterface
{
    private listeners = new ListenerCollection();

    addCallback(eventName: string, callback: ListenerCallbackInterface, priority: number = 0): void {
        this.listeners.add(eventName, new Listener(callback, priority));
    }

    removeCallback(eventName: string, callback: ListenerCallbackInterface): void {
        this.listeners.removeCallback(eventName, callback);
    }

    addListener(eventName: string, listener: ListenerInterface): void {
        this.listeners.add(eventName, listener);
    }

    removeListener(eventName: string, listener: ListenerInterface): void {
        this.listeners.remove(eventName, listener);
    }

    emit(event: EventInterface): EventInterface {
        var eventListeners = this.listeners.get(event.name);
        for (var i = 0; i < eventListeners.length; ++i) {
            eventListeners[i].callback(event);

            if (event.isPropagationStopped()) {
                break;
            }
        }

        return event;
    }

    dispatch(eventName: string, event?: EventInterface): EventInterface {
        if (!event) {
            event = new Event();
        }
        event.name = eventName;

        return this.emit(event);
    }
}

/**
 * Listener
 */
class Listener implements ListenerInterface
{
    constructor(
        public callback: ListenerCallbackInterface,
        public priority: number
    ) {}
}

/**
 * Listener collection
 */
class ListenerCollection
{
    private listeners: {[eventName: string]: ListenerInterface[]} = {};
    private sortStates: {[eventName: string]: boolean} = {};

    /**
     * See if there are any listeners
     */
    has(eventName: string): boolean {
        return undefined !== this.listeners[eventName];
    }

    /**
     * Get listeners
     */
    get(eventName: string): ListenerInterface[] {
        if (this.has(eventName)) {
            if (!this.sortStates[eventName]) {
                this.sortListeners(eventName);
            }

            return this.listeners[eventName];
        } else {
            return [];
        }
    }

    /**
     * Add listener
     */
    add(eventName: string, listener: ListenerInterface): void {
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = [];
        }

        this.listeners[eventName].push(listener);
        delete this.sortStates[eventName];
    }

    /**
     * Remove listener
     */
    remove(eventName: string, listener: ListenerInterface): void {
        if (this.has(eventName)) {
            for (var i = 0; i < this.listeners[eventName].length; ++i) {
                if (this.listeners[eventName][i] === listener) {
                    this.listeners[eventName].splice(i, 1);
                    break;
                }
            }
        }
    }

    /**
     * Remove listener by callback
     */
    removeCallback(eventName: string, listenerCallback: ListenerCallbackInterface): void {
        if (this.has(eventName)) {
            for (var i = 0; i < this.listeners[eventName].length; ++i) {
                if (this.listeners[eventName][i].callback === listenerCallback) {
                    this.listeners[eventName].splice(i, 1);
                    break;
                }
            }
        }
    }

    /**
     * Sort listeners by priority
     */
    private sortListeners(eventName: string): void
    {
        this.listeners[eventName].sort(function (a: ListenerInterface, b: ListenerInterface): number {
            return b.priority - a.priority;
        });

        this.sortStates[eventName] = true;
    }
}
