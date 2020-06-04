export { Cuprum, tap, fromEvent };
declare class Cuprum<T> {
    private val;
    private subscribers;
    private subscribersHot;
    private dispatched;
    private hot;
    dispatch(value: T): void;
    subscribeNext(fn: (value: T) => void): Subscription;
    subscribe(fn: (value: T) => void): Subscription;
    unsubscribe(fn: (value: T) => void): void;
    private notifyHotSubscribers;
    subscribeHot(fn: (value: boolean) => void): {
        unsubscribe: () => void;
    };
    clear(): void;
    value(): T;
    promise(): Promise<T>;
    map<U>(fn: (val: T) => U): Cuprum<U>;
    filter(fn: (val: T) => boolean): Cuprum<T>;
}
declare class Subscription {
    unsubscribe: () => void;
}
declare function tap(fn: (val: any) => any): any;
declare function fromEvent(element: any, eventType: any): Cuprum<Event>;
