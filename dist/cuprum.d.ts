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
export declare function tap(fn: (val: any) => any): any;
export declare function fromEvent(element: any, eventType: any): Cuprum<Event>;
export declare function combine<T>(obs1$: Cuprum<T>): Cuprum<[T]>;
export declare function combine<T, U>(obs1$: Cuprum<T>, obs2$: Cuprum<U>): Cuprum<[T, U]>;
export declare function combine<T, U, V>(obs1$: Cuprum<T>, obs2$: Cuprum<U>, obs3$: Cuprum<V>): Cuprum<[T, U, V]>;
export declare function combine<T, U, V, W>(obs1$: Cuprum<T>, obs2$: Cuprum<U>, obs3$: Cuprum<V>, obs4$: Cuprum<W>): Cuprum<[T, U, V, W]>;
export declare function combine<T, U, V, W, X>(obs1$: Cuprum<T>, obs2$: Cuprum<U>, obs3$: Cuprum<V>, obs4$: Cuprum<W>, obs5$: Cuprum<X>): Cuprum<[T, U, V, W, X]>;
export declare function combine<T, U, V, W, X, Y>(obs1$: Cuprum<T>, obs2$: Cuprum<U>, obs3$: Cuprum<V>, obs4$: Cuprum<W>, obs5$: Cuprum<X>, obs6$: Cuprum<Y>): Cuprum<[T, U, V, W, X, Y]>;
export declare function combine<T, U, V, W, X, Y, Z>(obs1$: Cuprum<T>, obs2$: Cuprum<U>, obs3$: Cuprum<V>, obs4$: Cuprum<W>, obs5$: Cuprum<X>, obs6$: Cuprum<Y>, obs7$: Cuprum<Z>): Cuprum<[T, U, V, W, X, Y, Z]>;
interface Subscription {
    unsubscribe: () => void;
}
export {};
