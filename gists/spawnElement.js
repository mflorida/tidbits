(function umd(factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  }
  else if (typeof exports === 'object') {
    module.exports = factory();
  }
  else {
    return factory();
  }
}(function factory(window) {
  // methods for params that can be used in `opts`
  const spawnFn = {
    id: (elem, id) => {
      elem.id = id;
    },
    className: (elem, classNames) => {
      // totally replace any existing classNames
      elem.className = classNameArray(classNames).join(' ');
    },
    // addClass: (elem, classNames) => {
    //   // add to existing classList
    //   for (let className of classNameArray(classNames)) {
    //     elem.classList.add(className);
    //   }
    // },
    // removeClass: (elem, classNames) => {
    //   // remove from existing classList
    //   for (let className of classNameArray(classNames)) {
    //     elem.classList.remove(className);
    //   }
    // },
    prop: (elem, obj) => {
      for (let [p, v] of Object.entries(obj)) {
        try {
          elem[p] = v;
        }
        catch (e) {
          console.warn(e);
        }
      }
    },
    attr: (elem, obj) => {
      for (let [a, v] of Object.entries(obj)) {
        try {
          elem.setAttribute(a, v);
        }
        catch (e) {
          console.warn(e);
        }
      }
    },
    style: (elem, obj) => {
      for (let [s, v] of Object.entries(obj)) {
        elem.style[s] = v;
      }
    },
    data: (elem, obj) => {
      for (let [d, v] of Object.entries(obj)) {
        elem.dataset[d] = v;
      }
    },
    text: (elem, text) => {
      elem.textContent = isFunction(text) ? text.call(elem, elem) : text;
    },
    html: (elem, html) => {
      elem.innerHTML = isFunction(html) ? html.call(elem, elem) : html;
    },
    // prepend: (elem, content) => {
    //   elem.prepend(spawnElement('!', content));
    // },
    // append: (elem, content) => {
    //   elem.append(spawnElement('!', content));
    // },
    // // add explicit `append*` methods
    // // if the content and intention are known
    // appendText: (elem, text) => {
    //   elem.textContent += text;
    // },
    // appendHTML: (elem, html) => {
    //   elem.innerHTML += html;
    // },
    // appendChild: (elem, child) => {
    //   elem.appendChild(child);
    // },
    children: (elem, children) => {
      spawnElement(elem, children);
    },
    func: (elem, fn) => {
      fn.call(null, elem);
    },
    // helper for 'on' and 'off'
    events: (elem, addRemove, events) => {

      let method = 'addEventListener';

      if (/^(remove|off)/i.test(addRemove)) {
        method = 'removeEventListener';
      }

      // most straightforward pattern:
      // on: { click: handleClick }
      if (isPlainObject(events)) {
        for (let [type, fn] of Object.entries(events)) {
          elem[method](type, fn);
        }
      }
      else {

        let [evt, fn] = events;

        // alternate map-like pattern
        // on: ['click', doSomething]
        if (typeof evt === 'string') {
          elem[method](evt, fn);
          return;
        }

        // other patterns - allows multiple handlers for same event type:
        // on: [['hover', handleHover], ['click', handleClick], ['click', handleClickToo]]
        // on: [{ hover: handleHover }, { click: handleClick }, { click: handleClickToo }]
        for (evt of events) {
          let [type, fn] = Array.isArray(evt) ? evt : Object.entries(evt);
          elem[method](type, fn);
        }

      }
    },
    on: (elem, events) => {
      spawnFn.events(elem, 'add', events);
    },
    off: (elem, events) => {
      spawnFn.events(elem, 'remove', events);
    },
    ___: () => {}
  };
  spawnFn.classes = spawnFn.className;
  // spawnFn.addClasses = spawnFn.addClass;
  // spawnFn.removeClasses = spawnFn.removeClass;
  spawnFn.css = spawnFn.style;
  spawnFn.dataset = spawnFn.data;
  spawnFn.textContent = spawnFn.text;
  spawnFn.innerHTML = spawnFn.html;
  // spawnFn.appendChildren = spawnFn.append;
  spawnFn.fn = spawnFn.func;
  spawnFn.apply = spawnFn.func;
  spawnFn.call = spawnFn.func;

  /**
   * Spawn old-fashioned DOM elements
   * @param {string|Array|null|undefined} tag - HTML tagName or arguments array
   * @param {Object|Array|string|Element|Function} [opts] - config object or children argument
   * @param {Array|string|Element|Function} [children] - child array(s), HTML string, or DOM element
   * @returns {Object} - returns object with `spawnElement`
   */
  function spawnElement(tag, opts, children) {

    // use an object to store the arguments
    const args = { tag, opts, children };

    let spawned = null;

    if (Array.isArray(tag)) {
      [args.tag, args.opts, args.children] = tag;
    }

    // create fragment if tag is null, empty string,
    // or one of: '!', '#', '<>', '</>'
    if (!args.tag || /^(<>|<\/>|!|#)$/.test(args.tag)) {
      spawned = document.createDocumentFragment();
    }
    // apply changes to element or fragment if passed as `tag`
    else if (appendable(args.tag)) {
      spawned = args.tag;
    }
    else {
      try {
        // TODO: create `parseTag()` function to allow attribute 'shortcuts':
        // spawnElement('div#foo.bar|title=baz', 'Hello.');
        // => <div id="foo" class="bar" title="baz">Hello.</div>
        spawned = document.createElement(args.tag);
      }
      catch (e) {
        console.warn(e);
        // should a fragment or div or span be created by default if there's an error?
        spawned = document.createDocumentFragment();
      }
    }

    console.log(spawned);

    function renderElement(parent, empty) {
      const parentElement = parentContext(parent);
      if (empty) { parentElement.textContent = ''; }
      parentElement.appendChild(spawned);
    }

    function updateElement(opts, children) {
      if (isFunction(opts)) {
        opts.call(null, spawned);
      }
      else {
        spawnElement(spawned, opts, children);
      }
    }

    // add `render` method to assist in DOM insertion
    // (do not overwrite existing 'render' method if present)
    spawned.render = spawned.spawnedElement ? spawned.render : renderElement;
    spawned.appendTo = spawned.render;

    spawned.update = spawned.spawnedElement ? spawned.update : updateElement;

    // add property to allow modification of
    // spawned elements by passing as `tag` argument
    spawned.spawnedElement = true;

    // leave early if there's only one argument
    if (!args.opts && !args.children) {
      return spawned;
    }

    if (isPlainObject(args.opts)) {

      for (let [fnName, fnArgs] of Object.entries(args.opts)) {

        if (spawnFn.hasOwnProperty(fnName)) {
          try {
            spawnFn[fnName].call(null, spawned, fnArgs);
          }
          catch (e) {
            console.warn(e);
          }
          continue;
        }

        if (/^(on[A-Za-z])/.test(fnName)) {
          fnName = fnName.replace(/^on/i, '').toLowerCase();
          spawnFn.on(spawned, [fnName, fnArgs]);
          continue;
        }

        console.warn(`Method '${fnName}' is not defined.`);

      }
    }

    args.children = firstDefined(args.children, args.opts);

    if (appendable(args.children)) {
      spawned.textContent = '';
      spawned.appendChild(args.children);
    }
    else if (Array.isArray(args.children)) {
      spawned.textContent = '';
      for (let child of args.children) {
        appendItem(spawned, child);
      }
    }
    else if (stringable(args.children)) {
      spawned.innerHTML = args.children;
    }
    else if (isFunction(args.children)) {
      appendItem(spawned, args.children(spawned));
    }

    return spawned;

  }

  function firstDefined(a, b, c, etc) {
    let undef;
    for (let arg of arguments) {
      if (arg !== undef) {
        return arg;
      }
    }
  }

  function isPlainObject(it) {
    return Object.prototype.toString.call(it) === '[object Object]';
  }

  function isFunction(it) {
    return typeof it === 'function';
  }

  function isElement(it) {
    return it instanceof Element;
  }

  function isFragment(it) {
    return it instanceof DocumentFragment;
  }

  function stringable(it) {
    return /^(string|number)$/.test(typeof it);
  }

  function appendable(it) {
    return isElement(it) || isFragment(it);
  }

  function parentContext(parent) {
    if (appendable(parent)) { return parent; }
    return document.querySelector(parent) || document.body;
  }

  function appendItem(elem, item) {
    try {
      if (Array.isArray(item)) {
        elem.appendChild(spawnElement.apply(null, item));
      }
      else if (appendable(item)) {
        elem.appendChild(item);
      }
      else if (stringable(item)) {
        elem[isFragment(elem) ? 'textContent' : 'innerHTML'] += item;
        // Is setting `innerHTML` dangerous? Maybe. But can be useful.
        // USE CARE WHEN PASSING A STRING AS A CHILD!
        // elem.innerHTML += item;
      }
      else if (isFunction(item)) {
        appendItem(elem, item(elem));
      }
    }
    catch (e) {
      console.warn(e);
    }
  }

  function classNameArray(classNames) {
    return [...(new Set([].concat(classNames).join(' ').trim().split(/\s+/)))];
  }

  window.appendItem = appendItem;
  window.spawnElement = spawnElement;

}))(window);
