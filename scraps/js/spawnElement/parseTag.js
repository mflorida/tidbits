/**
 * Parse a `spawnElement()` tag string and return an element
 * with the specified attributes or just a DocumentFragment.
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

  return function parseTag(t = '') {

    let str = t;

    const tt = {
      tag: '',
      attrs: [],
      id: '',
      classes: [],
      name: ''
    };

    // does the tag string indicate a fragment?
    // fragment 'tag' would be: '<>', '</>', ''
    if (/^(<>|<\/>)/.test(str) || str === '') {
      return document.createDocumentFragment();
    }

    // does the tag have attribute 'shortcuts' that can be parsed?
    // (don't try to follow this... not worth the effort)
    if (/[#.,?|]/.test(str)) {

      // split any attributes
      [str, ...tt.attrs] = str.split(/[,|]/);

      // is there a 'name' shortcut?
      [str, tt.name] = str.split('?');

      // any classes?
      [str, ...tt.classes] = str.split('.');

      // should have just tag and id (if present) remaining
      [tt.tag, tt.id] = str.split('#');

    }

    const element = document.createElement(tt.tag);

    if (tt.id) element.id = tt.id;
    if (tt.name) element.name = tt.name;

    for (const attr of tt.attrs) {
      const [name, value] = attr.trim().split('=');
      element.setAttribute(
        name.trim(),
        value.trim().replace(/^["']|['"]$/g, '')
      );
    }

    element.className = [...new Set([
      ...element.className.trim().split(/\s+/),
      ...tt.classes
    ])].join(' ').trim();

    return element;

  };

}));
