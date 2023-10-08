// Yet Another DOM Element Library
import type { AnyFn, AnyObject, Appendable, VoidFn } from './utils';
import { removeChildren } from './utils';
import type { Tag, VoidTag } from './tags';
import { eventTypes, tags, voidTags } from './tagList';

type YadelChildren =
  | Element
  | DocumentFragment
  | string
  | number
  | Yadel
  | Array<YadelArgs | YadelChildren>

type TagArg = Tag | VoidTag | Array<YadelArgs>;
type OptsArg = AnyObject | YadelChildren;

type YadelArgs = [
  TagArg,
  OptsArg?,
  YadelChildren?
]

type ElementAttributes = {
  [a: string]: string | number | AnyFn | unknown
}

type ElementProperties = {
  [p: string]: string | number | AnyFn | unknown
}

type StyleObject = {
  [S in keyof CSSStyleDeclaration]: CSSStyleDeclaration[S]
}

type EventType = typeof eventTypes[number];

// Argument types used for `addEventListener`:
// selectedElement.addEventListener(
//     'type': EventType,
//     fn: VoidFn,
//     { bubbles: true }: AnyObject
// )
type EventObject = {
  [e in EventType]: VoidFn | [VoidFn, AnyObject | string]
}

type EventItem = [
  EventType,
  VoidFn,
  (AnyObject | boolean),
] | EventObject;

type EventList = Array<EventItem>;

function appendable(it: YadelChildren | unknown): boolean {
  return (''
    || typeof it === 'string'
    || typeof it === 'number'// Not sure if .append() can handle numbers
    || it instanceof Element
    || it instanceof DocumentFragment
    || it instanceof Node
  );
}

 export const ___HTML___ = '___HTML___';
export const ___FRAG = '<>';

const regex___HTML = new RegExp(`^${___HTML___}`);
const regex___FRAG = new RegExp(`^(${___FRAG}|</>)`);

export const asHtml = (str) => (
  ___HTML___ + str.replace(regex___HTML, '')
);

export const asFragment = (str) => (
  ___FRAG + str.replace(regex___FRAG, '')
);

const YADEL_TAG = 'yadel-element';

class YadelElement extends HTMLElement {
  constructor() {
    super();
  }
  // Does this need any custom functionality?
}

const BEFORE = 'beforebegin';
const BEGIN = 'afterbegin';
const END = 'beforeend';
const AFTER = 'afterend';

export const INSERT = {
  beforebegin: BEFORE,
  afterbegin: BEGIN,
  beforeend: END,
  afterend: AFTER,
  before: BEFORE,
  prepend: BEGIN,
  append: END,
  after: AFTER
} as const;

const insertLoc = [...Object.values(INSERT)] as const;
type InsertLoc = typeof insertLoc[number]

// Yet another DOM element
export class Yadel {
  tag: TagArg;
  opts: OptsArg;
  children: YadelChildren;
  parent: Element | DocumentFragment;

  element: HTMLElement | Element | null = null;
  fragment: DocumentFragment | null = null;

  // yadel: Yadel;

  static createFragment(tag: string | null | undefined) {
    if (tag == null || regex___FRAG.test(tag)) {
      return document.createDocumentFragment();
    }
    return null;
  }

  static createElement(tag: TagArg): Element {
    try {
      return document.createElement(tag as string);
    } catch (e) {
      console.warn('Could not create element. Creating <span> instead.', e);
    }
    return document.createElement('span');
  }

  static customElement(tag: string): Element {
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
    this.fragment = Yadel.createFragment(this.tag as string);
    if (!this.fragment) {
      this.element = (
        [].concat(tags, voidTags).includes(this.tag)
          ? Yadel.createElement(this.tag as TagArg)
          : Yadel.customElement(this.tag as string)
      );
    }
  }

  static create(...args: YadelArgs) {
    let [
      tag = YADEL_TAG as TagArg,
      opts = {},
      children = null
    ] = args;

    // Create Yadel instance
    const yadel = new Yadel(tag);

    // Handle passing only two arguments (tag, appendable)
    if (children == null && (Array.isArray(opts) || appendable(opts))) {
      children = opts as YadelChildren;
      opts = {};
    }

    // iterate `opts` to do things
    for (let [method, ...args] of Object.entries(opts)) {
      // Handle $attr shortcut
      if (method.startsWith('$')) {
        yadel.attr({
          [method.slice(1)]: args
        });
        continue;
      }
      // Handle _prop shortcut
      if (method.startsWith('_')) {
        yadel.prop({
          [method.slice(1)]: args
        });
        continue;
      }
      if (method in yadel) {
        yadel[method](...args);
      }
    }

    // Deal with the children!
    for (const child of [].concat(children)) {
      yadel.append(child, Yadel.create);
    }

    // BAD IDEA - CIRCULAR REFERENCE
    // yadel.yadel = yadel;

    return yadel;
  }

