(function iife(factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    return factory();
  }
}(function factory() {

  /**
   * function to create old-fashioned DOM elements. What's wrong with the DOM?
   * @param {string|Array|null} tag - HTML tagName, arguments array, or null
   * @param {Object|Array|string} [opts] - config object or children argument
   * @param {Array|string} [children] - child array(s)
   * @returns {Object} - returns object with helper methods to get outer element or render to page
   * @example
   * const header = spawnElement('div#page-wrapper.foo', {}, [
   *     ['h1', 'This is the header'],
   *     ['h2', 'This is the subhead'],
   *     ['p', [
   *         ['', 'This is a fragment in the paragraph with some pointless words.'],
   *         ['pre', 'This is some pre-formatted text.'],
   *         ['small', 'This is some small text.'],
   *         ['ul#some-things', {}, [
   *             ['li', 'First list item.'],
   *             ['li', 'Second list item.'],
   *             ['li', 'Third list item.']
   *         ]]
   *     ]]
   * ])
   */
  function spawnElement(tag, opts, children) {

    if (Array.isArray(tag)) {
      [tag, opts, children] = tag;
    }

    const element = parseTag(tag);

    const spawned = {};

    spawned.element = element;
    spawned.spawned = element;
    spawned.get = (fn) => {
      if (isFunction(fn)) {
        fn.call(spawned, element);
      }
      return element;
    };
    spawned.outerHTML = () => {
      return element.outerHTML;
    };
    spawned.clone = () => element.cloneNode(true);
    spawned.children = () => {
      return [].slice.call(element.children);
    };
    spawned.append = (content) => {
      [].concat(content).forEach((item) => {
        appendItem(element, item, spawnElement);
      });
      return spawned;
    };
    spawned.render = (parent) => {
      parentContext(parent).appendChild(element);
      return spawned;
    };


    // config params that can be used in `opts`
    const methods = {
      id: function (id) {
        spawned.element.id = id;
        return spawned;
      },
      classes: function (classNames) {
        const el = spawned.element;
        el.className = [].concat([el.className], classNames).join(' ').replace(/\s+/, ' ').trim();
        return spawned;
      },
      prop: function (obj) {
        const el = spawned.element;
        for (let [p, v] of Object.entries(obj)) {
          try {
            el[p] = v;
          } catch (e) {
            console.warn(e);
          }
        }
        return spawned;
      },
      attr: function (obj) {
        const el = spawned.element;
        for (let [a, v] of Object.entries(obj)) {
          try {
            el.setAttribute(a, v);
          } catch (e) {
            console.warn(e);
          }
        }
        return spawned;
      },
      style: function (obj) {
        const el = spawned.element;
        for (let [s, v] of Object.entries(obj)) {
          el.style[s] = v;
        }
        return spawned;
      },
      data: function (obj) {
        const el = spawned.element;
        for (let [d, v] of Object.entries(obj)) {
          el.dataset[d] = v;
        }
        return spawned;
      },
      text: function (content) {
        const el = spawned.element;
        el.textContent = content;
        return spawned;
      },
      html: function (content) {
        const el = spawned.element;
        if (content != null) {
          el.innerHTML = content;
          return spawned;
        }
        if (spawned.element.outerHTML) {
          return spawned.element.outerHTML;
        }
      },
      appendElement: function (content) {
        const el = spawned.element;
        appendItem(el, content, spawnElement);
        return spawned;
      },
      on: function (listeners) {
        const el = spawned.element;
        console.log(arguments);
        listeners.forEach((listener) => {
          const [type, callback] = listener;
          el.addEventListener(type, callback);
        });
        return spawned;
      },
      ___: function () { return spawned; }
    };
    methods.className = methods.classes;
    methods.css = methods.style;
    methods.dataset = methods.data;
    methods.textContent = methods.text;
    // methods.innerHTML = function(el, content){
    //     return el.innerHTML = content
    // };
    methods.innerHTML = methods.html;
    methods.appendChild = methods.appendElement;
    methods.addClass = (classNames) => {
      const el = spawned.element;
      [].concat(classNames).forEach((className) => {
        if (!el.classList.contains(className)) {
          el.classList.add(className);
        }
      });
      return spawned;
    };


    // add option methods to the retured 'spawned' object
    for (let [method, callback] of Object.entries(methods)) {
      spawned[method] = callback;
    }


    if (isPlainObject(opts)) {
      for (let [method, args] of Object.entries(opts)) {
        if (methods.hasOwnProperty(method)) {
          try {
            methods[method].call(spawned, args);
          } catch (e) {
            console.warn(e);
          }
        }
      }
    }

    children = firstDefined(children, opts);

    if (Array.isArray(children)) {
      children.forEach((child) => {
        appendItem(element, child, spawnElement);
      });
    } else if (stringable(children)) {
      if (isFragment(element)) {
        element.textContent += children;
      } else {
        element.innerHTML += children;
      }
    }

    return spawned;

  }


  // a parseable tag uses the pattern 'tag#id.class1.class2?name|attr=value'
  // --> <tag id="id" class="class1 class2" name="name" attr="value"></tag>
  function parseTag(t) {

    let tag = t || '!';

    // does the tag string indicate a fragment?
    // fragment 'tag' would be: '<>', '</>', '!', '#', '', undefined, or null
    if (/^(<>|<\/>|!|#)/.test(tag) || tag === '' || tag == null) {
      return document.createDocumentFragment();
    }

    let attrs, name, classes, id;

    // does the tag have attribute 'shortcuts' that can be parsed?
    if (/[#.,?|]/.test(tag)) {

      // split any attributes
      attrs = tag.split(/[,|]/);

      // shift out the tag
      tag = attrs.shift();

      // is there a 'name' shortcut?
      tag = tag.split('?');
      name = tag[1];
      name = (name || '').trim();

      tag = tag[0];

      // any classes?
      classes = tag.split('.');

      // shift out the tag again
      tag = classes.shift();

      // should have just tag and id (if present) remaining
      tag = tag.split('#');

      // is there an id?
      id = tag[1];
      id = (id || '').trim();

      // actual tag is last
      tag = tag[0];
      tag = (tag || '').trim();

    }

    const element = document.createElement(tag);

    if (id) {
      element.id = id;
    }

    if (name) {
      element.name = name;
    }

    if (classes && classes.length) {
      classes.forEach((className) => {
        className = className.trim();
        if (element.classList && !element.classList.contains(className)) {
          element.classList.add(className);
        }
      });
    }

    if (attrs && attrs.length) {
      attrs.forEach((attr) => {
        let [name, value] = attr.trim().split('=');
        name = name.trim();
        value = value.trim().replace(/^[\s"']+|[\s"']+$/g, '');
        if (element.setAttribute) {
          element.setAttribute(name, value);
        }
      });
    }

    return element;

  }


  // a parseable tag uses the pattern 'tag#id.class1.class2|attr=value'
  // --> <tag id="id" class="class1 class2" attr="value"></tag>
  // spawnElement('input#username|name=username|data-validate=alphanum:strict|title=Username is required|required')
  // spaces can be used between attributes for legibility (pipe required as a delimiter)
  // spawnElement('input #username | name=username | data-validate=alphanum:strict | title=Username is required | required')
  // --> <input id="username" name="username" data-validate="alphanum:strict" title="Username is required" required>
  // data can be dynamically inserted using mustache-style syntax with custom modifiers
  // spawnElement('input#ur-info|value={{https://server.net/ur/info}}')
  // or if data is required for multiple elements, it's possible to `@load` data in a parent element
  // which child elements can access using JSONPath syntax
  // given data structured like:
  function spawnExample(username) {
    const profile = {
      username: 'bob.robertson',
      email: 'bob.robertson@bogus.net',
      profile: {
        pets: [
          { name: 'George', type: 'dog' },
          { name: 'Fred', type: 'cat' },
          { name: 'Lucas', type: 'ferret' }
        ],
        hobbies: [
          'Underwater basketweaving',
          'golf',
          'skydiving',
          'connect four'
        ]
      }
    };
    function submitData() {
    }
    return spawnElement('form#user-info', {
      load: 'https://server.net/user/data/' + username,
      state: {},
      attr: { action: '#' },
      on: [
        ['submit', (e) => {
          e.preventDefault();
          const userData = {};
          [].slice.call(e.target.elements).forEach((field) => {
            return userData[field.name] = field.value;
          });
          submitData({
            url: 'https://server.net/user/data/' + username,
            method: 'POST',
            data: userData,
            type: 'application/json'
          });
        }],
        ['change', 'input.email', (e) => {
          console.log(e.target.value);
        }]
      ]
    }, [
      ['input.username?username|value=$.username|@validate=format:email'],
      ['input.email?email|value=$.email'],
      ['div.profile-data', ['$.profile'].map((profile) => {
        return ['p.user-profile', [
          ['!', profile.pets.map((pet) => {
            const { name, type } = pet;
            return ['!', [
              ['input?pets[].name', { value: name }],
              ['input?pets[].type', { value: type }]
            ]];
          })]
        ]];
      })]
    ]);
  }


  function appendItem(el, item, spawnFn) {
    try {
      if (stringable(item)) {
        el[isFragment(el) ? 'insertAdjacentText' : 'insertAdjacentHTML']('beforeend', item);
      } else if (appendable(item)) {
        el.appendChild(item);
      } else if (Array.isArray(item)) {
        el.appendChild(spawnFn.apply(null, item).get());
      }
    } catch (e) {
      console.warn(e);
    }
  }

  function parentContext(parent) {
    if (appendable(parent)) {
      return parent;
    }
    return document.querySelector(parent) || document.body;
  }

  function isPlainObject(it) {
    return Object.prototype.toString.call(it) === '[object Object]';
  }

  function isFunction(it) {
    return typeof it === 'function';
  }

  function isObject(it) {
    return isPlainObject(it) || isFunction(it);
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

  function firstDefined(a, b, c, etc) {
    let undef;
    for (let arg of arguments) {
      if (arg !== undef) {
        return arg;
      }
    }
  }

  Object.assign(window, {
    appendItem,
    spawnElement
  });

  return spawnElement;

}));
