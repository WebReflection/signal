const {Signal, Computed, signal, computed, effect} = require('../cjs');

const single = signal(1);
const double = signal(10);
const triple = signal(100);

const sum = computed(() => single + double + triple);

console.assert(sum.value === 111);
console.assert(single.peek() === 1);
single.value++;

console.assert(sum.value === 112);
sum.dispose();
single.value++;

console.assert(sum.value === 112);
console.assert(sum.toJSON() === 112);
console.assert(sum.toString() === 112);
console.assert(sum.valueOf() === 112);
console.assert(sum.then() === 112);
console.assert(sum.peek() === 112);
