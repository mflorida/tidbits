/**
 * Special fun syntax for using faster DOM element selection functions, like
 * getElementById, getElementsByClassName, getElementsByName, getElementsByTagName,
 * as well as new functions like getElementsByValue,
 */
;
(function umd(factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    return factory();
  }
}(function factory() {

  const x0 = window.x0 || {};

  // Utilities

  function isString(it) {
    return typeof it === 'string';
  }

  function isFunction(it) {
    return typeof it === 'function';
  }

  function isElement(it) {
    return it == null ? false : (
      (it && it.nodeType && it.nodeType === Node.ELEMENT_NODE)
      || it instanceof Element
    );
  }

  function isFragment(it) {
    return it == null ? false : (
      (it.nodeType && it.nodeType === Node.DOCUMENT_FRAGMENT_NODE)
      || it instanceof DocumentFragment
    );
  }

  function asArray(it) {
    if (it == null) return [];
    if (it.length == null) return [].concat(it);
    return isFunction(Array.from) ? Array.from(it) : [].slice.call(it);
  }

  // Method name strings
  const QUERY = {
    ID: 'byId',
    CLASS: 'byClass',
    NAME: 'byName',
    TAG: 'byTag',
    ATTR: 'byAttr',
    VALUE: 'byValue',
    SELECTOR: 'selector',
    ALL: 'all'
  };

  // Map of selector syntax prefixes to method names
  const PREFIX_MAP = {

    '|#': QUERY.ID,
    '#|': QUERY.ID,
    ':#': QUERY.ID,
    '#:': QUERY.ID,
    '##': QUERY.ID,
    '# ': QUERY.ID,
    '#': QUERY.ID,

    '|.': QUERY.CLASS,
    '.|': QUERY.CLASS,
    ':.': QUERY.CLASS,
    '.:': QUERY.CLASS,
    '..': QUERY.CLASS,
    '. ': QUERY.CLASS,
    '.': QUERY.CLASS,

    '|?': QUERY.NAME,
    '?|': QUERY.NAME,
    ':?': QUERY.NAME,
    '?:': QUERY.NAME,
    '??': QUERY.NAME,
    '? ': QUERY.NAME,
    '?': QUERY.NAME,

    '|~': QUERY.TAG,
    '~|': QUERY.TAG,
    '~:': QUERY.TAG,
    '~ ': QUERY.TAG,
    '~': QUERY.TAG,

    // '|:': QUERY.TAG,
    // ': ': QUERY.TAG,

    '|<': QUERY.TAG,
    '<|': QUERY.TAG,
    ':<': QUERY.TAG,
    '<:': QUERY.TAG,
    '</': QUERY.TAG,
    '<>': QUERY.TAG,
    '< ': QUERY.TAG,
    '> ': QUERY.TAG,
    '<': QUERY.TAG,
    '>': QUERY.TAG,

    '|@': QUERY.ATTR,
    '@|': QUERY.ATTR,
    '@:': QUERY.ATTR,
    '@ ': QUERY.ATTR,
    '@': QUERY.ATTR,
    // '[]': QUERY.ATTR,

    '|=': QUERY.VALUE,
    '=|': QUERY.VALUE,
    '=:': QUERY.VALUE,
    '==': QUERY.VALUE,
    '= ': QUERY.VALUE,
    '=': QUERY.VALUE,

    '|^': QUERY.SELECTOR,
    '^|': QUERY.SELECTOR,
    '|/': QUERY.SELECTOR,
    '/|': QUERY.SELECTOR,
    '/ ': QUERY.SELECTOR,
    '^': QUERY.SELECTOR,
    '/': QUERY.SELECTOR,

    '|*': QUERY.ALL,
    '*|': QUERY.ALL,
    '*:': QUERY.ALL,
    '**': QUERY.ALL,
    '* ': QUERY.ALL,
    '*': QUERY.ALL,
    ' ': QUERY.ALL,

    '//': QUERY.ALL,

  };

  /**
   * Parse 'special' selector syntax
   * @param {string} str
   * @returns {{method: *, prefix: string, selector: (*|string)}}
   */
  function parseSelector(str) {
    let selector = str.trim();
    let prefix = selector.slice(0, 2);
    let method;

    //     ⌄ intentinal assignment
    if (!!(method = PREFIX_MAP[prefix])) {
      selector = selector.slice(2).trim();
    } else if (!!(method = PREFIX_MAP[selector[0]])) {
      selector = selector[0];
    }

    return {
      selector,
      prefix,
      method
    };
  }

  function splitSelector(str) {

  }

  // Query DOM elements

  function resolveContext(context) {
    if (isString(context)) {
      return document.querySelector(context);
    }
    if (isElement(context)) {
      return context;
    }
    return document;
  }
  x0.resolveContext = resolveContext;


  // ------------------------------------------------------------ //
  //  The main function for using custom speedy selector syntax   //
  // ------------------------------------------------------------ //

  /**
   * Use special selector syntax to query the DOM
   * @param {string} query
   * @param {string|Document|Element} [context]
   * @returns {[]|*[]|unknown[]|any}
   * @example
   * x0.query('|# foo |. bar baz |: p')
   */
  x0.query = (query, context) => {
    const { method, selector } = parseSelector(query);
    if (method) {
      return x0.query[method](selector, context);
    }
    return asArray(resolveContext(context).querySelectorAll(selector));
  };

  function example1() {
    x0.query('|# foo |. bar baz| p');
    x0.query('|? #foo |? .bar.baz |? p');
  }

  function getById(id, context) {
    return resolveContext(context).getElementById(id);
  }
  x0.byId = getById;
  x0.getById = getById;
  x0.query.id = getById;
  x0.query.byId = getById;

  function getByClass(className, context) {
    return asArray(resolveContext(context).getElementsByClassName(className));
  }
  x0.byClass = getByClass;
  x0.getByClass = getByClass;
  x0.getByClassName = getByClass;
  x0.query.class = getByClass;
  x0.query.className = getByClass;
  x0.query.byClass = getByClass;
  x0.query.byClassName = getByClass;

  function getByName(name, context) {
    return asArray(resolveContext(context).getElementsByName(name));
  }
  x0.byName = getByName;
  x0.getByName = getByName;
  // x0.query['name'] = getByName;
  x0.query.byName = getByName;

  function getByTag(tag, context) {
    const tagName = tag.replace(/^([\s</|:]+)|([\s>]+)$/g, '');
    return asArray(resolveContext(context).getElementsByTagName(tagName));
  }
  x0.byTag = getByTag;
  x0.byTagName = getByTag;
  x0.query.tag = getByTag;
  x0.query.tagName = getByTag;
  x0.query.byTag = getByTag;
  x0.query.byTagName = getByTag;

  function getByAttr(attr, context) {
    const selector = `[${attr}]`;
    return asArray(resolveContext(context).querySelectorAll(selector));
  }
  x0.byAttr = getByAttr;
  x0.getByAttr = getByAttr;
  x0.byAttribute = getByAttr;
  x0.getByAttribute = getByAttr;
  x0.query.attr = getByAttr;
  x0.query.attribute = getByAttr;
  x0.query.byAttr = getByAttr;
  x0.query.byAttribute = getByAttr;

  // Elements allowed to have a 'value' property or attribute
  const CAN_HAS_VALUE = [
    'button',
    'data',
    'input',
    'meter',
    'output',
    'param',
    'progress',
    'select',
    'textarea'
  ].join(', ');

  function getByValue(value, context) {
    return (
      asArray(resolveContext(context).querySelectorAll(CAN_HAS_VALUE)).filter((elem) => (
        elem.value && (
          (elem.value + '') === (value + '')
        )
      ))
    );
  }
  x0.getByValue = getByValue;
  x0.query.value = getByValue;
  x0.query.byValue = getByValue;

  function getElement(selector, context) {
    if (isElement(selector)) {
      return selector;
    }
    return resolveContext(context).querySelector(selector);
  }
  x0.getElement = getElement;
  x0.query.first = getElement;
  x0.query.selector = getElement;

  function getElements(selector, context) {
    if (isElement(selector)) {
      return selector;
    }
    return asArray(resolveContext(context).querySelectorAll(selector));
  }
  x0.getElements = getElements;
  x0.query.all = getElements;
  x0.query.selectorAll = getElements;

  function getLast(selector, context) {
    return getElements(selector, context).pop();
  }
  x0.getLast = getLast;
  x0.query.last = getLast;

  x0.x$ = x0.query;
  x0.$$ = x0.query;

  return (window.x0 = x0);

}));
