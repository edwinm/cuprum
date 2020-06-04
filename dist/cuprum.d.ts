export declare class Cuprum<T> {
    private val;
    private subscribers;
    private subscribersHot;
    private dispatched;
    private hot;
    dispatch(value: T): void;
    subscribeNext(fn: (value: T) => void): Subscription;
    subscribe(fn: (value: T, oldValue?: T) => void): Subscription;
    unsubscribe(fn: (value: T, oldValue?: T) => void): void;
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
export declare class Subscription {
    unsubscribe: () => void;
}
export declare function tap(fn: (val: any) => any): any;
export declare function fromEvent(element: any, eventType: any): Cuprum<Event>;
export declare function combine<T, U>(obs1$: Cuprum<T>, obs2$: Cuprum<U>): Cuprum<[T, U]>;
