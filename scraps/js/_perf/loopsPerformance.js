// -------------------------------------------------------------------------------------------------------
// Answering the age-old question of "Which kind of JavaScript loop is fastest?"
// -------------------------------------------------------------------------------------------------------
// TL;DR: It doesn't matter these days - they're all pretty much the same (but `while` is fastest 😎)
// RANT: STOP USING `for (let i = 0; i < arr.length; i++)` WHO CAN READ THAT??? I'M NOT A COMPUTER!
// How about...  `while (++i < len)`???  (after assigning `i = -1` and `len = arr.length`...)
// -------------------------------------------------------------------------------------------------------
// Original reference:
// https://blog.bitsrc.io/measuring-performance-of-different-javascript-loop-types-c0e9b1d193ed
// NOTE: The Firefox results in the link above are very slow because of a small bug in the example code...
// ...Firefox is just as fast as Chrome after the bug fix (adding 'let' to the variable declaratons) 🙄
// -------------------------------------------------------------------------------------------------------
let filler;


filler = new Array(500_000).fill(Math.random());


function __for__(arr) {
  const NAME = `for [].push()`;
  let i = 0;
  let n = arr.length;
  const out = [];
  console.time(NAME);
  for (i; i < n; i++) {
    out.push(arr[i]);
  }
  console.timeEnd(NAME);
  return out[0];
}
__for__([...filler]);


function __for_index__(arr) {
  const NAME = `for [index]`;
  let i = 0;
  let n = arr.length;
  const out = [];
  console.time(NAME);
  for (i; i < n; i++) {
    out[i] = arr[i];
  }
  console.timeEnd(NAME);
  return out[0];
}
__for_index__([...filler]);


function __forOf__(arr) {
  const NAME = `for...of [].push()`;
  const out = [];
  console.time(NAME);
  for (const val of arr) {
    out.push(val);
  }
  console.timeEnd(NAME);
  return out[0];
}
__forOf__([...filler]);


function __forOf_index__(arr) {
  const NAME = `for...of [index]`;
  let i = 0;
  const out = [];
  console.time(NAME);
  for (const val of arr) {
    out[i] = val;
    i++;
  }
  console.timeEnd(NAME);
  return out[0];
}
__forOf_index__([...filler]);


function __forEach__(arr) {
  const NAME = `.forEach() [].push()`;
  const out = [];
  console.time(NAME);
  arr.forEach((val, i) => {
    out.push(val);
  });
  console.timeEnd(NAME);
  return out[0];
}
__forEach__([...filler]);


function __forEach_index__(arr) {
  const NAME = `.forEach() [index]`;
  const out = [];
  console.time(NAME);
  arr.forEach((val, i) => {
    out[i] = val;
  });
  console.timeEnd(NAME);
  return out[0];
}
__forEach_index__([...filler]);


function testingWhile(arr) {
  const NAME = `while - original + let`;
  console.time(NAME);
  const res = [];
  let i = 0;
  let n = arr.length;
  while (i < n) {
    res.push(arr[i]);
    i++;
  }
  console.timeEnd(NAME);
  return res[0];
}
testingWhile([...filler]);


function __while__(arr) {
  const NAME = `while [].push()`;
  let i = -1;
  let n = arr.length;
  const out = [];
  console.time(NAME);
  while (++i < n) {
    out.push(arr[i]);
  }
  console.timeEnd(NAME);
  return out[0];
}
__while__([...filler]);


function __while_index__(arr) {
  const NAME = `while [index]`;
  let i = -1;
  let n = arr.length;
  const out = [];
  console.time(NAME);
  while (++i < n) {
    out[i] = arr[i];
  }
  console.timeEnd(NAME);
  return out[0];
}
__while_index__([...filler]);

// DO NOT EXECUTE THE CODE BELOW...
// IT IS SLOW AND WREAKS HAVOC ON MEMORY.

// function __while_shift__(arr) {
//   const NAME = `while [].push([].shift())`;
//   const out = [];
//   console.time(NAME);
//   while (arr.length) {
//     out.push(arr.shift());
//   }
//   console.timeEnd(NAME);
//   return out[0];
// }
// __while_shift__([...filler]);
//
//
// function __while_shift_index__(arr) {
//   const NAME = `while [].shift() [index]`;
//   let i = 0;
//   const out = [];
//   console.time(NAME);
//   while (arr.length) {
//     out[i] = arr.shift();
//     i++;
//   }
//   console.timeEnd(NAME);
//   return out[0];
// }
// __while_shift_index__([...filler]);
