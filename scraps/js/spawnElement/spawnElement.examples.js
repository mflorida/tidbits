((window) => {

  const spawnContainer = document.getElementById('spawn');

  function spawnElement() {
    return window.spawnElement.apply(null, [].slice.call(arguments));
  }

  function spawnFrags(container) {
    const frag = spawnElement('', `I'm in a fragment. `);
    const fragToo = spawnElement('!', `I'm in a fragment too. `);
    // frag.append(fragToo.clone());
    frag.render(container);
    // fragToo.append(frag.clone());
    fragToo.render(container);
    spawnElement().append([
      ['br'],
      ['i', { className: 'also-in-a-fragment' }, `And I'm also in a fragment. `],
      ['br']
    ]).render(container);
    console.log(container);
    spawnElement('#', `I'm also in a fragment as well. `).render(container);
  }

  window.spawnFrags = spawnFrags;

  function randomHex() {
    return Math.random().toString(16).slice(2, 8);
  }

  const nestedElements = ['div', {
    id: 'foo-bar-baz',
    className: 'totally-bogus',
    data: { fooBar: 'baz' },
    html: '<hr>',
    innerHTML: '<i>inner</i>',
    on: {
      click: [(e) => {
        const elem = e.target;
        e.stopImmediatePropagation();
        console.log(elem.tagName);
        elem.style.color = '#' + randomHex();
        elem.style.background = '#' + randomHex();
      }]
    }
  }, [
    ['hr'],
    [`p#foo.bar.baz|title="It's the Foo"`, null, [
      `I'm a paragraph.`,
      ['br'],
      ['small.tiny', null, `And I'm small.`],
      '<!-- double <br> elements as HTML string: -->',
      `<br><br>`,
      ['button.btn|type=button', {
        prop: {
          title: (() => {
            console.log('button title');
            return 'Bogus';
          })()
        },
        on: [
          ['click', (e) => {
            console.log('click 1', e.target.tagName);
            document.body.style.color = '#' + randomHex();
          }],
          ['click', (e) => {
            console.log('click 2', e.target.tagName);
            e.target.style.color = '#' + randomHex();
          }],
          ['mouseover', (e) => {
            console.log('mouseover', e.target.tagName);
            document.body.style.background = '#' + randomHex();
          }],
          ['mouseout', (e) => {
            console.log('mouseout', e.target.tagName);
          }]
        ]
      }, 'Click Me']
    ]]
  ]];

  const spawned = spawnElement(nestedElements);
  const cloned = spawned.clone();

  spawned.render(spawnContainer);

  spawnElement('br').render(spawnContainer);

  spawnElement('p')
    .append([
      '<pre>cloned: </pre>',
      cloned
    ])
    .append([
      ['br'],
      ['b', `That's bold.`],
      '<pre>death</pre>'
    ])
    .render(spawnContainer);

})(window);
