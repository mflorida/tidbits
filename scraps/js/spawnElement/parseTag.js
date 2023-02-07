/**
 * Parse a `spawnElement()` tag string and return an element
 * with the specified attributes or just a DocumentFragment.
 */
(function(factory){
  if (typeof define === 'function' && define.amd) {
    define(factory);
  }
  else if (typeof exports === 'object') {
    module.exports = factory();
  }
  else {
    return factory();
  }
}(function() {

  return function parseTag(t) {

    const tt = {
      tag: t || '',
      attrs: [],
      id: '',
      classes: [],
      name: ''
    };

    // does the tag string indicate a fragment?
    // fragment 'tag' would be: '<>', '</>', ''
    if (/^(<>|<\/>)/.test(tt.tag) || tt.tag === '') {
      return document.createDocumentFragment();
    }

    // does the tag have attribute 'shortcuts' that can be parsed?
    // (don't try to follow this... not worth the effort)
    if (/[#.,?|]/.test(tt.tag)) {

      // split any attributes
      tt.attrs = tt.tag.split(/[,|]/);

      // shift out the tag
      tt.tag = tt.attrs.shift();

      // is there a 'name' shortcut?
      [tt.tag, tt.name = ''] = tt.tag.split('?');

      // any classes?
      tt.classes = tt.tag.split('.');

      // shift out the tag again
      tt.tag = tt.classes.shift();

      // should have just tag and id (if present) remaining
      [tt.tag, tt.id = ''] = tt.tag.split('#');

    }

    const element = document.createElement(tt.tag);

    element.id = tt.id;
    element.name = tt.name;

    for (const attr of tt.attrs) {
      const [name, value] = attr.trim().split('=');
      element.setAttribute(
        name.trim(),
        value.trim().replace(/^[\s"']+|[\s"']+$/g, '')
      );
    }

    element.className = [...new Set([
      ...element.className.trim().split(/\s+/),
      ...tt.classes
    ])].join(' ').trim();

    return element;

  }

}))
