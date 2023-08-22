// Yet Another DOM Element Library
//
import type { AnyFn, AnyObject, Appendable, VoidFn } from './utils';
import { removeChildren, appendable } from './utils';
import type { Tag, VoidTag } from './tags';
import { tags, voidTags, eventTypes } from './tagList';

type Children =
  | Element
  | HTMLElement
  | DocumentFragment
  | string
  | number
  | Yadel
  | Array<YadelArgs | Children>

type TagArg = Tag | VoidTag | Array<YadelArgs>;
type OptsArg = AnyObject | Children;

type YadelArgs = [
  TagArg,
  OptsArg?,
  Children?
]

type ElementAttributes = {
  [A in string]: string | number | AnyFn | unknown
}

type ElementProperties = {
  [P in string]: string | number | AnyFn | unknown
}

type EventType = typeof eventTypes[number];

type EventItem = [
  EventType,
  (string | VoidFn),
  (VoidFn | undefined)?
]

type EventList = Array<EventItem>;

export const HTML_PREFIX = '__HTML__';
const regex_HTML_PREFIX = new RegExp(`^${HTML_PREFIX}`);

const YADEL_TAG = 'yadel-element';

class YadelElement extends HTMLElement {
  constructor() {
    super();
  }
  // Does this need any custom functionality?
}

export const INSERT = {
  BEFORE: 'beforebegin',
  BEGIN: 'afterbegin',
  END: 'beforeend',
  AFTER: 'afterend'
} as const;

const insertLoc = [...Object.values(INSERT)] as const;

type InsertLoc = typeof insertLoc[number]

// Yet another DOM element
export class Yadel {
  tag: TagArg;
  opts: OptsArg;
  children: Children;
  parent: Element | DocumentFragment;

  element: HTMLElement | Element | null;
  // fragment: DocumentFragment | null;

  static createElement(tag: TagArg) {
    try {
      return document.createElement(tag as string);
    } catch (e) {
      console.warn('Could not create element. Creating <span> instead.', e);
    }
    return document.createElement('span');
  }

  static customElement(tag: string) {
    try {
      customElements.define(tag, YadelElement);
      return document.createElement(tag);
    } catch (e) {
      console.warn(`Could not create custom element. Creating <${YADEL_TAG}> instead.`, e);
    }
    customElements.define(YADEL_TAG, YadelElement);
    return document.createElement(YADEL_TAG);
  }

  constructor(...args: YadelArgs) {
    [this.tag, this.opts, this.children] = args;
    this.element = (
      [].concat(tags, voidTags).includes(this.tag)
        ? Yadel.createElement(this.tag as TagArg)
        : Yadel.customElement(this.tag as string)
    );
  }

  // Fire callback *only* if instance of `what`
  exec(it = this.element, what, callback, message = 'Warning...') {
    if (what == null || callback == null) {
      return false;
    }
    if (it instanceof what) {
      try {
        callback(it);
        return true;
      } catch (e) {
        console.warn(message, '\n', e);
        return false;
      }
    } else {
      console.warn(
        'Could not call on instance' +
        what.name
          ? ' of ' + what.name
          : '' +
          '.'
      );
      return false;
    }
  }

  attr(obj: ElementAttributes) {
    this.exec(this.element, Element, () => {
      for (const [name, value] of Object.entries(obj)) {
        try {
          const attrValue = typeof value === 'function'
            ? value(this.element)
            : value;
          this.element.setAttribute(name, String(attrValue));
        } catch (e) {
          console.warn(`Error setting attribute '${name}'.`);
        }
      }
    });
    return this;
  }

  prop(obj: ElementProperties) {
    this.exec(this.element, Element, () => {
      for (const [prop, value] of Object.entries(obj)) {
        try {
          this.element[prop] = typeof value === 'function'
            ? value(this.element)
            : value;
        } catch (e) {
          console.warn(`Could not set property '${prop}' to value '${value}'.\n`, e);
        }
      }
    });
    return this;
  }

  // Special handling for common attributes
  className(value: string | AnyFn) {
    this.exec(this.element, HTMLElement, () => {
      try {
        if (typeof value === 'function') {
          this.element.className = value(this.element);
        } else {
          this.element.className = value;
        }
      } catch (e) {
        console.warn(`Could not set className to value '${value}'.\n`, e);
      }
    });
    return this;
  }

