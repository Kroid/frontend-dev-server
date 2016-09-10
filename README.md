# frontent-dev-server
Dev webserver for frontend works.

## Features:
* multiple roots
* autocompile jade, pug, sass, scss files
* proxy requests

## Getting started
```
npm i --save-dev frontent-dev-server
```

```javascript
var Server = require('frontent-dev-server');
var server = new Server({
  root: ['./app', './public'],
  port: 3001,
  proxy: {
    '/api/': 'https://myapiserver.com',
  }
});

server.start();
```

See example.
