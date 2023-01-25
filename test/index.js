import {signal, computed, effect, batch} from '../esm/index.js';

const assert = (got, expected) => {
  if (got !== expected) {
    console.error('expected', expected, 'got', got);
    process.exit(1);
  }
};

console.time('@webreflection/signal');

const single = signal(1);
const double = signal(10);
const triple = signal(100);

const sum = computed(() => single + double + triple);
const min = computed(() => sum - triple);

assert(sum.value, 111);

effect(() => {
  console.log('computed in effect', sum.value);
});

assert(single.peek(), 1);
single.value++;

assert(sum.value, 112);
assert(min.value, 12);
sum.e.dispose();
assert(min.value, 12);

assert(single.peek(), 2);

single.value++;
double.value++;
triple.value++;
assert(min.value, 112 - triple.value);

assert(sum.value, 112);
assert(sum.toJSON(), 112);
assert(sum.toString(), '112');
assert(sum.valueOf(), 112);
assert(await sum, 112);
assert(sum.peek(), 112);

try {
  sum.value = 1;
  assert('assignment', 'cannot assign computed');
}
catch (OK) {}

let runs = 0;
const outer = effect(() => {
  runs++;
  console.log('outer effect', single.value);
  effect(() => {
    runs++;
    console.log('inner effect', double.value);
  });
});

assert(runs, 2);
++double.value;
assert(runs, 3);
outer();
++double.value;
assert(runs, 3);

runs = 0;
const d1 = effect(() => {
  runs++;
  console.log('');
  console.log('batched effect 1', single.value);
  console.log('batched effect 2', double.value);
});

assert(runs, 1);
batch(() => {
  single.value++;
  double.value++;
});
assert(runs, 2);
d1();
assert(runs, 2);

const cmp = computed(() => single + double);

console.log('');
runs = 0;
const d2 = effect(() => {
  runs++;
  console.log('batched computed', cmp.value);
});

assert(runs, 1);
batch(() => {
  single.value++;
  double.value++;
});
assert(runs, 2);
d2();
assert(runs, 2);
single.value++;
assert(runs, 2);

console.timeEnd('@webreflection/signal');
