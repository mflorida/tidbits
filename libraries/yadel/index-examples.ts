import ya, {
  yaTags,
  yadelTags,
  ___FRAG,
  ___HTML,
  asHtml,
  elementEvents
} from './main';

const { p, b, a } = yadelTags;
const { div, textarea } = yaTags;

console.log('p()', p());
console.log('b()', b());
console.log('a()', a());
console.log('div()', div());
console.log('yaTags.i()', yaTags.i());

const app_ = document.getElementById('app');

const container_ = div({
  className: 'container',
  style: {
    width: '800px',
    margin: '0 auto'
  }
}).appendTo(app_);

p(___HTML + 'This is some HTML shit right here.')
  .append(p(___FRAG + 'This is a fragment inside of a <p>?').get())
  .appendTo(container_.get());

console.log(
  p({ title: 'Bogus' }, [
    b('Yo.'),
    ' ',
    asHtml('<!-- nothing -->'),
    ___HTML + `${a({ href: '/bogus' }, [`It's bogus.`]).html()}`,
    ' ',
    ['i', {}, ['Totally!']]
  ]).appendTo(container_.get()).html()
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
div_.appendTo(app_);

// Modify after insertion...
// ...PREPEND an <h1>
container_.prependHTML('<h1>Yadel</h1>');

const eventMapOutput = textarea().attr({
  id: 'event-map-output',
  rows: 40
}).style({
  width: '100%'
}).prop({
  value: JSON.stringify(elementEvents(), null, 2)
});

div_.appendElement(
  p(eventMapOutput.ya())
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
  ['a', {
    attr: {
      href: '#',
      'class': 'thing'
    },
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
      // on: [['click', (e) => console.log(e.target.tagName) ]]
    }, [
      'A thing to click.'
    ]]
  ]]
]).appendTo(div_.get());

// document.body.insertAdjacentHTML(
//   'afterbegin',
//   ya('h2')
//     .appendHTML('HELLO WORLD!')
//     .html()
// );
