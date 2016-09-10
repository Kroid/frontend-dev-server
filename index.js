'use strict';

const http = require('http');
const connect = require('connect');
const serveStatic = require('serve-static')

const proxy = require('./middlewares/proxy');
const pug = require('./middlewares/pug');
const scss = require('./middlewares/scss');

// options:
//  port: default 3001;
//  root: one or multiple, ex: ['public', 'data']. default '.'
//  proxy: ex: {
//    '/api': 'http://servername.com',
//    '/media': 'https://files.servername.com'
// }
class Server {
  constructor(options) {
    options = options || {};
    const self = this;
    this.app = connect();
    this.config = {};
    this.config.port = options.port || 3001;
    this.config.root = options.root || '.';

    if (typeof this.config.root === 'string') {
      this.config.root = [this.config.root];
    }

    if (options.proxy) {
      this.app.use(proxy(options.proxy))
    }

    this.app.use(pug(this.config.root));
    this.app.use(scss(this.config.root));

    this.config.root.map(function(root) {
      self.app.use(serveStatic(root));
    });

  }

  use(middleware) {
    this.app.use(middleware);
  }

  start(port) {
    port = port || this.config.port;
    http.createServer(this.app).listen(port);
    console.log(`Server started on port ${port}`)
  }
}

module.exports = Server;