# frontent-dev-server
Dev webserver for frontend works.

## Features:
* multiple roots
* autocompile jade, pug, sass, scss files
* proxy requests
* custom connect-like middlewares

## Getting started
```
npm i --save-dev frontent-dev-server
```

```javascript
var modRewrite = require('connect-modrewrite');
var Server = require('frontent-dev-server');
var server = new Server({
  root: ['./app', './public'],
  port: 3001,
  proxy: {
    '/api/': 'https://myapiserver.com',
  },
  middlewares: [
    modRewrite([ '!\\.\\w+$ /index.html [L]' ]) // for angularjs projects
  ]
});

server.start();
```

See example.
