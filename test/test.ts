import * as assert from "assert";
import { Cuprum } from "../src/cuprum";

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

  it("Promise", (done) => {
    const pipe1$ = new Cuprum<string>();

    (async function () {
      setTimeout(() => pipe1$.dispatch("a2"), 10);

      const value = await pipe1$.promise();
      assert.equal(value, "a2");
      done();
    })();
  });
});
