import { elementEvents } from './src/tagList';
import ya, { HTML_PREFIX } from './src/yadel';

const { p, b, a, textarea, button } = ya.tags;

function asHTML(str) {
  return HTML_PREFIX + String(str).trim();
}

p([
  HTML_PREFIX + 'This is some HTML shit right here.'
]).appendTo(document.body);

console.log(
  p({ title: 'Bogus' }, [
    b(['Yo.']),
    asHTML('<!-- nothing -->'),
    `${HTML_PREFIX} ${a({ href: '/bogus' }, [`It's bogus.`]).html()}`,
    ' ',
    ['i', {}, ['Totally!']]
  ]).html()
);

const div_ = ya('div', {
  attr: { title: 'Yadel' },
  // on: [['click', 'a.thing', (e) => {
  //   console.log(e.target);
  //   // console.log(e.currentTarget);
  //   e.preventDefault();
  //   // e.stopPropagation();
  //   console.log('you clicked a thing')
  // }]]
});

div_.appendHTML('<i>Hello. Good day.</i><br><br>');
div_.appendText('<b>This will be inserted as text, not HTML</b>');
div_.appendHTML('<br><br>');
div_.appendText('...and goodbye.');
div_.render('#app');

// Modify after insertion...
// ...PREPEND an <h1>
div_.prependHTML('<h1>Yadel</h1>');

const eventMapOutput = textarea().attr({
  id: 'event-map-output',
  rows: 40
}).style({
  width: '100%'
}).prop({
  value: JSON.stringify(elementEvents(), null, 2)
});

div_.appendElement(
  p([
    eventMapOutput
  ])
);

// div_.appendElement(
//   p().appendElement(
//     button({
//       attr: { type: 'button' },
//       on: [
//         {
//           click: (e) => console.log('clicked', e.target)
//         },
//         {
//           click: (e) => console.log('another handler')
//         },
//         {
//           click: (e) => {
//             console.log(elementEvents());
//             // eventMapOutput.prop({
//             //   value: JSON.stringify(elementEvents(), null, 2)
//             // });
//           }
//         }
//       ]
//     }, 'Generage Event Map')
//   )
// );

// Now add an `<a>` to `div_`
ya('p', [
  ya('a', {
    attr: {
      href: '#',
      'class': 'thing',
      'data-foo': () => {
        // try {
          throw new Error('NOPE')
        // } catch (e) {
        //   throw new Error(`Can't do it!`);
        // }
      }
    },
    on: [
      {
        click: (e) => {
          e.preventDefault();
          console.log('Clicking <a>', e);
        }
      },
      {
        mouseenter: (e) => console.log('Entering the:', e.currentTarget.tagName),
      },
    ]
    // on: [{
    //   click: (e) => {
    //     console.log(e.target);
    //     console.log(e.currentTarget);
    //     e.preventDefault();
    //     // e.stopPropagation();
    //     console.log('you clicked the thing directly.');
    //   }
    // }]
  }, [
    ['b', {
      on: [
        ['mouseleave', (e) => console.log('leaving...', e)],
        {
          click: [
            (e) => {
              e.preventDefault();
              console.log(e.target.tagName);
            }, {
              bubbles: false
            }
          ]
        },
        ['click', (e) => console.log('Click handler #2', e)],
        // ['mouseover', (e) => console.log('hovering', e.target.tagName)]
      ]
    }, ['A thing to click.']]
  ]),
  ['br'],
  ['br'],
  ['i', [
    'Italics!',
    ' ',
    asHTML('<!-- COMMENTS! -->'),
    ['b', [
      'AND BOLD!',
      ' ',
      ['small', ['(and small)']]
    ]]
  ]]
]).appendTo(div_.get());
