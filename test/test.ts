import * as assert from "assert";
import { Cuprum, fromEvent, combine } from "../src/cuprum";

/**
 * Test framework used:
 * Mocha https://mochajs.org/
 * Assert https://nodejs.org/api/assert.html
 */

describe("Cuprum", () => {
  it("Subscribe and dispatch", (done) => {
    const pipe1$ = new Cuprum<string>();

    pipe1$.subscribe((value) => {
      assert.equal(value, "a1");
      done();
    });

    pipe1$.dispatch("a1");
  });

  it("Subscribe, map and dispatch", (done) => {
    const pipe1$ = new Cuprum<string>();

    const pipe2$ = pipe1$.map((val) => `[${val}]`);

    pipe2$.subscribe((value) => {
      assert.equal(value, "[a1]");
      done();
    });

    pipe1$.dispatch("a1");
  });

  it("Unsubscribe", () => {
    const pipe1$ = new Cuprum<string>();

    pipe1$.subscribe(sub);

    pipe1$.dispatch("a1");

    pipe1$.unsubscribe(sub);

    pipe1$.dispatch("a2");

    function sub(value) {
      assert.equal(value, "a1");
    }
  });

  it("Two subscribers", () => {
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

    function sub1(value) {
      assert.equal(value, "a1");
      count1++;
    }

    function sub2(value) {
      assert.equal(value, "a1");
      count2++;
    }
  });

  it("Old value", () => {
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

  it("Promise", (done) => {
    const pipe1$ = new Cuprum<string>();

    (async function () {
      setTimeout(() => pipe1$.dispatch("a2"), 10);

      const value = await pipe1$.promise();
      assert.equal(value, "a2");
      done();
    })();
  });

  it("fromEvent", (done) => {
    const a = document.createElement("a");
    fromEvent(a, "click").subscribe(() => {
      done();
    });
    a.click();
  });

  it("fromEvent custom", (done) => {
    const div = document.createElement("div");
    const event = new CustomEvent("update", { detail: "a1" });
    fromEvent(div, "update").subscribe((event: CustomEvent) => {
      assert.equal(event.detail, "a1");
      done();
    });
    div.dispatchEvent(event);
  });

  it("Combine", () => {
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

  it("Combine three", () => {
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
});
