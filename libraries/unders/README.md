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
  !!'' === false,
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

A shortcut for creating the element and applying the title and id attributes:

```js
const ___div = ___elem('div#foo-div.foo.bar.baz|title=Foo', {/* options */}, [/* children */]);
```

The above would render:

```html
<div id="foo-div" class="foo bar baz" title="Foo">
    <b>DANGEROUSLY INSERT HTML</b>
    <p class="child1">First child.</p>
    <p class="child2">
        Text for child2, part 1.
        <br>
        Some more text for child2.
    </p>
</div>
```

> Not shown: event listeners (they exist in memory).

An `<input>` element can be easily created:

```js
const _inputWithLabel = ___elem('label|title="Last Name"', [
  ['input:text#user-last.required.alpha?lastname|placeholder="Last"|required']
]);
```

It would render:

```html
<label title="Last Name">
    <input type="text" id="user-last" class="required alpha" name="lastname" placeholder="Last" required/>
</label>
```

Let's break down the `<input>` element string:

| part              | description                                                                   |
|-------------------|-------------------------------------------------------------------------------|
| `input`           | tagName                                                                       |
| `:text`           | `:` - shortcut for `<input>` `type` attribute (ignored on non-input elements) |
| `#user-last`      | `#` - shortcut `id`: adds `id="user-lastname"`                                |
| `.required.alpha` | `.` - shortcut for className: `class="required alpha"`                        |
| `?lastname`       | `?` - shortcut for the `name` attribute of a form element: `name="lastname"`  |
| `\|other="Other"` | `\|` - shortcut for pipe-separated list of _any/all_ other attributes         |


> NOTE: When using the shortcuts, they MUST be in the order shown above:

- ALL elements: <br> 
  `tagName`, `#id`, `.class`, `|title=Title|data-foo=bar|disabled`
<br><br>
- Form elements can have a `?name` shortcut (the last 'shortcut' attribute):
  <br>
  `tagName`, `#id`, `.class`, `?name`, `|title=Title|data-foo=bar|disabled`
<br><br>
- Input `<input>` elements can also have a `type` shortcut (immediately after `tagName`): 
  <br> 
  `tagName`, `:type`, `#id`, `.class`, `?name`, `|title=Title|data-foo=bar|disabled`
<br><br>
- All attributes can also be added explicitly using the pipe-separated syntax (quotes optional):
  <br>
  `input|type=text|id=user-last|class=required alpha|name=lastname|title=Last Name|placeholder=Last Name`
<br><br>
- The attribute list can have spaces between the attributes (around the `|`) for better readability:
  <br>
  `div | id="foo-div" | class="foo bar baz" | title="Foo"`

> The pipe `|` character _must_ be used as the delimiter between attributes. This means it can't be
> used in any of the attribute values. 🤷‍♂️ Outer single and double quotes in the attribute _values_ 
> can be problematic as well - tread carefully. (Single or double quotes can be used to enclose
> the attribute values without issue.)

---
