# @webreflection/signal

[![Coverage Status](https://coveralls.io/repos/github/WebReflection/signal/badge.svg?branch=main)](https://coveralls.io/github/WebReflection/signal?branch=main) [![build status](https://github.com/WebReflection/signal/actions/workflows/node.js.yml/badge.svg)](https://github.com/WebReflection/signal/actions)

<sup>**Social Media Photo by [Louis Reed](https://unsplash.com/@_louisreed) on [Unsplash](https://unsplash.com/)**</sup>

A minimalistic signals implementation derived from the post [Signals: the nitty-gritty](https://calendar.perfplanet.com/2022/signals-the-nitty-gritty/).

  * no automatic effect disposal except when an outer effect has inner effects and the outer effect `dispose()` is invoked
  * computed are updated per each signal change they depend on, unless a `batch` operation is updating all inner signals at once
  * no fancy features from other libraries *except* there is a `drain` symbol exported which, if used as `signal.value = drain`, will simply loop over disposed effects and free them from the relationship right away: the signal value won't change, and no active effect will ever be notified

For anything more complex please check [usignal](https://github.com/WebReflection/usignal#readme) out.

### exports

  * `signal(value)` to create a new signal with a reactive `.value`
  * `computed(fn[, initialValue])` to create a computed signal with a read-only `.value` and a `.dispose()` method
  * `effect(fn[, stateValue])` to create an effect and return a dispose function
  * `batch(fn)` to update multiple signals at once and invoke related effects once
  * `Signal` to compare via `instanceof Signal` instances
  * `Computed` to compare via `instanceof Computed` instances
  * `drain` unique symbol, to use as *signals.value = drain*' whenever dropping diposed effects from their stack might be desired

Both *computed* and *effect* accepts an initial value to pass to the callback. The callback will keep receiving the previous value on each new invoke.


### eample

```js
// import {signal, effect} from 'https://unpkg.com/@webreflection/signal';
// const {signal, effect} = require('@webreflection/signal');
import {signal, effect} from '@webreflection/signal';

const single = signal(1);
const double = signal(10);
const triple = signal(100);

const dispose1 = effect(() => {
  console.log(`
  #1 effect
    single: ${single}
    double: ${double}
  `);
});

const dispose2 = effect(() => {
  console.log(`
  #2 effect
    double: ${double}
    triple: ${triple}
  `);
});

++double.value;
// logs single 1, double 11
// logs double 11, triple 100

dispose2();

++double.value;
// logs single 1, double 11
```
