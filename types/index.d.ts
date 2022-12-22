/*! (c) Andrea Giammarchi */
/**
 * A signal with a value property also exposed via toJSON, toString and valueOf.
 * @template T
 */
export class Signal<T> {
    /** @param {T} value the value carried through the signal */
    constructor(value: T);
    /** @param {T} value the new value carried through the signal */
    set value(arg: T);
    /** @returns {T} */
    get value(): T;
    peek(): T;
    then(): T;
    toJSON(): T;
    valueOf(): T;
    toString(): string;
    #private;
}
/**
 * A read-only Signal extend that is invoked only when any of the internally
 * used signals, as in within the callback, is unknown or updated.
 * @template T
 */
export class Computed<T> extends Signal<any> {
    /**
     * @param {(v?: T) => T} fn the callback invoked when its signals changes
     * @param {T | undefined} value the optional initial value of the callback
     */
    constructor(fn: (v?: T) => T, value: T | undefined);
    readonly set value(arg: T);
    /** @readonly @returns {T} */
    readonly get value(): T;
}
/**
 * Invoke a callback that updates many signals and runs effects only after.
 * @type {(fn:() => void) => void}
 */
export const batch: (fn: () => void) => void;
/**
 * Returns a Computed signal that is invoked only when any of the internally
 * used signals, as in within the callback, is unknown or updated.
 * @template T
 * @type {<T>(fn: (v?: T) => T, value?: T) => Computed<T>}
 */
export const computed: <T>(fn: (v?: T) => T, value?: T) => Computed<T>;
/**
 * A unique identifier to instantly free any signal from disposed effects.
 * @type {symbol}
 */
export const drain: symbol;
/**
 * Invokes a function when any of its internal signals or computed values change.
 * Returns a `dispose` callback.
 * @template T
 * @type {<T>(fn: (v?: T) => T | undefined, value?: T) => () => void}
 */
export const effect: <T>(fn: (v?: T) => T, value?: T) => () => void;
/**
 * Returns a writable Signal that side-effects whenever its value gets updated.
 * @template T
 * @type {<T>(value: T) => Signal<T>}
 */
export const signal: <T>(value: T) => Signal<T>;
