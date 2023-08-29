import { parseTag, parseStyle, reactProps } from './parseTag.js';
console.log(parseStyle('display:block;background-color:cornflowerblue;'));

// Returns an object similar to what's used for React.createElement()
function fakeReactCreateElement(tag, props, children) {
  return {
    $$typeof: 'Symbol(react.element)',
    type: tag,
    key: null,
    ref: null,
    props: {
      ...props,
      children
    },
    _owner: null,
    _store: {}
  }
}

{
  const [tag, attr] = parseTag('div#foo.bar?baz|title="Some Div"|data-id=102938|style="width:80%;margin:0 auto;display:flex;justify-content:center;');
  console.log(tag, attr);
  console.log(fakeReactCreateElement(
    tag,
    reactProps(attr),
    `Here's your content!`
  ));
}

{
  const [tag, attr] = parseTag('<>');
  console.log(tag, attr);
}
