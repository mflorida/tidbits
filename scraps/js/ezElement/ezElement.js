(function umd(factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    return factory();
  }
}(function factory() {

  /**
   * Create a DOM element with specified attributes
   * @param {string} t - element creation shorthand
   * @param {string|Array<string|Element|Array<string, string|element>>} [children] - child elements for new element
   * @returns {
   *   DocumentFragment
   *   | {
   *       classes: string[],
   *       name: string,
   *       className: string,
   *       tag: string,
   *       id: string,
   *       attr: {},
   *       attrs: string[],
   *       element?: Element
   *     }
   * }
   * @example
   * const inputFoo = ezElement('input:text #foo .bar.baz ?fooText | title=Foo Text')
   * // -->  <input type="text" id="foo" class="bar baz" name="fooText" title="Foo Text">
   */
  function ezElement(t = '', children) {
    let str = t;

    const doc = typeof document !== 'undefined' ? document : {};

    doc.createFragment = typeof doc.createDocumentFragment === 'function'
      ? doc.createDocumentFragment
      : () => str;

    const tt = {
      tag: '',
      id: '',
      classes: [''],
      className: '',
      attr: {},
      attrs: [''],
      name: ''
    };

    // does the tag string indicate a fragment?
    // fragment 'tag' would be: '!', '<>', '</>', or ''
    if (/^(!|<>|<\/>)/.test(str) || str === '') {
      return doc.createFragment();
    }

    // does the tag have attribute 'shortcuts' that can be parsed?
    // (don't try to follow this... not worth the effort)
    if (/[:#.,?|]/.test(str)) {

      // split any attributes
      [str, ...tt.attrs] = str.split(/[,|]/).map(attr => attr.trim());

      // is there a 'name' shortcut?
      [str, tt.name] = str.trim().split('?');

      // any classes?
      [str, ...tt.classes] = str.split('.').map(cls => cls.trim());

      // grab an id if specified
      [str, tt.id] = str.trim().split('#');

      // grab the 'type' for input elements
      [tt.tag, tt.type] = str.trim().split(':');

    }

    const element = typeof doc.createElement === 'function'
      ? doc.createElement(tt.tag)
      : { tagName: tt.tag };

    const setAttribute = (name, value) => {
      if (typeof element.setAttribute === 'function') {
        // Directly set attribute on the element
        element.setAttribute(name, value);
      }
      // Add parsed attributes to 'attr' object
      tt.attr[name] = value;
    };

    // Special handling for 'special' attributes
    if (tt.id) element.id = tt.id;
    if (tt.name) setAttribute('name', tt.name);
    if (tt.type) setAttribute('type', tt.type);

    element.className =
      tt.className =
        Array.from(new Set(tt.classes)).join(' ').trim();

    // Iterate parsed attributes
    for (const attr of tt.attrs) {
      let [name, value] = attr.split('=');
      name = name.trim();
      value = (value || '').replace(/^['"]|['"]$/g, '');
      setAttribute(name, value);
    }

    tt.render = (parent) => {
      parent.replaceChildren(element);
      return tt;
    };

    tt.appendTo = (parent) => {
      parent.appendChild(element);
      return tt;
    };

    tt.get = () => element;

    // Add element to output object
    tt.element = element;

    return tt;
  }

  // Put it in the global scope
  Object.assign(
    (typeof window !== 'undefined' ? window : (
      typeof global != 'undefined' ? global : {}
    )),
    { ezElement }
  );

  return ezElement;
}));
