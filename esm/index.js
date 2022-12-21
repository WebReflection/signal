/*! (c) Andrea Giammarchi */

const effects = [];
const disposed = new WeakSet;
const dispatch = effects => {
  for (const effect of effects) {
    if (disposed.has(effect))
      effects.delete(effect);
    else
      effect();
  }
};

export const signal = value => new Signal(value);
export class Signal {
  constructor(value) {
    this._value = value;
    this._effects = new Set;
  }
  get value() {
    const {length} = effects;
    if (length) this._effects.add(effects[length - 1]);
    return this._value;
  }
  set value(value) {
    if (this._value !== value) {
      this._value = value;
      dispatch(this._effects);
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
      this._value = fn(this._value);
      dispatch(this._effects);
    });
  }
  get value() { return super.value }
  set value(_) { throw _ }
}

export const effect = (fn, value) => {
  const fx = () => { value = fn(value) };
  effects.push(fx);
  try { return fx(), () => { disposed.add(fx) } }
  finally { effects.pop() }
};
