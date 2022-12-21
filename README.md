# @webreflection/signal

<sup>**Social Media Photo by [Louis Reed](https://unsplash.com/@_louisreed) on [Unsplash](https://unsplash.com/)**</sup>

A minimalistic signals implementation.

  * no automatic effect disposal except when an outer effect has inner effects and its `dispose()` is invoked
  * computed are updated per each signal change they depend on
  * no fancy features like in other libraries *except* there is a `drain` export which, if used as `signal.value = drain` will simply loop over disposed effects and free them from the relationship right away: the signal value won't change, and no active effect will be ever notified

### exports

  * `signal(value)` to create a new signal with a reactive `.value`
  * `computed(fn[, initialValue])` to create a computed signal with a read-only `.value` and a `.dispose()` method
  * `effect(fn[, initialValue])` to create an effect and return a dispose function
  * `Signal` to compare via `instanceof Signal` instances
  * `Computed` to compare via `instanceof Computed` instances
  * `drain` unique symbol to use as *signals*' value whenever dropping diposed effects from their stack might be desired

Both *computed* and *effect* accepts an initial value to pass to the callback. The callback will keep receiving the previous value on each new invoke.
