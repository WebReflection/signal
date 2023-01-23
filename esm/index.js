/** (c) Andrea Giammarchi - ISC */

/**
 * A signal with a value property also exposed via toJSON, toString and valueOf.
 * @template T
 */
export class Signal {
  #value;
  #effects = [];

  /** @param {T} value the value carried through the signal */
  constructor(value) { this.#value = value }

  /** @returns {T} */
  get value() {
    const {length} = effects;
    if (length)
      this.#effects.push(effects[length - 1]);
    return this.#value;
  }

  /** @param {T} value the new value carried through the signal */
  set value(value) {
    if (this.#value !== value) {
      this.#value = value;
      if (this.#effects.length) {
        if (batches === effects)
          dispatch(this.#effects.splice(0));
        else
          batches.push(...this.#effects.splice(0));
      }
    }
  }

  // EXPLICIT NO SIDE EFFECT
  peek() { return this.#value }

  // IMPLICIT SIDE EFFECT
  then(resolve) { resolve(this.value) }
  toJSON() { return this.value }
  valueOf() { return this.value }
  toString() { return String(this.value) }
}

/**
 * A read-only Signal extend that is invoked only when any of the internally
 * used signals, as in within the callback, is unknown or updated.
 * @template T
 * @extends {Signal<T>}
 */
export class Computed extends Signal {
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
      super.value = fn(this.peek());
    });
  }

  /** @readonly @returns {T} */
  get value() { return super.value }

  /** @throws {Error} */
  set value(_) { throw new Error('computed is read-only') }
}

/**
 * Invoke a callback that updates many signals and runs effects only after.
 * @type {(fn:() => void) => void}
 */
export const batch = fn => {
  const root = batches === effects;
  if (root)
    batches = [];
  try { fn() }
  finally {
    if (root) {
      const all = batches;
      batches = effects;
      dispatch(all);
    }
  }
};

/**
 * Returns a Computed signal that is invoked only when any of the internally
 * used signals, as in within the callback, is unknown or updated.
 * @template T
 * @type {<T>(fn: (v?: T) => T, value?: T) => Computed<T>}
 */
export const computed = (fn, value) => new Computed(fn, value);

/**
 * Invokes a function when any of its internal signals or computed values change.
 * Returns a `dispose` callback.
 * @template T
 * @type {<T>(fn: (v?: T) => T | undefined, value?: T) => () => void}
 */
export const effect = (fn, value) => {
  let active = true;
  const fx = () => {
    if (active) {
      effects.push(fx);
      try { value = fn(value) }
      finally { effects.pop() }
    }
  };
  const dispose = () => {
    active = false;
    for (const dispose of disposes.get(fx))
      dispose();
  };
  disposes.set(fx, []);
  const {length} = effects;
  if (length)
    disposes.get(effects[length - 1]).push(dispose);
  return fx(), dispose;
};

/**
 * Returns a writable Signal that side-effects whenever its value gets updated.
 * @template T
 * @type {<T>(value: T) => Signal<T>}
 */
export const signal = value => new Signal(value);

const effects = [];
const disposes = new WeakMap;
const dispatch = effects => {
  for (const effect of new Set(effects))
    effect();
};

let batches = effects;
