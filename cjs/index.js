'use strict';
const effects = [Function.prototype];
const disposed = new WeakSet;

class ImplicitValue {
  then() { return this.value }
  toJSON() { return this.value }
  toString() { return this.value }
  valueOf() { return this.value }
}

/** @param {T} value the value carried through the new Signal */
const signal = value => new Signal(value);
exports.signal = signal;
class Signal extends ImplicitValue {
  /** @type {T} */    #value;
  /** @type {Set} */  #effects = new Set;

  /** @param {T} value the value carried through the signal */
  constructor(value) {
    super().#value = value;
  }

  /** @returns {T} */
  get value() {
    this.#effects.add(effects.at(-1));
    return this.#value;
  }

  /** @param {T} value the new value carried through the signal */
  set value(value) {
    if (this.#value !== value) {
      this.#value = value;
      for (const effect of this.#effects) {
        if (disposed.has(effect))
          this.#effects.delete(effect);
        else
          effect();
      }
    }
  }

  // EXPLICIT NO SIDE EFFECTS
  peek() { return this.#value }
}
exports.Signal = Signal

/**
 * Computeds are read-only signal wrappers that can be disposed.
 * @param {function():T} fn the computed callback 
 * @param {T?} initialValue optional value passed each time
 */
const computed = (fn, initialValue) => new Computed(fn, initialValue);
exports.computed = computed;
class Computed extends ImplicitValue {
  /** @type {T} */    #value;
  /**
   * Computeds are read-only signals wrappers that can be disposed.
   * @param {function():T} fn the callback that returns the signal value
   * @param {T?} initialValue optional value passed each time
   */
  constructor(fn, initialValue) {
    super().#value = initialValue;
    this.dispose = effect(() => {
      this.#value = fn(this.#value);
    });
  }

  /** @returns {T} */
  get value() { return this.#value }

  /** @returns {T} */
  peek() { return this.#value }
}
exports.Computed = Computed

/**
 * @param {function():void} fn the callback to invoke as effect
 * @returns {function():void} a callback to dispose the effect
 */
const effect = fn => {
  effects.push(fn);
  try { return fn(), () => { disposed.add(fn) } }
  finally { effects.pop() }
};
exports.effect = effect;
