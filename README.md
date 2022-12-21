# @webreflection/signal

A very basic signals implementation.

  * no nested effects
  * no automatic effect disposal
  * computed are updated per each signal change they depend on
  * everything is extremely simplified to provide just a playground for signals

### exports

  * `signal(value)` to create a new signal with a reactive `.value`
  * `computed(fn[, initialValue])` to create a computed signal with a read-only `.value` and a `.dispose()` method
  * `effect(fn[, initialValue])` to create an effect and return a dispose function
  * `Signal` to compare via `instanceof Signal` instances
  * `Computed` to compare via `instanceof Computed` instances

Both *computed* and *effect* accepts an initial value to pass to the callback. The callback will keep receiving the previous value on each new invoke.
