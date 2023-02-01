> This library is deprecated and will not see further development in the foreseeable future. 
> At some point, there _may_ some refactoring done to modernize it using modern JavaScript 
> features and patterns, but just for fun.

# x0

## _A legacy JavaScript library from a simpler time._

### What can `x0` do?

 - Programatically generate HTML elements, output as an HTML string or a tree of DOM nodes.
 - ⬆️ Do that for XML as well.
 - Make DOM updates
 - Allow use of an alternate syntax for more quickly selecting elements. _(but why???)_
 - Generate random 'hipsum' filler text - specify the number of words, sentences, and paragraphs.
 - Support old browsers that should never be supported again!

### What is this crap?

It's a _legacy_ library with many functions that were used in a _legacy_ web app. It borrows 
(or re-implements) functions from libraries such as `lodash` and `jQuery`. These functions were 
added _as-needed_ to the app codebase (but not _all_ of the functions in this library) to avoid 
dependency on large third-party libraries for fairly basic JavaScript functions.

### Why is this here?

I wrote it. It's old and probably contains loads of anti-patterns, but here it is and there ya go.

---

#### Example: spawn a tree of DOM nodes

```js
function clearTodo(e){
  e.target.remove();
}

const groceryList = x0.spawnElement('ul#groceries.todos|title=Grocery List', [
  ['li', { onclick: clearTodo }, 'milk'],
  ['li', { onclick: clearTodo }, 'eggs'],
  ['li', { onclick: clearTodo }, 'bread'],
  ['li', { onclick: clearTodo }, 'ice cream']
]);
// You can assign the output to a variable for rendering or further manipulation
// (even after it's added to the page)
groceryList.render('#container')
```

The above JavaScript will render the following elements into the `#container` div.

```html
<div id="container">
  <ul id="groceries" class="todos" title="Grocery List">
    <li>milk</li>
    <li>eggs</li>
    <li>bread</li>
    <li>ice cream</li>
  </ul>
</div>
```

It's possible to manipulate the spawned elements after rendering to the page.

```js
// Neanderthal state management
let listItem = '';

function addToList(what) {
  groceryList.append(x0.spawnElement('li', { onclick: clearTodo }, what).get());
  listItem = '';
}

const listItemInput = x0.spawnElement(
  'input|type=text|name=newItem', 
  { 
    placeholder: 'New List Item',
    onchange: (e) => listItem = e.target.value
  }
).get();

x0.spawnElement('form', {
  onsubmit: (e) => e.preventDefault() 
}, [
  listItemInput,
  ['br'],
  ['button|type=button', { onclick: () => addToList(listItem) }, 'Add To List']
]).appendTo('#container');
// ^^^ Use `appendTo` instance method to prevent overwriting existing content
```

Here's the final HTML output, with event listeners bound and ready to handle the events.

```html
<div id="container">
  <ul id="groceries" class="todos" title="Grocery List">
    <li>milk</li>
    <li>eggs</li>
    <li>bread</li>
    <li>ice cream</li>
  </ul>
  <form>
    <input type="text" placeholder="New List Item">
    <br>
    <button type="button">Add To List</button>
  </form>
</div>
```

This pattern is very much like that used in [hyperscript](https://github.com/hyperhype/hyperscript) 
(and somewhat like React's non-JSX syntax), but was written without knowledge of those libraries.
The `spawnElement` method can be easier to read and work with since the child 'nodes' can be an
array of the arguments, rather than calling the creation function for every single node (that still
happens behind the scenes).
