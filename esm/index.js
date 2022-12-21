/*! (c) Andrea Giammarchi */

const effects = [];
const disposed = new WeakSet;
const disposes = new WeakMap;
const dispatch = (effects, invoke) => {
  for (const effect of effects) {
    if (disposed.has(effect))
      effects.delete(effect);
    else if (invoke)
      effect();
  }
};

let batches = effects;
export const batch = callback => {
  const root = batches === effects;
  if (root)
    batches = [];
  try { callback() }
  finally {
    if (root) {
      const set = new Set(batches);
      batches = effects;
      dispatch(set, true);
    }
  }
};

export const drain = Symbol();

export const signal = value => new Signal(value);
export class Signal {
  constructor(value) {
    this._value = value;
    this._effects = new Set;
  }
  get value() {
    const {length} = effects;
    if (length)
      this._effects.add(effects[length - 1]);
    return this._value;
  }
  set value(value) {
    if (value === drain)
      dispatch(this._effects, false);
    else if (this._value !== value) {
      this._value = value;
      if (batches === effects)
        dispatch(this._effects, true);
      else
        batches.push(...this._effects);
    }
  }
  peek() { return this._value }
  then() { return this.value }
  toJSON() { return this.value }
  valueOf() { return this.value }
  toString() { return String(this.value) }
}

export const computed = (fn, value) => new Computed(fn, value);
export class Computed extends Signal {
  constructor(fn, value) {
    super(value).dispose = effect(() => {
      super.value = fn(this._value);
    });
  }
  get value() { return super.value }
  set value(_) { throw new Error('computed.value is read-only') }
}

export const effect = (fn, value) => {
  const fx = () => { value = fn(value) };
  const dispose = () => {
    disposed.add(fx);
    for (const dispose of disposes.get(fx))
      dispose();
  };
  disposes.set(fx, []);
  const i = effects.push(fx) - 1;
  if (i) disposes.get(effects[i - 1]).push(dispose);
  try { return fx(), dispose }
  finally { effects.pop() }
};
