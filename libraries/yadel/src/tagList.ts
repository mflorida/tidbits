/**
 * Standard and void HTML tags
 */

// Standard HTML tags, lowercase, in alphabetical order
export const tags = [
  'a',
  'abbr',
  'address',
  'area',
  'article',
  'aside',
  'audio',

  'b',
  'base',
  'bdi',
  'bdo',
  'blockquote',
  'body',
  'br',
  'button',

  'canvas',
  'caption',
  'cite',
  'code',
  'col',
  'colgroup',

  'data',
  'datalist',
  'dd',
  'del',
  'details',
  'dfn',
  'dialog',
  'div',
  'dl',
  'dt',

  'em',
  'embed',

  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',

  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'head',
  'header',
  'hgroup',
  'hr',
  'html',

  'i',
  'iframe',
  'img',
  'input',
  'ins',

  'kbd',

  'label',
  'legend',
  'li',
  'link',

  'main',
  'map',
  'mark',
  'math',
  'menu',
  'menuitem',
  'meta',
  'meter',

  'nav',
  'noscript',

  'object',
  'ol',
  'optgroup',
  'option',
  'output',

  'p',
  'param',
  'picture',
  'pre',
  'progress',

  'q',

  'rb',
  'rp',
  'rt',
  'rtc',
  'ruby',

  's',
  'samp',
  'script',
  'search',
  'section',
  'select',
  'slot',
  'small',
  'source',
  'span',
  'strong',
  'style',
  'sub',
  'summary',
  'sup',
  'svg',

  'table',
  'tbody',
  'td',
  'template',
  'textarea',
  'tfoot',
  'th',
  'thead',
  'time',
  'title',
  'tr',
  'track',

  'u',
  'ul',

  'var',
  'video',

  'wbr'
] as const;

export const voidTags = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'menuitem',
  'meta',
  'param',
  'source',
  'track',
  'wbr'
] as const;

export const tagList = {
  tags,
  voidTags,
} as const;

export default tagList;

// List of event types as reported by Firefox
export const eventTypes = [
  'readystatechange',
  'beforescriptexecute',
  'afterscriptexecute',
  'fullscreenchange',
  'fullscreenerror',
  'pointerlockchange',
  'pointerlockerror',
  'visibilitychange',
  'abort',
  'blur',
  'focus',
  'auxclick',
  'beforeinput',
  'canplay',
  'canplaythrough',
  'change',
  'click',
  'close',
  'contextmenu',
  'copy',
  'cuechange',
  'cut',
  'dblclick',
  'drag',
  'dragend',
  'dragenter',
  'dragexit',
  'dragleave',
  'dragover',
  'dragstart',
  'drop',
  'durationchange',
  'emptied',
  'ended',
  'formdata',
  'input',
  'invalid',
  'keydown',
  'keypress',
  'keyup',
  'load',
  'loadeddata',
  'loadedmetadata',
  'loadstart',
  'mousedown',
  'mouseenter',
  'mouseleave',
  'mousemove',
  'mouseout',
  'mouseover',
  'mouseup',
  'wheel',
  'paste',
  'pause',
  'play',
  'playing',
  'progress',
  'ratechange',
  'reset',
  'resize',
  'scroll',
  'scrollend',
  'securitypolicyviolation',
  'seeked',
  'seeking',
  'select',
  'slotchange',
  'stalled',
  'submit',
  'suspend',
  'timeupdate',
  'volumechange',
  'waiting',
  'selectstart',
  'selectionchange',
  'toggle',
  'pointercancel',
  'pointerdown',
  'pointerup',
  'pointermove',
  'pointerout',
  'pointerover',
  'pointerenter',
  'pointerleave',
  'gotpointercapture',
  'lostpointercapture',
  'mozfullscreenchange',
  'mozfullscreenerror',
  'animationcancel',
  'animationend',
  'animationiteration',
  'animationstart',
  'transitioncancel',
  'transitionend',
  'transitionrun',
  'transitionstart',
  'webkitanimationend',
  'webkitanimationiteration',
  'webkitanimationstart',
  'webkittransitionend',
  'error'
] as const;

export const allTags = [].concat(
  'custom-element',
  'yadel-element',
  tags,
  voidTags
);

const regex_on = /^on/i;

const eventMap = {
  $all: {},
  document: [],
  window: [],
  ...allTags.reduce((out, tag) => {
    out[tag] = [];
    return out;
  }, {})
};

const eventTags = {};

function processEventMap(element, tagName) {
  for (const property in element) {
    if (regex_on.test(property)) {
      const evtName = property.replace(regex_on, '');

      eventTags[evtName] = [].concat(eventTags[evtName] || [], tagName);
      eventTags[evtName].sort();

      eventMap[tagName] = [].concat(eventMap[tagName] || [], evtName);
      eventMap[tagName].sort();

      // Map elements to event types
      if (eventMap.$all[evtName]) {
        eventMap.$all[evtName].push(tagName);
      } else {
        eventMap.$all[evtName] = [tagName];
      }
    }
  }
}

// Build list events for each tag type
export function elementEvents() {
  // const tagCount = Object.keys(eventMap).length;

  processEventMap(document, 'document');
  processEventMap(window, 'window');

  for (const tag of allTags) {
    processEventMap(document.createElement(tag), tag);
  }

  // console.log('tagCount', tagCount - 3);
  // console.log('eventMap', eventMap);
  // console.log('eventTags', eventTags);

  console.log(eventMap);

  return eventMap;
}

// export const tagFnMap = {
//   a: (...args) => ya('a', ...args),
//   b: HTMLElement,
//   p: HTMLParagraphElement,
//   div: HTMLDivElement
// };

