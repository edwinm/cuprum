import { fromEvent } from "../dist/bundle.min.js";

fromEvent(document, "DOMContentLoaded").subscribe(() => {
  const obs$ = fromEvent(document.getElementById("hello-button"), "click");
  obs$.subscribe(() => {
    document.getElementById("out").textContent =
      "Hello. Everything works fine.";
  });
});