  // Fire callback *only* `if` is instance of `what`
  exec(it = this.element, what, callback, warning = 'Warning...') {
    if (what == null || callback == null) {
      return false;
    }
    if (it instanceof what) {
      try {
        callback(it);
        return true;
      } catch (e) {
        console.warn(warning, '\n', e);
        return false;
      }
    } else {
      console.warn(
        'Could not call on instance' +
        (what.name ? ' of ' + what.name : '') +
        '.'
      );
      return false;
    }
  }

  #asValue(value) {
    return (
      typeof value === 'function'
        ? value(this.element)
        : value
    );
  }

  attr(obj: ElementAttributes) {
    if (this.element instanceof Element) {
      for (const [name, value] of Object.entries(obj)) {
        try {
          this.element.setAttribute(name, String(this.#asValue(value)));
        } catch (e) {
          console.error(`Error setting attribute '${name}' to value ${value}.\n`, e);
        }
      }
    } else {
      console.warn(`Can only set attributes on elements.`);
    }
    return this;
  }

  prop(obj: ElementProperties) {
    if (this.element instanceof Element) {
      for (const [prop, value] of Object.entries(obj)) {
        try {
          this.element[prop] = this.#asValue(value);
        } catch (e) {
          console.error(`Error setting property '${prop}' to value '${value}'.\n`, e);
        }
      }
    } else {
      console.warn(`Not an Element.`, this.element);
    }
    return this;
  }

  // Special handling for common attributes
  className(value: string | AnyFn) {
    if (this.element instanceof HTMLElement) {
      try {
        this.element.className = this.#asValue(value);
      } catch (e) {
        console.error(`Could not set className to value '${value}'.\n`, e);
      }
    } else {
      console.warn(`Not an HTMLElement.`, this.element);
    }
    return this;
  }

  id(value: string | AnyFn) {
    if (this.element instanceof HTMLElement) {
      try {
        this.element.id = this.#asValue(value);
      } catch (e) {
        console.error(`Could not set id to value '${value}'.\n`, e);
      }
    } else {
      console.warn(`Not an HTMLElement.`, this.element);
    }
    return this;
  }

  // Handle style as an attribute string or object
  style(css: string | StyleObject) {
    if (this.element instanceof HTMLElement) {
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
        console.error(`Could not set element style.\n`, e);
      }
    } else {
      console.warn(`Not an HTMLElement.`, this.element);
    }
    return this;
  }
  // alias to `css` instance method
  css = this.style;

  // Implementation example:
  // on: [
  //     ['click', clickHandler, { bubbles: true }],
  //     { mouseover: hoverHandler, { bubbles: false } }
  // ]
  on(listeners: EventList) {
    if (this.element instanceof Element) {
      for (const listener of [].concat(listeners) as EventItem[]) {
        try {
          if (Array.isArray(listener)) {
            this.element.addEventListener.call(this.element, ...listener);
          } else {
            for (const [eventType, args] of Object.entries(listener) as Array<[EventType, VoidFn | EventObject[]]>) {
              this.element.addEventListener.apply(this.element, [].concat(eventType, args));
            }
          }
        } catch (e) {
          console.error(`Could not set event listener(s).\n`);
        }
      }
    } else {
      console.warn(`Not an Element.\n`, this.element);
    }
    return this;
  }

  [___HTML___](htm: string | number | undefined | AnyFn) {
    if (/string|number/.test(typeof htm)) {
      this.element.innerHTML = String(htm);
      return this;
    }
    if (htm === undefined) {
      return this.element.outerHTML;
    }
    // This supports passing a function for `htm` value
    this.element.innerHTML = String(this.#asValue(htm));
    return this;
  }
  html = this[___HTML___];

  [___FRAG](frag: string | Node) {
    try {
      if (typeof frag === 'string') {
        this.element.textContent = frag;
        return this;
      }
      if (frag.nodeType && frag.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        (this.fragment || this.element).replaceChildren(frag);
        return this;
      }
    } catch (e) {
      console.warn(`Could not process fragment.`, e);
    }
    return this;
  }
  frag = this[___FRAG];

  // Shortcuts for common attributes
  text(txt: string | number | undefined | AnyFn) {
    if (/string|number/.test(typeof txt)) {
      (this.element || this.fragment).textContent = String(txt);
      return this;
    }
    if (txt === undefined) {
      return (this.element || this.fragment).textContent;
    }
    // This supports passing a function for `txt` value
    (this.element || this.fragment).textContent = String(this.#asValue(txt));
    return this;
  }

  // With great power comes great responsibility...
  set innerHTML(htm: string | number) {
    this.element.innerHTML = String(htm);
  }
  get innerHTML() {
    return this.element.innerHTML;
  }

  // NOTE: No setter for `outerHTML`
  get outerHTML() {
    return this.element.outerHTML;
  }

  // INSERT >
  insertElement(where: InsertLoc = END, elem: Element | Yadel) {
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
  insertHTML(where: InsertLoc = END, html) {
    this.element.insertAdjacentHTML(
      where,
      html as string
    );
    return this;
  }
  insertText(where: InsertLoc = END, txt) {
    if (this.fragment) {
      if (where === BEGIN) {
        this.fragment.textContent = txt + this.fragment.textContent;
      } else {
        this.fragment.textContent += txt;
      }
    } else {
      this.element.insertAdjacentText(
        where,
        txt as string
      );
    }
    return this;
  }
  // < INSERT

  // APPEND >
  appendElement(elem: Element | Yadel) {
    this.insertElement(END, elem);
    return this;
  }
  appendHTML(html: string) {
    this.insertHTML(END, html);
    return this;
  }
  appendText(txt: string) {
    this.insertText(END, txt);
    return this;
  }
  appendFragment(...frag: Array<string | Node>) {
    this.element.append(...frag);
    return this;
  }
  // < APPEND

  // PREPEND >
  prependElement(elem: Element) {
    this.insertElement(BEGIN, elem);
    return this;
  }
  prependHTML(html: string) {
    this.insertHTML(BEGIN, html);
    return this;
  }
  prependText(txt: string) {
    this.insertText(BEGIN, txt);
    return this;
  }
  prependFragment(...frag: Array<string | Node>) {
    this.element.prepend(...frag);
    return this;
  }
  // < PREPEND

  append(children: YadelChildren, fn: AnyFn | undefined) {
    console.log('appendChildren');

    if (Array.isArray(children)) {
      //
      // TODO:
      //  .......................................
      //  recursively process arrays of YadelArgs
      //  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
      //
      this.appendElement(fn(...children).get());
      return this;
    }

    if (/string|number/.test(typeof children)) {
      const childrenString = String(children);
      if (regex___HTML.test(childrenString)) {
        this.appendHTML(childrenString.replace(regex___HTML, ''));
      } else if (regex___FRAG.test(childrenString)) {
        this.appendText(childrenString.replace(regex___FRAG, ''));
      } else {
        this.appendText(childrenString);
      }
      return this;
    }

    if (children instanceof Element) {
      this.appendElement(children);
      return this;
    }

    if (children instanceof Yadel) {
      this.appendElement(children.get());
      return this;
    }

    return this;
  }
  appendChildren = this.append;

  appendTo(parent: string | Element | DocumentFragment) {
    if (typeof parent === 'string') {
      document.querySelector(parent).appendChild(this.element);
    } else {
      parent.appendChild(this.element);
    }
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
    ) as Element | DocumentFragment;

    removeChildren(renderTarget);

    if (toRender instanceof Yadel) {
      renderTarget.appendChild(toRender.get());
      return;
    }
    if (appendable(toRender)) {
      renderTarget.append(toRender);
      return;
    }
  };

  render(parent: string | Element) {
    Yadel.render(this.fragment || this.element, parent);
    return this;
  }

  get() {
    return this.element;
  }

  ya() {
    return this.fragment || this.element;
  }
}

// function appendChildren(yadeli: Yadel, children: YadelChildren, ya: AnyFn) {
//   console.log('appendChildren');
//   if (/string|number/.test(typeof children)) {
//     const childrenString = String(children).trim();
//     if (regex___HTML.test(childrenString)) {
//       yadeli.appendHTML(childrenString.replace(regex___HTML, ''));
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
  return Yadel.create(...args);
  // let [
  //   tag = YADEL_TAG as TagArg,
  //   opts = {},
  //   children = null
  // ] = args;
  //
  // // Create Yadel instance
  // const yadel = new Yadel(tag);
  //
  // if (children == null && Array.isArray(opts)) {
  //   children = opts;
  //   opts = {};
  // }
  //
  // // iterate `opts` to do things
  // for (const [method, args] of Object.entries(opts)) {
  //   if (method in yadel) {
  //     yadel[method](...args);
  //   }
  // }
  //
  // // Deal with the children!
  // for (const child of [].concat(children)) {
  //   yadel.appendChildren(child, ya);
  // }
  //
  // return yadel;
}

// Alias
ya.create = Yadel.create;

// Alias
ya.render = Yadel.render;

// Export all tags as individual functions???
ya.tags = [].concat(tags, voidTags).reduce((fns, tag) => {
  fns[tag] = (...args) => ya(tag, ...args);
  return fns;
}, {});

export default ya;
