/**
 cuprum 0.1.17
 @copyright 2023 Edwin Martin <edwin@bitstorm.org>
 @license MIT
 */
export declare class Cuprum<T> {
    private val;
    private subscribers;
    private subscribersHot;
    private dispatched;
    private hot;
    private isSubject;
    dispatch(value: T): Cuprum<T>;
    subscribe(fn: (value: T, oldValue?: T) => void): Subscription;
    unsubscribe(fn: (value: T, oldValue?: T) => void): void;
    subscribeHot(fn: (value: boolean) => void): Subscription;
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
export declare function fromEvent<K extends keyof WindowEventMap>(element: Window, eventType: K, options?: boolean | AddEventListenerOptions): Cuprum<WindowEventMap[K]>;
export declare function fromEvent<K extends keyof DocumentEventMap>(element: Document, eventType: K, options?: boolean | AddEventListenerOptions): Cuprum<DocumentEventMap[K]>;
export declare function fromEvent<K extends keyof HTMLElementEventMap>(element: HTMLElement, eventType: K, options?: boolean | AddEventListenerOptions): Cuprum<HTMLElementEventMap[K]>;
export declare function fromCustomEvent(element: HTMLElement | Document | Window, eventType: string, options?: boolean | AddEventListenerOptions): Cuprum<unknown>;
export declare function combine<T>(obs1$: Observable<T>): Observable<[T]>;
export declare function combine<T, U>(obs1$: Observable<T>, obs2$: Observable<U>): Observable<[T, U]>;
export declare function combine<T, U, V>(obs1$: Observable<T>, obs2$: Observable<U>, obs3$: Observable<V>): Observable<[T, U, V]>;
export declare function combine<T, U, V, W>(obs1$: Observable<T>, obs2$: Observable<U>, obs3$: Observable<V>, obs4$: Observable<W>): Observable<[T, U, V, W]>;
export declare function combine<T, U, V, W, X>(obs1$: Observable<T>, obs2$: Observable<U>, obs3$: Observable<V>, obs4$: Observable<W>, obs5$: Observable<X>): Observable<[T, U, V, W, X]>;
export declare function combine<T, U, V, W, X, Y>(obs1$: Observable<T>, obs2$: Observable<U>, obs3$: Observable<V>, obs4$: Observable<W>, obs5$: Observable<X>, obs6$: Observable<Y>): Observable<[T, U, V, W, X, Y]>;
export declare function combine<T, U, V, W, X, Y, Z>(obs1$: Observable<T>, obs2$: Observable<U>, obs3$: Observable<V>, obs4$: Observable<W>, obs5$: Observable<X>, obs6$: Observable<Y>, obs7$: Observable<Z>): Observable<[T, U, V, W, X, Y, Z]>;
export declare function merge<T>(...cuprumList: Observable<T>[]): Observable<T>;
export declare function interval(msec: number): Cuprum<unknown>;
export declare type Observable<T> = Omit<Cuprum<T>, "dispatch">;
export interface Subscription {
    unsubscribe: () => void;
}
