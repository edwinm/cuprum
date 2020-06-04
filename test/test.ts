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
});
