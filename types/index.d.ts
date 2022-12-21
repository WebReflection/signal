export class Signal<T> {
  constructor(value: T);
  value: T;
  peek(): T;
  then(): T;
  toJSON(): T;
  valueOf(): T;
  toString(): string;
}

export class Computed<T> extends Signal<T> {
  constructor(fn: (v: T) => T, value?: T);
  readonly value: T;
  dispose(): () => void;
}

export const signal: <T>(value?: T) => Signal<T>;

export const computed: <T>(fn: (v?: T) => T, value?: T) => Computed<T>;

export const effect: <T>(fn: (v?: T) => T, value?: T) => () => void;

export const batch: () => void;

export const drain: Symbol;
