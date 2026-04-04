import * as assert from "assert";
import { test } from "@playwright/test";
import {
  Cuprum,
  fromEvent,
  combine,
  merge,
  interval,
  fromCustomEvent,
} from "../src/cuprum";

test.describe("Cuprum", () => {
  test("Subscribe and dispatch", async () => {
    const pipe1$ = new Cuprum<string>();

    const value = await new Promise<string>((resolve) => {
      pipe1$.subscribe(resolve);
      pipe1$.dispatch("a1");
    });

    assert.equal(value, "a1");
  });

  test("Subscribe, map and dispatch", async () => {
    const pipe1$ = new Cuprum<string>();
    const pipe2$ = pipe1$.map((val) => `[${val}]`);

    const value = await new Promise<string>((resolve) => {
      pipe2$.subscribe(resolve);
      pipe1$.dispatch("a1");
    });

    assert.equal(value, "[a1]");
  });

  test("Unsubscribe", () => {
    const pipe1$ = new Cuprum<string>();

    pipe1$.subscribe(sub);
    pipe1$.dispatch("a1");
    pipe1$.unsubscribe(sub);
    pipe1$.dispatch("a2");

    function sub(value: unknown) {
      assert.equal(value, "a1");
    }
  });

  test("Two subscribers", () => {
    let count1 = 0;
    let count2 = 0;
    const pipe1$ = new Cuprum<string>();

    pipe1$.subscribe(sub1);
    pipe1$.subscribe(sub2);
    pipe1$.dispatch("a1");
    pipe1$.unsubscribe(sub1);
    pipe1$.dispatch("a1");
    pipe1$.unsubscribe(sub2);
    pipe1$.dispatch("a1");

    assert.equal(count1, 1);
    assert.equal(count2, 2);

    function sub1(value: unknown) {
      assert.equal(value, "a1");
      count1++;
    }

    function sub2(value: unknown) {
      assert.equal(value, "a1");
      count2++;
    }
  });

  test("Old value", () => {
    let result = "";
    const pipe1$ = new Cuprum<string>();

    pipe1$.subscribe((value, oldValue) => {
      result += `[${value}/${oldValue}]`;
    });

    pipe1$.dispatch("a1");
    pipe1$.dispatch("a2");
    pipe1$.dispatch("a3");

    assert.equal(result, "[a1/undefined][a2/a1][a3/a2]");
  });

  test("Filter", () => {
    let result = "";
    const pipe$ = new Cuprum<string>();

    pipe$
      .filter((value) => value != "a0")
      .subscribe((value) => {
        result += `[${value}]`;
      });

    pipe$.dispatch("a0");
    pipe$.dispatch("a1");
    pipe$.dispatch("a2");
    pipe$.dispatch("a0");
    pipe$.dispatch("a3");
    pipe$.dispatch("a0");
    pipe$.dispatch("a4");

    assert.equal(result, "[a1][a2][a3][a4]");
  });

  test("Promise", async () => {
    const pipe1$ = new Cuprum<string>();
    setTimeout(() => pipe1$.dispatch("a2"), 10);
    const value = await pipe1$.promise();
    assert.equal(value, "a2");
  });

  test("Observable", () => {
    let result = "";
    const pipe$ = new Cuprum<string>();
    const obs$ = pipe$.observable();

    obs$.subscribe((value) => {
      result += `[${value}]`;
    });

    pipe$.dispatch("a0");
    pipe$.dispatch("a1");

    assert.equal(result, "[a0][a1]");

    assert.throws(() => {
      (<Cuprum<unknown>>obs$).dispatch("a");
    });
  });

  test("fromEvent", async () => {
    const target = new EventTarget();

    await new Promise<void>((resolve) => {
      fromEvent(
        target as unknown as HTMLElement,
        "click" as keyof HTMLElementEventMap
      ).subscribe(() => resolve());
      target.dispatchEvent(new Event("click"));
    });
  });

  test("fromCustomEvent", async () => {
    const target = new EventTarget();

    await new Promise<void>((resolve) => {
      fromCustomEvent(target as unknown as HTMLElement, "open").subscribe(() =>
        resolve()
      );
      target.dispatchEvent(new Event("open"));
    });
  });

  test("Combine", () => {
    let result = "";
    const pipe1$ = new Cuprum<string>();
    const pipe2$ = new Cuprum<string>();
    const combined$ = combine(pipe1$, pipe2$);

    combined$.subscribe(([val1, val2]) => {
      result += `[${val1}/${val2}]`;
    });

    pipe1$.dispatch("a1");
    pipe2$.dispatch("a2");
    pipe1$.dispatch("a3");

    assert.equal(result, "[a1/undefined][a1/a2][a3/a2]");
  });

  test("Combine three", () => {
    let result = "";
    const pipe1$ = new Cuprum<string>();
    const pipe2$ = new Cuprum<string>();
    const pipe3$ = new Cuprum<number>();
    const combined$ = combine(pipe1$, pipe2$, pipe3$);

    combined$.subscribe(([val1, val2, val3]) => {
      result += `[${val1}/${val2}/${val3}]`;
    });

    pipe1$.dispatch("1a");
    pipe2$.dispatch("2a");
    pipe1$.dispatch("1b");
    pipe3$.dispatch(12);
    pipe1$.dispatch("1c");

    assert.equal(
      result,
      "[1a/undefined/undefined][1a/2a/undefined][1b/2a/undefined][1b/2a/12][1c/2a/12]"
    );
  });

  test("Merge", () => {
    let result = "";
    const pipe1$ = new Cuprum<string>();
    const pipe2$ = new Cuprum<string>();
    const pipe3$ = new Cuprum<string>();
    const combined$ = merge(pipe1$, pipe2$, pipe3$);

    combined$.subscribe((value) => {
      result += `[${value}]`;
    });

    pipe1$.dispatch("1a");
    pipe2$.dispatch("2a");
    pipe1$.dispatch("1b");
    pipe3$.dispatch("3a");
    pipe1$.dispatch("1c");

    assert.equal(result, "[1a][2a][1b][3a][1c]");
  });

  test("Interval", async () => {
    let result = "";
    const timer$ = interval(10);

    await new Promise<void>((resolve) => {
      const sub = timer$.subscribe((i) => {
        result += `[${i}]`;
        if (i == 10) {
          sub.unsubscribe();
          setTimeout(() => {
            assert.equal(result, "[0][1][2][3][4][5][6][7][8][9][10]");
            resolve();
          }, 20);
        }
      });
    });
  });
});
