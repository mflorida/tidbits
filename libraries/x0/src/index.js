// placeholder file?
export default (async function(){
  await import('./polyfills.js');
  await import('./x0.js');
  await import('./x0.spawnElement.js');
  await import('./x0.spawnHTML.js');
  await import('./x0.spawnXML.js');
  await import('./x0.hipsum.js');

  console.log('index.js');

  const x0 = window.x0;

  if (!x0) {
    return null;
  }

  (function(x0) {

    // $00('h1', $00('header')[0])[0].textContent = x0.hipsum.title(4);

    x0('** header > h1').text(x0.hipsum.title(4));

    x0('// footer > #footer-text').text(x0.hipsum.sentences(2, [7, 5]));

    x0('.|hipsum-html').html(function() {
      return x0.hipsum.paragraphs(3, [2, 5, 9], [5, 10, 15]);
    });

    x0('#|hipsum-text').text(x0.hipsum.sentence);

    // .exe() method executes callback function once with current instance as `this`
    x0('@data-more-filler').exe(function(selected) {
      var i = -1;
      while (++i < 5) {
        x0.spawnElement('p.filler', { container: selected[0] });
      }
    });

    var _filler = x0('.|filler');
    _filler.text(x0.hipsum.sentence);
    console.log(_filler.all());

  })(x0);

  (function(x0) {
    x0.DOM = {
      id: {},
      name: {},
      className: {},
      data: {},
      uid: {}
    };

    // TODO: remove this. it's dumb.
    function cacheByAttr(attr, element) {
      const key = element[attr];
      if (attr in element || element.hasAttribute(attr)) {
        x0.DOM[attr] = x0.DOM[attr] || {};
        x0.DOM[attr][key] = x0.DOM[attr][key] || [];
        x0.DOM[attr][key].push(element);
      }
    }

    // cache all elements on page load for SUPER fast selection
    x0('//*').each(function(element) {

      // var UID = x0.uid();
      //
      // if (!element.uid) {
      //     element.uid = UID
      // }
      // // cache elements by uid
      // x0.DOM.uid[UID] = element;

      // cache elements by className
      if (element.className) {
        x0.forEach(element.classList, function(className) {
          cacheByAttr('className', element);
        });
      }

      // cache elements by other common attributes
      if (element.id) {
        cacheByAttr('id', element);
      }
      if (element.name) {
        cacheByAttr('name', element);
      }
      if (element.value) {
        cacheByAttr('value', element);
      }

      for (const dataKey in element.dataset) {
        if (element.dataset[dataKey]) {
          x0.DOM.data[dataKey] = x0.DOM.data[dataKey] || [];
          x0.DOM.data[dataKey].push(element);
        }
      }

    });
    console.log(x0.DOM);
  })(x0);

  // assignment to `window.x0` is intentional
  return (window.x0 = x0);

})();
