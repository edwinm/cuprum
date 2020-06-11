export class Cuprum<T> {
  private val: T;
  private subscribers: Set<(value: T, oldValue?: T) => void> = new Set();
  private subscribersHot: Set<(value: boolean) => void> = new Set();
  private dispatched = false;
  private hot = false;
  private isSubject = false;

  dispatch(value: T) {
    if (this.isSubject) {
      throw "Can't dispatch on subject";
    }
    this.internalDispatch(value);
    return this;
  }

  subscribe(fn: (value: T, oldValue?: T) => void) {
    if (this.dispatched) {
      fn(this.val);
    }
    return this.subscribeNext(fn);
  }

  unsubscribe(fn: (value: T, oldValue?: T) => void) {
    this.subscribers.delete(fn);
    this.notifyHotSubscribers();
  }

  subscribeHot(fn: (value: boolean) => void) {
    this.subscribersHot.add(fn);
    return {
      unsubscribe: () => {
        this.subscribersHot.delete(fn);
      },
    };
  }

  clear() {
    this.subscribers.clear();
    this.subscribersHot.clear();
  }

  value() {
    return this.val;
  }

  observable(): Observable<T> {
    const observable = this.map((value) => value);
    observable.isSubject = true;
    return observable;
  }

  promise() {
    return new Promise<T>((resolve) => {
      const sub = this.subscribe(function fn(value) {
        sub.unsubscribe();
        resolve(value);
      });
    });
  }

  // TODO: async map

  map<U>(fn: (val: T) => U) {
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

  filter(fn: (val: T) => boolean) {
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
      unsubscribe: () => {
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

export function tap(fn: (val: any) => any) {
  fn(this.val);
  return this;
}

export function fromEvent(element, eventType) {
  const obs$ = new Cuprum<Event>();
  const dispatch = (evt: Event) => {
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

export function combine<T>(obs1$: Cuprum<T>): Cuprum<[T]>;
export function combine<T, U>(
  obs1$: Cuprum<T>,
  obs2$: Cuprum<U>
): Cuprum<[T, U]>;
export function combine<T, U, V>(
  obs1$: Cuprum<T>,
  obs2$: Cuprum<U>,
  obs3$: Cuprum<V>
): Cuprum<[T, U, V]>;
export function combine<T, U, V, W>(
  obs1$: Cuprum<T>,
  obs2$: Cuprum<U>,
  obs3$: Cuprum<V>,
  obs4$: Cuprum<W>
): Cuprum<[T, U, V, W]>;
export function combine<T, U, V, W, X>(
  obs1$: Cuprum<T>,
  obs2$: Cuprum<U>,
  obs3$: Cuprum<V>,
  obs4$: Cuprum<W>,
  obs5$: Cuprum<X>
): Cuprum<[T, U, V, W, X]>;
export function combine<T, U, V, W, X, Y>(
  obs1$: Cuprum<T>,
  obs2$: Cuprum<U>,
  obs3$: Cuprum<V>,
  obs4$: Cuprum<W>,
  obs5$: Cuprum<X>,
  obs6$: Cuprum<Y>
): Cuprum<[T, U, V, W, X, Y]>;
export function combine<T, U, V, W, X, Y, Z>(
  obs1$: Cuprum<T>,
  obs2$: Cuprum<U>,
  obs3$: Cuprum<V>,
  obs4$: Cuprum<W>,
  obs5$: Cuprum<X>,
  obs6$: Cuprum<Y>,
  obs7$: Cuprum<Z>
): Cuprum<[T, U, V, W, X, Y, Z]>;

export function combine(...cuprumList: Cuprum<unknown>[]) {
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

  return obs$;
}

export function merge<T>(obs1$: Cuprum<T>): Cuprum<T>;
export function merge<T>(obs1$: Cuprum<T>, obs2$: Cuprum<T>): Cuprum<T>;
export function merge<T>(
  obs1$: Cuprum<T>,
  obs2$: Cuprum<T>,
  obs3$: Cuprum<T>
): Cuprum<T>;
export function merge<T>(
  obs1$: Cuprum<T>,
  obs2$: Cuprum<T>,
  obs3$: Cuprum<T>,
  obs4$: Cuprum<T>
): Cuprum<T>;
export function merge<T>(
  obs1$: Cuprum<T>,
  obs2$: Cuprum<T>,
  obs3$: Cuprum<T>,
  obs4$: Cuprum<T>,
  obs5$: Cuprum<T>
): Cuprum<T>;
export function merge<T>(
  obs1$: Cuprum<T>,
  obs2$: Cuprum<T>,
  obs3$: Cuprum<T>,
  obs4$: Cuprum<T>,
  obs5$: Cuprum<T>,
  obs6$: Cuprum<T>
): Cuprum<T>;
export function merge<T>(
  obs1$: Cuprum<T>,
  obs2$: Cuprum<T>,
  obs3$: Cuprum<T>,
  obs4$: Cuprum<T>,
  obs5$: Cuprum<T>,
  obs6$: Cuprum<T>,
  obs7$: Cuprum<T>
): Cuprum<T>;
export function merge(...cuprumList: Cuprum<unknown>[]) {
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

  return obs$;
}

export function interval(msec) {
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
