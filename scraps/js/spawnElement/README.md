# Let's spawn some DOM nodes!

> NOTE: this 'library' was started many, many years ago and has been an ongoing experiment
> to try out new ideas and patterns that can be applied elsewhere. Even though there are
> great libraries like React, Vue, Svelte, and Solid (it's solid), this little library is
> here for historical (or hysterical) purposes.

This little library can create a DOM tree using a nested array of arrays with 'arguments'
as the elements of each 'child' array. The pattern is _similar_ to hyperscript or React.

Here's the simplest example that will create an empty div:

```js
// Input
const divA = spawnElement('div');
```
```html
<!-- Output -->
<div></div>
```

That's not super useful - we may as well use `document.createElement('div')`. But we can append to the `tag` 
string and add an id of `some-div`, a className of `bar` and a title of `Bar Baz`:

```js
// Input
const someDiv = spawnElement('div#some-div.foo|title=Bar Baz');
```
```html
<!-- Output -->
<div id="some-div" class="foo" title="Bar Baz"></div>
```

> Attributes can be defined directly in the `tag` string. They can be passed as pipe-separated `key=value` pairs. 
> It's not necessary to surround the values with quotes, but the `|` (pipe) and `=` characters can't be used (since 
> those are used as separators). The `id` and `class` attributes can be defined using a string appended to the `tag` 
> with a special CSS selector-like shortcut syntax: `tag#id.class`. (id must come first)

```js
// Here we're just returning an array that will be used to render a child element
const boldText = (text) => ['b', {}, text];

// Input
const advancedDiv = spawnElement('div#advanced', { title: 'Advanced' }, [
  ['p.child', {}, [
    `I'm just some text in a paragraph. What did you expect? `,
    ['', {}, `I'm a fragment just hanging out in a paragraph. 🤷‍♂️`],
    boldText(`I'm some bold text that comes after the fragment. `),
    `I'm some regular text. `,
    boldText(`I'm some more bold text. `)
  ]],
]);
```
```html
<!-- Output -->
<div id="advanced" title="Advanced">
  <p class="child">
    I'm just some text in a paragraph. What did you expect? 
    I'm a fragment just hanging out in a paragraph. 🤷‍♂
    <b>I'm some bold text that comes after the fragment.</b>
    I'm some regular text.
    <b>I'm some more bold text.</b>
  </p>
</div>
```

Now the question to be answered is: 

Q: "Why would I want to build my DOM tree this way??? This is dumb."
<br>
A: It's easier to programmatically determine what will be rendered and manipulate the created elements.

---

> _TODO: finish the README_
