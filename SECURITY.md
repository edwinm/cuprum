# Security Policy

## Supported Versions

Cuprum is maintained by a single author. Security fixes are released only for
the latest published version on npm.

| Version | Supported          |
| ------- | ------------------ |
| 0.2.x   | :white_check_mark: |
| < 0.2.0 | :x:                |

If you are on an older release, upgrade to the latest `0.2.x` before reporting
an issue — the fix may already be there.

## Reporting a Vulnerability

**Please do not open a public GitHub issue for security problems.**

Report privately in one of these ways:

1. **GitHub private vulnerability reporting** (preferred) — go to the
   [Security tab](https://github.com/edwinm/cuprum/security/advisories) of this
   repository and choose "Report a vulnerability". This keeps the report private
   until a fix is published.
2. **Email** — <edwin@bitstorm.org>. Please put "cuprum security" in the subject
   line.

Helpful things to include:

- The version of cuprum you are using
- A description of the issue and why you believe it is a security problem
- A minimal reproduction — the smallest snippet that shows the behaviour
- The runtime and browser/Node version you observed it on
- Any suggested fix, if you have one in mind

### What to expect

This is a spare-time project, so there is no guaranteed response window. In
practice you can expect an acknowledgement within a couple of weeks. You will be
told whether the report is accepted, and once a fix is released you will be
credited in the advisory unless you would rather stay anonymous.

Please give a reasonable amount of time for a fix to be published before
disclosing the issue publicly.

## Scope

Cuprum is a ~1 KB reactive state management library. It has **no runtime
dependencies**, performs no network access, no file or storage I/O, and does not
use `eval`, `new Function`, or `innerHTML`. Values flowing through a stream are
passed to subscribers unchanged and are never interpreted as code or markup.

That makes the realistic attack surface small. Reports that are in scope include:

- A way to make cuprum execute attacker-controlled input as code
- Prototype pollution, or any way to reach across stream instances
- A memory leak reachable from normal API use that enables denial of service
- Anything that lets a value escape the stream it was dispatched to

The following are generally **out of scope**:

- Cross-site scripting caused by _your_ application rendering a value taken from
  a stream. Cuprum passes values through untouched; escaping output is the
  responsibility of the code that renders it.
- Vulnerabilities in `devDependencies`. These are build and test tooling only —
  they are not installed by consumers of the published package, which ships
  `src/cuprum.ts` and the `dist` bundles with no dependencies of its own.
- Issues that require the attacker to already control the page or the Node
  process.

## Supply Chain

A few practices are in place to reduce supply-chain risk. They are worth knowing
about if you are auditing this package:

- All dependencies are pinned to exact versions, and `package-lock.json` is
  committed.
- CI installs with `npm ci --ignore-scripts`, so no lifecycle scripts run during
  installation.
- CI resolves executables from the lockfile (`npm exec --no`) rather than
  fetching them on demand.
- The published package has zero runtime dependencies.

If you spot a weakness in the release or build process itself, that is in scope
— report it through the channels above.
