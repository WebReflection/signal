'use strict';
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

const drain = Symbol();
exports.drain = drain;

const signal = value => new Signal(value);
exports.signal = signal;
class Signal {
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
      dispatch(this._effects, true);
    }
  }
  peek() { return this._value }
  then() { return this.value }
  toJSON() { return this.value }
  valueOf() { return this.value }
  toString() { return String(this.value) }
}
exports.Signal = Signal

const computed = (fn, value) => new Computed(fn, value);
exports.computed = computed;
class Computed extends Signal {
  constructor(fn, value) {
    super(value).dispose = effect(() => {
      super.value = fn(this._value);
    });
  }
  get value() { return super.value }
  set value(_) { throw new Error('computed.value is read-only') }
}
exports.Computed = Computed

const effect = (fn, value) => {
  const fx = () => { value = fn(value) };
  const dispose = () => {
    disposed.add(fx);
    for (const dispose of disposes.get(fx))
      dispose();
  };
  disposes.set(fx, []);
  const {length} = effects;
  if (length)
    disposes.get(effects[length - 1]).push(dispose);
  effects.push(fx);
  try { return fx(), dispose }
  finally { effects.pop() }
};
exports.effect = effect;
