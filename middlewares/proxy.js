const url = require('url');
const httpProxy = require('http-proxy');

/**
 * @param {Object} routes -
 *                          {prefix: {target: url, secure: true|false}
 *                            or
 *                          {prefix: target}
 */
function proxy(routes) {
  var self = this;

  self.configRoutes = {};
  Object.keys(routes).map(function(prefix) {
    var target = routes[prefix];
    var secure = false;

    if (typeof target === 'object') {
      secure = target.secure || false;
      target = target.target;
    }

    self.configRoutes[prefix] = {
      proxyServer: httpProxy.createProxyServer({
        target: target,
        secure: secure
      }),
      url: url.parse(target),
    }
  })

  return function(req, res, next) {
    var prefix = Object.keys(self.configRoutes).filter(function(prefix) {
      if (req.url.indexOf(prefix) === 0) {
        return true;
      }
    })[0];

    if (!prefix) {
      return next();
    }

    req.headers.host = self.configRoutes[prefix].url.hostname;
    self.configRoutes[prefix].proxyServer.web(req, res);
  }
}

module.exports = proxy;