![test](https://github.com/edwinm/cuprum/workflows/Test/badge.svg) [![Coverage Status](https://coveralls.io/repos/github/edwinm/cuprum/badge.svg?branch=master)](https://coveralls.io/github/edwinm/cuprum?branch=master) [![CodeFactor](https://www.codefactor.io/repository/github/edwinm/cuprum/badge)](https://www.codefactor.io/repository/github/edwinm/cuprum) [![Socket Badge](https://socket.dev/api/badge/npm/package/cuprum)](https://socket.dev/npm/package/cuprum) [![Size](https://img.shields.io/github/size/edwinm/cuprum/dist/bundle.min.js)](https://github.com/edwinm/cuprum/blob/master/dist/bundle.min.js) [![npm version](https://badge.fury.io/js/cuprum.svg)](https://www.npmjs.com/package/cuprum) [![GitHub](https://img.shields.io/github/license/edwinm/cuprum.svg)](https://github.com/edwinm/cuprum/blob/master/LICENSE)

# Cuprum

One kilobyte reactive state management library for JavaScript and TypeScript.

## Installation

```sh
npm install cuprum
```

## Basic Usage

```ts
import { Cuprum } from "cuprum";

const count$ = new Cuprum<number>();

count$.subscribe((value) => {
  console.log(value); // 1, 2, 3, ...
});

count$.dispatch(1);
count$.dispatch(2);
count$.dispatch(3);
```

## API Reference

### `Cuprum<T>`

The core class. Represents an observable stream that can also dispatch values.

#### Constructor

```ts
const obs$ = new Cuprum<T>();
```

#### Methods

##### `.dispatch(value: T): Cuprum<T>`

Emits a value to all current subscribers. Returns `this` for chaining.

```ts
obs$.dispatch("hello");
```

##### `.subscribe(fn: (value: T, oldValue?: T) => void): Subscription`

Subscribes to future values. If a value has already been dispatched, `fn` is called immediately with the current value. The callback receives both the new value and the previous value.

```ts
obs$.subscribe((value, oldValue) => {
  console.log(value, oldValue);
});
```

##### `.unsubscribe(fn): void`

Removes a previously subscribed function.

```ts
function handler(value: string) { ... }
obs$.subscribe(handler);
obs$.unsubscribe(handler);
```

##### `.value(): T`

Returns the last dispatched value without subscribing.

```ts
const current = obs$.value();
```

##### `.map<U>(fn: (value: T) => U): Cuprum<U>`

Returns a new observable whose values are transformed by `fn`.

```ts
const doubled$ = number$.map((n) => n * 2);
```

##### `.filter(fn: (value: T) => boolean): Cuprum<T>`

Returns a new observable that only emits values for which `fn` returns `true`.

```ts
const positive$ = number$.filter((n) => n > 0);
```

##### `.promise(): Promise<T>`

Returns a `Promise` that resolves with the next dispatched value.

```ts
const value = await obs$.promise();
```

##### `.observable(): Observable<T>`

Returns a read-only view of this observable. The returned object has no `dispatch` method — calling it throws an error. Useful for exposing a stream publicly without allowing external dispatches.

```ts
const readOnly$ = obs$.observable();
```

##### `.clear(): void`

Removes all subscribers.

```ts
obs$.clear();
```

---

### Utility Functions

#### `fromEvent(element, eventType, options?)`

Creates a `Cuprum` that emits DOM events from the given element. Supports `Window`, `Document`, and `HTMLElement` with full TypeScript event map inference. The event listener is added only while there is at least one subscriber.

```ts
import { fromEvent } from "cuprum";

const click$ = fromEvent(document.getElementById("btn"), "click");
click$.subscribe((event) => console.log(event));
```

#### `fromCustomEvent(element, eventType, options?)`

Like `fromEvent` but for custom or non-standard event names, without type inference.

```ts
import { fromCustomEvent } from "cuprum";

const open$ = fromCustomEvent(element, "open");
open$.subscribe(() => console.log("opened"));
```

#### `combine(...observables): Observable<[...]>`

Combines up to 7 observables into a single observable that emits a tuple of the latest values from each source. Emits whenever any source emits. Sources that have not yet emitted contribute `undefined` to the tuple.

```ts
import { combine } from "cuprum";

const combined$ = combine(name$, age$);
combined$.subscribe(([name, age]) => {
  console.log(name, age);
});
```

#### `merge<T>(...observables): Observable<T>`

Merges multiple observables into one. Emits each value as-is from whichever source emits.

```ts
import { merge } from "cuprum";

const all$ = merge(stream1$, stream2$, stream3$);
all$.subscribe((value) => console.log(value));
```

#### `interval(ms: number): Cuprum<number>`

Creates an observable that emits an incrementing integer starting from `0` at the given interval in milliseconds. The timer only runs while there is at least one subscriber.

```ts
import { interval } from "cuprum";

const timer$ = interval(1000);
const sub = timer$.subscribe((i) => console.log(i)); // 0, 1, 2, ...

// Stop the timer
sub.unsubscribe();
```

---

### Types

#### `Observable<T>`

A read-only view of `Cuprum<T>` — all methods except `dispatch` are available. Returned by `.observable()`, `combine()`, and `merge()`.

```ts
type Observable<T> = Omit<Cuprum<T>, "dispatch">;
```

#### `Subscription`

Returned by `.subscribe()` and `.subscribeHot()`. Call `.unsubscribe()` to stop receiving values.

```ts
interface Subscription {
  unsubscribe(): void;
}
```

---

## Examples

### Subscribe and dispatch

```ts
const pipe$ = new Cuprum<string>();

pipe$.subscribe((value) => console.log(value));
pipe$.dispatch("hello"); // logs: hello
```

### Map

```ts
const source$ = new Cuprum<string>();
const upper$ = source$.map((s) => s.toUpperCase());

upper$.subscribe((v) => console.log(v));
source$.dispatch("hello"); // logs: HELLO
```

### Filter

```ts
const numbers$ = new Cuprum<number>();

numbers$.filter((n) => n % 2 === 0).subscribe((n) => console.log(n));

numbers$.dispatch(1); // ignored
numbers$.dispatch(2); // logs: 2
numbers$.dispatch(3); // ignored
numbers$.dispatch(4); // logs: 4
```

### Receiving old value

```ts
const value$ = new Cuprum<string>();

value$.subscribe((value, oldValue) => {
  console.log(`${oldValue} → ${value}`);
});

value$.dispatch("a"); // undefined → a
value$.dispatch("b"); // a → b
```

### Promise

```ts
const obs$ = new Cuprum<string>();
setTimeout(() => obs$.dispatch("done"), 1000);

const result = await obs$.promise();
console.log(result); // "done"
```

### Combine

```ts
const a$ = new Cuprum<string>();
const b$ = new Cuprum<number>();

combine(a$, b$).subscribe(([a, b]) => console.log(a, b));

a$.dispatch("x"); // "x", undefined
b$.dispatch(1); // "x", 1
a$.dispatch("y"); // "y", 1
```

### Merge

```ts
const a$ = new Cuprum<string>();
const b$ = new Cuprum<string>();

merge(a$, b$).subscribe((v) => console.log(v));

a$.dispatch("from a"); // "from a"
b$.dispatch("from b"); // "from b"
```

### Interval

```ts
const tick$ = interval(500);
const sub = tick$.subscribe((i) => console.log(i)); // 0, 1, 2, ...

setTimeout(() => sub.unsubscribe(), 3000); // stop after 3 seconds
```

## License

Copyright 2023 [Edwin Martin](https://bitstorm.org/) and released under the MIT license.
