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

// Supports `append` and `appendChild` methods
export type Appendable =
  | Node
  | Element
  | DocumentFragment;

// @ts-ignore - do not define `undef`
let undef;

// export function isDefined(val) {
//   return val !== undef;
// }

export function isString(str: string | unknown): boolean {
  return typeof str === 'string';
}

// export function isFunction(fn) {
//   return typeof fn === 'function';
// }

export function isNode(it: Node | unknown): boolean {
  return it instanceof Node;
}

export function isElement(it: Element | unknown): boolean {
  return it instanceof Element;
}

export function isFragment(it: DocumentFragment | unknown): boolean {
  return it instanceof DocumentFragment;
}

export function appendable(it: Appendable): boolean {
  return isNode(it) || isElement(it) || isFragment(it);
}

export function removeChildren(node: Appendable): void {
  if (node instanceof Node) {
    while (node.childNodes.length) {
      node.removeChild(node.firstChild)
    }
  }
}