  id(value: string | AnyFn) {
    this.exec(this.element, HTMLElement, () => {
      try {
        if (typeof value === 'function') {
          this.element.id = value(this.element);
        } else {
          this.element.id = value;
        }
      } catch (e) {
        console.warn(`Could not set id to value '${value}'.\n`, e);
      }
    });
    return this;
  }

  // Handle style as an attribute string or object
  style(css: string | AnyObject) {
    this.exec(this.element, HTMLElement, () => {
      try {
        if (typeof css === 'string') {
          this.element.setAttribute('style', css);
        } else {
          if ('style' in this.element) {
            for (const [prop, value] of Object.entries(css)) {
              this.element.style[prop] = value;
            }
          } else {
            console.warn('Element does not have `style` property');
          }
        }
      } catch (e) {
        console.warn(`Could not set element style.\n`, e);
      }
    });
    return this;
  }

  on(listeners: EventList) {
    this.exec(this.element, Element, () => {
      try {
        for (const listener of [].concat(listeners)) {
          for (const [eventType, args] of Object.entries(listener)) {
            this.element.addEventListener.apply(null, [].concat(eventType, [].concat(args)));
          }
          // try {
          //   // If there are only 2 arguments, `child` and `fn` will be equal
          //   // since the default value for `fn` falls back to `child`...
          //   // ...and if they *are* equal, reset `child` to '<'
          //   // and if `child` happens to be falsey, reset to '<
          //   const targetChild = child !== fn && typeof child === 'string';
          //
          //   this.element.addEventListener(eventType, (e) => {
          //     let _target = e.target as Element;
          //     let _currentTarget = e.currentTarget as Element;
          //     // if we clicked on the thing
          //     if (_target === _currentTarget) {
          //       (fn as VoidFn)(e);
          //     } else if (targetChild) {
          //       while (_target !== _currentTarget) {
          //         // fire callback if a parent element matches
          //         if (_target.matches(String(child))) {
          //           (fn as VoidFn)(e);
          //           break;
          //         }
          //         // Is this just manual bubbling?
          //         _target = _target.parentElement;
          //       }
          //     }
          //   });
          // } catch (e) {
          //   console.warn(`Could not add '${eventType}' event.\n`, e);
          // }
        }
      } catch (e) {
        console.warn(`Could not set event listener(s).\n`, e);
      }
    });
    return this;
  }

  html(htm: string | undefined) {
    if (typeof htm === 'string') {
      this.element.innerHTML = htm;
      return this;
    }
    if (htm === undefined) {
      return this.element.outerHTML;
    }
  }

  // Shortcuts for common attributes
  text(txt: string | undefined) {
    if (typeof txt === 'string') {
      this.element.textContent = txt;
      return this;
    }
    if (txt === undefined) {
      return this.element.textContent;
    }
  }

  // With great power comes great responsibility...
  set innerHTML(htm: string) {
    this.element.innerHTML = htm;
  }
  get innerHTML() {
    return this.element.innerHTML;
  }

  // NOTE: No setter for `outerHTML`
  get outerHTML() {
    return this.element.outerHTML;
  }

  // INSERT >
  insertElement(where: InsertLoc = INSERT.END, elem: Element | Yadel) {
    const elementToInsert =
      elem instanceof Yadel
        ? elem.get()
        : elem;
    this.element.insertAdjacentElement(
      where,
      elementToInsert
    );
    return this;
  }
  insertHTML(where: InsertLoc = INSERT.END, html) {
    this.element.insertAdjacentHTML(
      where,
      html as string
    );
    return this;
  }
  insertText(where: InsertLoc = INSERT.END, txt) {
    this.element.insertAdjacentText(
      where,
      txt as string
    );
    return this;
  }
  // < INSERT

  // APPEND >
  appendElement(elem: Element | Yadel) {
    this.insertElement(INSERT.END, elem);
    return this;
  }
  appendHTML(html: string) {
    this.insertHTML(INSERT.END, html);
    return this;
  }
  appendText(txt: string) {
    this.insertText(INSERT.END, txt);
    return this;
  }
  // < APPEND

