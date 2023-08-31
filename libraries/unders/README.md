# Unders

## Tiny JavaScript (f)utility Library

<small>(not a typo)</small>

```js
import ___, { 
  allTrue, 
  createElement as ___elem, 
  isEmpty, 
  queryAll, 
  querySelector,
  ___HTML
} from 'unders';

// ___.* are static methods of 'unders'
// (as are the named imports)
const theseThings = allTrue(
  document.body === querySelector('body'),
  queryAll('#foo-div')[0] === ___.getById('foo-div'),
  !0,
  !'' === false,
  isEmpty({}),
  isEmpty(''),
  isEmpty([])
);

console.log(theseThings);
// -> true

const ___div = ___elem('div.foo.bar.baz', { 
  // Explicitly call: ___div.setAttribute('title', 'Foo'));
  attr: {
    title: 'Foo'
  },
  // Apply value as a property: ___div.id = 'foo'
  prop: { 
    id: 'foo-div',
  },
  on: [
    // See: 
    // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
    ['click', () => doSomething(), { capture: true }],
    // Add multiple click handlers
    ['click', (e) => console.log(`Current target: ${e.currentTarget.tagName}`)],
    ['mouseover', (e) => console.log(`Hovering ${e.target.tagName}.`)]
  ],
}, [
  ___HTML + '<b>DANGEROUSLY INSERT HTML</b>',
  ['p.child1', 'First child.'],
  ['p.child2', [
    'Text for child2, part 1.',
    ['br', 'This text will be ignored since <br> is a void element.'],
    'Some more text for child2.'
  ]],
  ''
]);

```
