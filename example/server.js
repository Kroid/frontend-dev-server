'use strict';

var Server = require('../index.js');
var server = new Server({
  root: ['./public', './another_public'],
  proxy: {
    '/youtube/': 'https://www.googleapis.com',
  }
});

server.start();
