export class Cuprum<T> {
  private val: T;
  private subscribers: Set<(value: T, oldValue?: T) => void> = new Set();
  private subscribersHot: Set<(value: boolean) => void> = new Set();
  private dispatched = false;
  private hot = false;

  dispatch(value: T) {
    const oldValue = this.val;
    this.val = value;
    this.dispatched = true;
    this.subscribers.forEach((fn) => fn(value, oldValue));
  }

  subscribeNext(fn: (value: T) => void): Subscription {
    this.subscribers.add(fn);
    this.notifyHotSubscribers();
    return {
      unsubscribe: () => {
        this.subscribers.delete(fn);
      },
    };
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

  private notifyHotSubscribers() {
    if (this.subscribers.size > 0 != this.hot) {
      this.hot = this.subscribers.size > 0;
      this.subscribersHot.forEach((fn) => fn(this.hot));
    }
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
      event$.dispatch(fn(value));
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

export function combine(...cuprumList: Cuprum<any>[]) {
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

interface Subscription {
  unsubscribe: () => void;
}
