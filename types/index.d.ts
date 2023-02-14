/**
 * Invoke a callback that updates many signals and runs effects only after.
 * @type {(fn:() => void) => void}
 */
export const batch: (fn: () => void) => void;

/**
 * Invokes a function when any of its internal signals or computed values change.
 * Returns a `dispose` callback.
 * @template T
 * @type {<T>(fn: (v?: T) => T | undefined, value?: T) => () => void}
 */
export const effect: <T>(fn: (v?: T) => T, value?: T) => () => void;

/**
 * A signal with a value property also exposed via toJSON, toString and valueOf.
 * @template T
 */
export class Signal<T> extends Set<any> {
    /** @param {T} value the value carried through the signal */
    constructor(value: T);

    /** @param {T} value the new value carried through the signal */
    set value(arg: T);

    /** @returns {T} */
    get value(): T;

    /** Returns the `value` without side-effects */
    peek(): T;

    /** Resolves the `Promise` with implicit side-effects */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: (value: T) => TResult1 | PromiseLike<TResult1>, onrejected?: (reason: any) => TResult2 | PromiseLike<TResult2>): Promise<TResult1 | TResult2>;

    /** Returns the `value` with implicit side-effects */
    toJSON(): T;

    /** Returns the `value` with implicit side-effects */
    valueOf(): T;
}

/**
 * Returns a writable Signal that side-effects whenever its `value` gets updated.
 * @template T
 * @type {<T>(value: T) => Signal<T>}
 */
export const signal: <T>(value: T) => Signal<T>;

/**
 * A read-only Signal extend that is invoked only when any of the internally
 * used signals, as in within the callback, is unknown or updated.
 * @template T
 * @extends {Signal<T>}
 */
export class Computed<T> extends Signal<T> {
    /**
     * @param {(v?: T) => T} fn the callback invoked when its signals changes
     * @param {T | undefined} value the optional initial value of the callback
     */
    constructor(fn: (v?: T) => T, value: T | undefined);

    /** @readonly @returns {T} */
    get value(): T;
}

/**
 * Returns a Computed signal that is invoked only when any of the internally
 * used signals, as in within the callback, is unknown or updated.
 * @template T
 * @type {<T>(fn: (v?: T) => T, value?: T) => Computed<T>}
 */
export const computed: <T>(fn: (v?: T) => T, value?: T) => Computed<T>;
