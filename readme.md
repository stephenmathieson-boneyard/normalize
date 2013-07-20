
# normalize

  Normalize events

## Installation

  Install with [component(1)](http://component.io):

    $ component install stephenmathieson/normalize

## API

### `normalize(fn)`

Normalize the event provided to `fn`.  Will fallback to `window.event` if no event is provided to `fn`.

### `normalize(event)`

Normalize the given `event`.  Will fallback to `window.event`.

## Added Properties and Methods

`normalize` will provide you access to the following properties and methods of an `Event`:

  - target
  - which
  - preventDefault()
  - stopPropagation()

## Examples

```js
var ev = require('event');
var normalize = require('normalize');

var foo = document.getElementById('foo');

ev.bind(foo, 'click', normalize(function (e) {
  // ...
}));

ev.bind(foo, 'mouseover', function (e) {
  e = normalize(e);
  // ...
});
```

## License

MIT