  // PREPEND >
  // prependElement(elem: Element) {
  //   this.insertElement(INSERT.BEGIN, elem);
  //   return this;
  // }
  prependHTML(html: string) {
    this.insertHTML(INSERT.BEGIN, html);
    return this;
  }
  // prependText(txt: string) {
  //   this.insertText(INSERT.BEGIN, txt);
  //   return this;
  // }
  // < PREPEND

  appendChildren(children: Children, fn: AnyFn) {
    console.log('appendChildren');
    if (/string|number/.test(typeof children)) {
      const childrenString = String(children).trim();
      if (regex_HTML_PREFIX.test(childrenString)) {
        this.appendHTML(childrenString.replace(regex_HTML_PREFIX, '').trim());
      } else {
        this.appendText(childrenString);
      }
    } else if (children instanceof Yadel) {
      this.appendElement(children.get());
    } else if (children instanceof Element) {
      this.appendElement(children);
    } else if (Array.isArray(children)) {
      //
      // TODO:
      //  .......................................
      //  recursively process arrays of YadelArgs
      //  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
      //
      this.appendElement(fn(...children).get());
    }
  }
  append = this.appendChildren;

  appendTo(parent: string | Element) {
    if (typeof parent === 'string') {
      document.querySelector(parent).appendChild(this.element);
    } else {
      parent.appendChild(this.element);
    }
    return this;
  }

  render(parent: string | Element) {
    this.parent =
      typeof parent === 'string'
        ? document.querySelector(parent)
        : parent;
    this.parent.innerHTML = '';
    this.parent.appendChild(this.element);
    return this;
  }

  /**
   * Static method for rendering Yadel elements to the DOM
   * @param {Yadel|Appendable} toRender - item to add to the DOM
   * @param {string|Appendable} target - selector or element to render into
   */
  static render(toRender: Yadel | Appendable, target: string | Appendable) {
    const renderTarget = (
      typeof target === 'string'
        ? document.querySelector(target)
        : appendable(target)
          ? target
          : document.body
    ) as Appendable;

    removeChildren(renderTarget);

    if (toRender instanceof Yadel) {
      renderTarget.appendChild(toRender.get());
      return;
    }
    if (appendable(toRender)) {
      renderTarget.appendChild(toRender);
      return;
    }
  };

  get() {
    return this.element;
  }
}

// function appendChildren(yadeli: Yadel, children: Children, ya: AnyFn) {
//   console.log('appendChildren');
//   if (/string|number/.test(typeof children)) {
//     const childrenString = String(children).trim();
//     if (regex_HTML_PREFIX.test(childrenString)) {
//       yadeli.appendHTML(childrenString.replace(regex_HTML_PREFIX, ''));
//     } else {
//       yadeli.appendText(childrenString);
//     }
//   } else if (children instanceof Yadel) {
//     yadeli.appendElement(children.get());
//   } else if (children instanceof Element) {
//     yadeli.appendElement(children);
//   } else if (Array.isArray(children)) {
//     // TODO: recursively process child arrays
//     yadeli.appendElement(ya(...children).get());
//   }
// }

// function resolveContext(context: string | undefined | Element | typeof document) {
//   if (typeof context === 'string') {
//     return document.querySelector(context);
//   }
//   if (context instanceof Element) {
//     return context;
//   }
//   return document;
// }

/**
 *
 * @param args
 */
export function ya(...args: YadelArgs) {
  let [
    tag = YADEL_TAG,
    opts = {},
    children = null
  ] = [].concat(args);

  if (children == null && Array.isArray(opts)) {
    children = opts;
    opts = {};
  }

  // Create Yadel instance
  const yadel = new Yadel(tag);

  // iterate `opts` to do things
  for (const [method, value] of Object.entries(opts)) {
    if (method in yadel) {
      yadel[method].apply(yadel, [].concat(value));
    }
  }

  // Deal with the children!
  for (const child of [].concat(children)) {
    yadel.appendChildren(child, ya);
  }

  return yadel;
}

// Alias
ya.render = Yadel.render;

// Export all tags as individual functions???
export const yaTags = [].concat(tags, voidTags).reduce((fns, tag) => {
  fns[tag] = (...args) => ya(tag, ...args);
  return fns;
}, {});

export default ya;
