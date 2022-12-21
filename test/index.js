const {signal, computed, effect, drain} = require('../cjs');

const assert = (got, expected) => {
  if (got !== expected) {
    console.error('expected', expected, 'got', got);
    process.exit(1);
  }
};

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
sum.dispose();
assert(min.value, 12);

assert(single.peek(), 2);
single.value = drain;
assert(single.peek(), 2);

single.value++;
double.value++;
triple.value++;
assert(min.value, 112 - triple.value);

assert(sum.value, 112);
assert(sum.toJSON(), 112);
assert(sum.toString(), '112');
assert(sum.valueOf(), 112);
assert(sum.then(), 112);
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
