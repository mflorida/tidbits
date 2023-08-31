/**
 * Basic shared utility functions and types
 */

export type Whatever = unknown | undefined;

export type AnyObject = {
  [a: string | number | symbol]: any;
}

export type AnyArgs = Whatever[] | undefined;

export type AnyFn = (...args: AnyArgs) => any;

// export type SomeFn = (...args) => unknown;

export type VoidFn = (...args: AnyArgs) => void;

// Can be appended to DOM nodes
export type Appendable =
  | string
  | Element
  | DocumentFragment
  | Node;

// @ts-ignore - do not define `undef`
let undef;

// export function isDefined(val) {
//   return val !== undef;
// }

// export function someTrue(...testItems: Array<boolean>) {
//   for (const testItem of testItems) {
//     if (testItem === true) {
//       return true
//     }
//   }
//   return false;
// }
//
// export function allTrue(...testItems: Array<boolean>) {
//   for (const testItem of testItems) {
//     if (testItem !== true) {
//       return false
//     }
//   }
//   return true;
// }

export function isString(str: any): boolean {
  return typeof str === 'string';
}

export function isNumber(num: any): boolean {
  return typeof num === 'number';
}

export function isFunction(fn: any) {
  return typeof fn === 'function';
}

export function isElement(it: Element | unknown): boolean {
  return (''
    // @ts-ignore - Dear TypeScript: Yes, `.nodeType` may not exist on `it`.
    || ('nodeType' in it && it.nodeType === Node.ELEMENT_NODE)
    || it instanceof Element
  );
}

export function isFragment(it: DocumentFragment | unknown): boolean {
  return (''
    // @ts-ignore - Dear TypeScript: Yes, `.nodeType` may not exist on `it`.
    || ('nodeType' in it && it.nodeType === Node.DOCUMENT_FRAGMENT_NODE)
    || it instanceof DocumentFragment
  );
}

export function isNode(it: Node | unknown): boolean {
  return (''
    // @ts-ignore - Dear TypeScript: Yes, `.nodeType` may not exist on `it`.
    || ('nodeType' in it && isNumber(it.nodeType))
    || it instanceof Node
  );
}

// Can `it` be appended using the parent's .append() method?
export function appendable(it: Appendable): boolean {
  return (''
    || isString(it)
    || isNumber(it) // Not sure if .append() can handle numbers
    || isElement(it)
    || isFragment(it)
    || isNode(it)
  );
}

export function removeChildren(node: Element | DocumentFragment | Node): void {
  try {
    if ('replaceChildren' in node && typeof node.replaceChildren === 'function') {
      node.replaceChildren(document.createDocumentFragment());
    } else {
      if (node.childNodes && node.childNodes.length) {
        while (node.childNodes.length) {
          node.removeChild(node.firstChild);
        }
      }
    }
  } catch (e) {
    console.error('Error removing children.', e);
  }
}
