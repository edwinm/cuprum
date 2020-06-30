export class Cuprum<T> {
  private val: T;
  private subscribers: Set<(value: T, oldValue?: T) => void> = new Set();
  private subscribersHot: Set<(value: boolean) => void> = new Set();
  private dispatched = false;
  private hot = false;
  private isSubject = false;

  dispatch(value: T): Cuprum<T> {
    if (this.isSubject) {
      throw new Error("Can't dispatch on subject");
    }
    this.internalDispatch(value);
    return this;
  }

  subscribe(fn: (value: T, oldValue?: T) => void): Subscription {
    if (this.dispatched) {
      fn(this.val);
    }
    return this.subscribeNext(fn);
  }

  unsubscribe(fn: (value: T, oldValue?: T) => void): void {
    this.subscribers.delete(fn);
    this.notifyHotSubscribers();
  }

  subscribeHot(fn: (value: boolean) => void): Subscription {
    this.subscribersHot.add(fn);
    return {
      unsubscribe: (): void => {
        this.subscribersHot.delete(fn);
      },
    };
  }

  clear(): void {
    this.subscribers.clear();
    this.subscribersHot.clear();
  }

  value(): T {
    return this.val;
  }

  observable(): Observable<T> {
    const observable = this.map((value) => value);
    observable.isSubject = true;
    return observable;
  }

  promise(): Promise<T> {
    return new Promise<T>((resolve) => {
      const sub = this.subscribe(function fn(value) {
        sub.unsubscribe();
        resolve(value);
      });
    });
  }

  // TODO: async map

  map<U>(fn: (val: T) => U): Cuprum<U> {
    const event$ = new Cuprum<U>();
    const dispatch = (value) => {
      event$.internalDispatch(fn(value));
    };
    event$.subscribeHot((hot) => {
      if (hot) {
        this.subscribe(dispatch);
      } else {
        this.unsubscribe(dispatch);
      }
    });
    return event$;
  }

  filter(fn: (val: T) => boolean): Cuprum<T> {
    const event$ = new Cuprum<T>();
    const dispatch = (value) => {
      if (fn(value)) {
        event$.dispatch(value);
      }
    };
    event$.subscribeHot((hot) => {
      if (hot) {
        this.subscribe(dispatch);
      } else {
        this.unsubscribe(dispatch);
      }
    });
    return event$;
  }

  private notifyHotSubscribers() {
    if (this.subscribers.size > 0 != this.hot) {
      this.hot = this.subscribers.size > 0;
      this.subscribersHot.forEach((fn) => fn(this.hot));
    }
  }

  private subscribeNext(fn: (value: T) => void): Subscription {
    this.subscribers.add(fn);
    this.notifyHotSubscribers();
    return {
      unsubscribe: (): void => {
        this.subscribers.delete(fn);
      },
    };
  }

  private internalDispatch(value: T) {
    const oldValue = this.val;
    this.val = value;
    this.dispatched = true;
    this.subscribers.forEach((fn) => fn(value, oldValue));
  }
}

export function fromEvent<K extends keyof HTMLElementEventMap>(
  element: HTMLElement,
  eventType: K
): Cuprum<HTMLElementEventMap[K]> {
  const obs$ = new Cuprum<HTMLElementEventMap[K]>();
  const dispatch = (evt: HTMLElementEventMap[K]) => {
    obs$.dispatch(evt);
  };
  obs$.subscribeHot((hot) => {
    if (hot) {
      element.addEventListener(eventType, dispatch, false);
    } else {
      element.removeEventListener(eventType, dispatch, false);
    }
  });
  return obs$;
}

export function combine<T>(obs1$: Observable<T>): Observable<[T]>;
export function combine<T, U>(
  obs1$: Observable<T>,
  obs2$: Observable<U>
): Observable<[T, U]>;
export function combine<T, U, V>(
  obs1$: Observable<T>,
  obs2$: Observable<U>,
  obs3$: Observable<V>
): Observable<[T, U, V]>;
export function combine<T, U, V, W>(
  obs1$: Observable<T>,
  obs2$: Observable<U>,
  obs3$: Observable<V>,
  obs4$: Observable<W>
): Observable<[T, U, V, W]>;
export function combine<T, U, V, W, X>(
  obs1$: Observable<T>,
  obs2$: Observable<U>,
  obs3$: Observable<V>,
  obs4$: Observable<W>,
  obs5$: Observable<X>
): Observable<[T, U, V, W, X]>;
export function combine<T, U, V, W, X, Y>(
  obs1$: Observable<T>,
  obs2$: Observable<U>,
  obs3$: Observable<V>,
  obs4$: Observable<W>,
  obs5$: Observable<X>,
  obs6$: Observable<Y>
): Observable<[T, U, V, W, X, Y]>;
export function combine<T, U, V, W, X, Y, Z>(
  obs1$: Observable<T>,
  obs2$: Observable<U>,
  obs3$: Observable<V>,
  obs4$: Observable<W>,
  obs5$: Observable<X>,
  obs6$: Observable<Y>,
  obs7$: Observable<Z>
): Observable<[T, U, V, W, X, Y, Z]>;

export function combine(
  ...cuprumList: Observable<unknown>[]
): Observable<unknown> {
  const obs$ = new Cuprum();
  const subs = new Set<Subscription>();

  obs$.subscribeHot((hot) => {
    if (hot) {
      cuprumList.forEach((obs) => {
        subs.add(
          obs.subscribe(() => {
            obs$.dispatch(cuprumList.map((obs1) => obs1.value()));
          })
        );
      });
    } else {
      subs.forEach((sub) => sub.unsubscribe());
    }
  });

  return <Observable<unknown>>obs$;
}

export function merge<T>(...cuprumList: Observable<T>[]): Observable<T> {
  const obs$ = new Cuprum();
  const subs = new Set<Subscription>();

  obs$.subscribeHot((hot) => {
    if (hot) {
      cuprumList.forEach((obs) => {
        subs.add(
          obs.subscribe((value) => {
            obs$.dispatch(value);
          })
        );
      });
    } else {
      subs.forEach((sub) => sub.unsubscribe());
    }
  });

  return <Observable<T>>obs$;
}

export function interval(msec: number): Cuprum<unknown> {
  const obs$ = new Cuprum();
  let timer = <NodeJS.Timeout>null;
  let counter;

  obs$.subscribeHot((hot) => {
    if (hot) {
      counter = 0;
      timer = setInterval(() => {
        obs$.dispatch(counter++);
      }, msec);
    } else {
      clearInterval(timer);
    }
  });

  return obs$;
}

export type Observable<T> = Omit<Cuprum<T>, "dispatch">;

export interface Subscription {
  unsubscribe: () => void;
}
