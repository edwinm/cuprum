export declare class Cuprum<T> {
    private val;
    private subscribers;
    private subscribersHot;
    private dispatched;
    private hot;
    private isSubject;
    dispatch(value: T): this;
    subscribe(fn: (value: T, oldValue?: T) => void): Subscription;
    unsubscribe(fn: (value: T, oldValue?: T) => void): void;
    subscribeHot(fn: (value: boolean) => void): {
        unsubscribe: () => void;
    };
    clear(): void;
    value(): T;
    observable(): Observable<T>;
    promise(): Promise<T>;
    map<U>(fn: (val: T) => U): Cuprum<U>;
    filter(fn: (val: T) => boolean): Cuprum<T>;
    private notifyHotSubscribers;
    private subscribeNext;
    private internalDispatch;
}
export declare function fromEvent(element: any, eventType: any): Cuprum<Event>;
export declare function combine<T>(obs1$: Observable<T>): Observable<[T]>;
export declare function combine<T, U>(obs1$: Observable<T>, obs2$: Observable<U>): Observable<[T, U]>;
export declare function combine<T, U, V>(obs1$: Observable<T>, obs2$: Observable<U>, obs3$: Observable<V>): Observable<[T, U, V]>;
export declare function combine<T, U, V, W>(obs1$: Observable<T>, obs2$: Observable<U>, obs3$: Observable<V>, obs4$: Observable<W>): Observable<[T, U, V, W]>;
export declare function combine<T, U, V, W, X>(obs1$: Observable<T>, obs2$: Observable<U>, obs3$: Observable<V>, obs4$: Observable<W>, obs5$: Observable<X>): Observable<[T, U, V, W, X]>;
export declare function combine<T, U, V, W, X, Y>(obs1$: Observable<T>, obs2$: Observable<U>, obs3$: Observable<V>, obs4$: Observable<W>, obs5$: Observable<X>, obs6$: Observable<Y>): Observable<[T, U, V, W, X, Y]>;
export declare function combine<T, U, V, W, X, Y, Z>(obs1$: Observable<T>, obs2$: Observable<U>, obs3$: Observable<V>, obs4$: Observable<W>, obs5$: Observable<X>, obs6$: Observable<Y>, obs7$: Observable<Z>): Observable<[T, U, V, W, X, Y, Z]>;
export declare function merge<T>(obs1$: Observable<T>): Observable<T>;
export declare function merge<T>(obs1$: Observable<T>, obs2$: Observable<T>): Observable<T>;
export declare function merge<T>(obs1$: Observable<T>, obs2$: Observable<T>, obs3$: Observable<T>): Observable<T>;
export declare function merge<T>(obs1$: Observable<T>, obs2$: Observable<T>, obs3$: Observable<T>, obs4$: Observable<T>): Observable<T>;
export declare function merge<T>(obs1$: Observable<T>, obs2$: Observable<T>, obs3$: Observable<T>, obs4$: Observable<T>, obs5$: Observable<T>): Observable<T>;
export declare function merge<T>(obs1$: Observable<T>, obs2$: Observable<T>, obs3$: Observable<T>, obs4$: Observable<T>, obs5$: Observable<T>, obs6$: Observable<T>): Observable<T>;
export declare function merge<T>(obs1$: Observable<T>, obs2$: Observable<T>, obs3$: Observable<T>, obs4$: Observable<T>, obs5$: Observable<T>, obs6$: Observable<T>, obs7$: Observable<T>): Observable<T>;
export declare function interval(msec: any): Cuprum<unknown>;
export declare type Observable<T> = Omit<Cuprum<T>, "dispatch">;
export interface Subscription {
    unsubscribe: () => void;
}
