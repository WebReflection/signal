'use strict';
/*! (c) Andrea Giammarchi */

let batches = null;

/**
 * Invoke a callback that updates many signals and runs effects only after.
 * @type {(fn:() => void) => void}
 */
const batch = fn => {
  let effects = batches;
  if (!effects) batches = new Set;
  try { fn() }
  finally {
    if (!effects) {
      [batches, effects] = [null, batches];
      for (const effect of effects) effect._();
    }
  }
};
exports.batch = batch;

const cleared = self => {
  const entries = [...self];
  self.clear();
  return entries;
};

class Effect extends Set {
  constructor(_) { super()._ = _ }
  dispose() {
    for (const entry of cleared(this)) {
      entry.delete(this);
      entry.dispose?.();
    }
  }
}

let current = null;

/**
 * Invokes a function when any of its internal signals or computed values change.
 * Returns a `dispose` callback.
 * @template T
 * @type {<T>(fn: (v?: T) => T | undefined, value?: T) => () => void}
 */
const effect = (fn, value) => {
  const fx = new Effect(() => {
    const prev = current;
    current = fx;
    try { value = fn(value) }
    finally { current = prev; }
  });
  if (current) current.add(fx);
  return fx._(), () => fx.dispose();
};
exports.effect = effect;

/**
 * A signal with a value property also exposed via toJSON, toString and valueOf.
 * @template T
 */
class Signal extends Set {

  /** @param {T} value the value carried through the signal */
  constructor(_) { super()._ = _ }

  /** @returns {T} */
  get value() {
    if (current) current.add(this.add(current));
    return this._;
  }

  /** @param {T} value the new value carried through the signal */
  set value(_) {
    if (this._ !== _) {
      this._ = _;
      const root = !batches;
      for (const effect of cleared(this)) {
        if (root) effect._();
        else batches.add(effect);
      }
    }
  }

  // EXPLICIT NO SIDE EFFECT
  peek() { return this._ }

  // IMPLICIT SIDE EFFECT
  then(resolve) { resolve(this.value) }
  toJSON() { return this.value }
  valueOf() { return this.value }
  toString() { return String(this.value) }
}
exports.Signal = Signal

/**
 * Returns a writable Signal that side-effects whenever its value gets updated.
 * @template T
 * @type {<T>(value: T) => Signal<T>}
 */
const signal = value => new Signal(value);
exports.signal = signal;

/**
 * A read-only Signal extend that is invoked only when any of the internally
 * used signals, as in within the callback, is unknown or updated.
 * @template T
 * @extends {Signal<T>}
 */
class Computed extends Signal {
  /**
   * @param {(v?: T) => T} fn the callback invoked when its signals changes
   * @param {T | undefined} value the optional initial value of the callback
   */
  constructor(fn, value) {
    super(value);

    /**
     * Disposes the computed effect to stop receiving updates.
     * @type {() => void}
     */
    this.dispose = effect(() => {
      super.value = fn(this._);
    });
  }

  /** @readonly @returns {T} */
  get value() { return super.value }

  /** @throws {Error} */
  set value(_) { throw new Error('computed is read-only') }
}
exports.Computed = Computed

/**
 * Returns a Computed signal that is invoked only when any of the internally
 * used signals, as in within the callback, is unknown or updated.
 * @template T
 * @type {<T>(fn: (v?: T) => T, value?: T) => Computed<T>}
 */
const computed = (fn, value) => new Computed(fn, value);
exports.computed = computed;
