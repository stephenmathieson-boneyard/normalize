describe('normalize', function () {
  var normalize = require('normalize'),
      ev = require('event');

  var div = document.getElementById('div'),
      anchor = document.getElementById('anchor');

  function assertEqual(actual, expected, msg) {
    if (actual != expected) {
      throw new Error(actual + ' != ' + expected);
    }
  }

  function fire(element, type, augment) {
    augment = augment || {};

    var e = document.createEvent
      ? document.createEvent('HTMLEvents')
      : document.createEventObject();

    for (var a in augment) {
      if (a === 'which') {
        e.keyCode = augment[a];
      }
      e[a] = augment[a];
    }

    if (e.initEvent) {
      e.initEvent(type, true, true);
    }

    element.dispatchEvent
      ? element.dispatchEvent(e)
      : element.fireEvent('on' + type, e);
  }

  describe('normalize(fn)', function () {
    it('should work', function (done) {
      var fn = ev.bind(div, 'click', normalize(function (e) {
        assertEqual(e.target, div, 'e.target should be #div');
        ev.unbind(div, 'click', fn);
        done();
      }));
      fire(div, 'click');
    });
  });

  describe('normalize(e)', function () {
    it('should add ".target"', function (done) {
      var fn = ev.bind(div, 'click', function (e) {
        e = normalize(e);
        assertEqual(e.target, div, 'e.target should be #div');
        ev.unbind(div, 'click', fn);
        done();
      });
      fire(div, 'click');
    });

    it('should add ".which" to keyboard events', function (done) {
      var fn = ev.bind(anchor, 'keydown', function (e) {
        e = normalize(e);
        assertEqual(e.which, 13);
        ev.unbind(anchor, 'keydown', fn);
        done();
      });
      fire(anchor, 'keydown', { which: 13 });
    });

    it('should add ".preventDefault()"', function (done) {
      var fn = ev.bind(div, 'click', function (e) {
        e = normalize(e);
        assertEqual(typeof e.preventDefault, 'function');
        ev.unbind(div, 'click', fn);
        done();
      });
      fire(div, 'click');
    });

    describe('e.preventDefault', function () {
      it('should work', function (done) {
        location.hash = '#bananas';

        var fn = ev.bind(anchor, 'click', function (e) {
          ev.unbind(anchor, 'click', fn);

          normalize(e).preventDefault();

          setTimeout(function () {
            assertEqual(location.hash, '#bananas');
            done();
          }, 0);
        });

        fire(anchor, 'click');
      });
    });

    it('should add ".stopPropagation()"', function (done) {
      var fn = ev.bind(div, 'click', function (e) {
        e = normalize(e);
        assertEqual(typeof e.stopPropagation, 'function');
        e.stopPropagation();
        ev.unbind(div, 'click', fn);
        done();
      });
      fire(div, 'click');
    });

    describe('e.stopPropagation', function () {
      it('should work', function (done) {

        ev.bind(div, 'click', function (e) {
          throw new Error('stopPropagation didn\'t stop propagation');
        });

        var fn = ev.bind(anchor, 'click', function (e) {
          ev.unbind(anchor, 'click', fn);

          normalize(e).stopPropagation();
          // the click will bubble to the div within 10ms, even in old ie
          setTimeout(function () {
            done();
          }, 10);
        });

        fire(anchor, 'click');
      });
    });
  });
});
