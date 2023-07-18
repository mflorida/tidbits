/**
 * JavaScript class-based implementation of the spawnElement() function.
 */
(function iife(factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    return factory();
  }
}(function factory() {

  const SpawnedElement = class SpawnedElementClass {
    constructor(tag, opts, children) {

      const args = {
        tag: tag,
        opts: opts,
        children: children
      };

      if (Array.isArray(tag)) {
        [args.tag, args.opts, args.children] = tag;
      }

      // keep a copy of the original args on the instance
      // useful for debugging?
      this.args = [args.tag, args.opts, args.children];

      // setting up the properties and methods
      // that can be in the 'opts' object
      this.opts = this.setOpts(this);

      args.tag = firstDefined(args.tag, tag, '');
      args.opts = firstDefined(args.opts, opts, null);
      args.children = firstDefined(args.children, children, args.opts, []);

      if (args.opts === args.children) {
        args.opts = {};
      }
      if (isPlainObject(args.opts)) {
        args.opts = Object.assign({}, args.opts);
      }

      // TODO: will this reference resolve properly?
      if (tag instanceof SpawnedElement) {
        Object.assign(this, tag, {
          element: tag.element.cloneNode(true)
        });
      } else {
        this.element = this.parseTag(args.tag);
      }

      // alias element to 'spawned'
      this.spawned = this.element;

      if (isPlainObject(args.opts)) {
        for (let [opt, val] of Object.entries(args.opts)) {
          if (this.opts.hasOwnProperty(opt)) {
            try {
              this.opts[opt].call(this, val);
            } catch (e) {
              console.warn(e);
            }
          }
        }
      }

      if (Array.isArray(args.children)) {
        args.children.forEach((child) => {
          this.appendItem(this.element, child, spawnElement);
        });
      } else if (stringable(args.children)) {
        if (isFragment(this.element)) {
          this.element.textContent += args.children;
        } else {
          this.element.innerHTML += args.children;
        }
      }

    }

    // end constructor()

    get(fn) {
      if (isFunction(fn)) {
        fn.call(this, this.spawned);
      }
      return this.spawned;
    }

    outerHTML() {
      return this.element.outerHTML;
    }

    clone(deep) {
      return spawnElement(this);
    }

    children() {
      return [].slice.call(this.element.children);
    }

    append(content) {
      [].concat(content).forEach((item) => {
        this.appendItem(this.element, item, spawnElement);
      });
      return this;
    }

    prop(obj) {
      const el = this.element;
      for (let [p, v] of Object.entries(obj)) {
        try {
          el[p] = v;
        } catch (e) {
          console.warn(e);
        }
      }
      return this;
    }

    attr(obj) {
      const el = this.element;
      for (let [a, v] of Object.entries(obj)) {
        try {
          el.setAttribute(a, v);
        } catch (e) {
          console.warn(e);
        }
      }
      return this;
    }

    css(obj) {
      const el = this.element;
      for (let [s, v] of Object.entries(obj)) {
        el.style[s] = v;
      }
      return this;
    }

    data(obj) {
      const el = this.element;
      if (obj == null) {
        return el.dataset;
      }
      for (let [d, v] of Object.entries(obj)) {
        el.dataset[d] = v;
      }
      return this;
    }

    text(content) {
      if (stringable(content)) {
        this.element.textContent = (content + '');
      }
      return this;
    }

    replace(content) {
      const el = this.element;
      if (probablyHTML(content)) {
        const parentElement = this.element.parentElement;
        if (isElement(parentElement)) {
          const parser = new DOMParser();
          try {
            const parsed = parser.parseFromString(content, 'text/html');
            const element = parsed.body.children[0];
            parentElement.replaceChild(element, this.element);
            this.element = element;
            this.args = {
              tag: this.element.tagName,
              opts: null,
              children: this.element.innerHTML
            };
          } catch (e) {
            console.warn(e);
            el.innerHTML = content;
          }
        } else {
          el.innerHTML = content;
        }
        return this;
      } else if (stringable(content)) {
        el.innerHTML = (content + '');
        return this;
      } else if (content == null) {
        if (el.outerHTML) {
          return el.outerHTML;
        }
      }
    }
    html = this.replace;

    appendChildren(children) {
      const el = this.element;
      [].concat(children).forEach((child) => {
        this.appendItem(el, child, spawnElement);
      });
      return this;
    }

    classes(classNames) {
      const el = this.element;
      [].concat(classNames)
        .join(' ')
        .trim()
        .split(/\s+/)
        .forEach((className) => {
          if (!el.classList.contains(className)) {
            el.classList.add(className);
          }
        });
      return this;
    }

    addClass = this.classes;

    setId(id) {
      this.element.id = id;
    }

    // properties that can be used for 'opts' argument
    setOpts(self) {
      const opts = {
        prop: self.prop,
        attr: self.attr,
        css: self.css,
        style: self.css,
        data: self.data,
        dataset: self.data,
        text: self.text,
        textContent: self.text,
        html: (content) => {
          if (stringable(content)) {
            self.element.innerHTML = (content + '');
          }
        },
        children: self.appendChildren,
        classes: self.classes,
        className: self.classes,
        id: self.setId
      };
      opts.innerHTML = opts.html;
      return opts;
    }

    render(parent) {
      parentContext(parent).appendChild(this.element);
      return this;
    };

    parseTag(t) {

      let tag = t;

      if (isElement(tag)) {
        return tag.cloneNode(true);
      }

      // does the tag argument indicate a fragment?
      // fragment 'tag' would be: '<>', '</>', '!', '#', '', undefined, or null
      if (/^(<>|<\/>|!|#)/.test(tag) || tag === '' || tag == null) {
        return document.createDocumentFragment();
      }

      let attrs, name, classes, id;

      // does the tag have attribute 'shortcuts' that can be parsed?
      if (/[#.,?|]/.test(tag)) {

        let tmp;

        // split any attributes
        attrs = tag.split(/[,|]/);
        tmp = attrs.shift();

        // is there a 'name' shortcut?
        tmp = tmp.split('?');
        name = tmp[1];
        tmp = tmp[0];

        // any classes?
        classes = tmp.split('.');
        tmp = classes.shift();

        // should have just tag and id (if present) remaining
        tmp = tmp.split('#');
        id = tmp[1];
        tag = tmp[0];

      }

      const element = document.createElement(tag);

      if (id) {
        element.id = id.trim();
      }

      if (name) {
        element.name = name.trim();
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

    appendItem(el, item, spawnFn) {
      try {
        if (stringable(item)) {
          el[isFragment(el) ? 'insertAdjacentText' : 'insertAdjacentHTML']('beforeend', item);
        } else if (item instanceof SpawnedElement) {
          el.appendChild(item.get());
        } else if (appendable(item)) {
          el.appendChild(item);
        } else if (Array.isArray(item)) {
          el.appendChild(spawnFn.apply(null, item).get());
        }
      } catch (e) {
        console.warn(e);
      }
    }

  };


  function spawnElement(tag, opts, children) {
    return new SpawnedElement(tag, opts, children);
  }


  function parentContext(parent) {
    if (appendable(parent)) {
      return parent;
    }
    return isString(parent)
      ? document.querySelector(parent) || document
      : document;
  }

  function isString(it) {
    return typeof it == 'string';
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

  function probablyHTML(it) {
    return isString(it) && it.trim().charAt(0) === '<';
  }

  function firstDefined(a, b, c, etc) {
    let undef;
    for (let arg of arguments) {
      if (arg !== undef) {
        return arg;
      }
    }
  }

  // return the main function as well as add it
  // to the window object.
  return (window.spawnElement = spawnElement);

}));
