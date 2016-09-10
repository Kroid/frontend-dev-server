const fs = require('fs');
const path = require('path');
const sass = require('node-sass');

function render(roots, url, cb, idx) {
  idx = idx || 0;
  var root = roots[idx];
  if (!root) {
    return cb('not found');
  }

  var parts = url.split('.');
  parts.pop();

  var sassFilename = path.join(root, parts + '.sass');
  var scssFilename = path.join(root, parts + '.scss');

  sass.render({ file: sassFilename}, function(err, result) {
    if (err) {
      return sass.render({file: scssFilename}, function(err, result) {
        if (err) {
          return render(roots, url, cb, idx + 1);
        }

        return cb(null, result.css);
      });
    }

    return cb(null, result.css);
  });
}


function middleware(roots) {
  const cssRe = /\.css$/;
  const sassRe = /\.sass$/;
  const scssRe = /\.scss$/;


  return function(req, res, next) {
    var url = req.url;

    if (!url.match(cssRe)) {
      return next();
    }

    render(roots, url, function(err, data) {
      if (err) {
        return next(err);
      }

      res.writeHead(200, {'Content-Type': 'text/css'})
      res.end(data);
    });
  };
}

module.exports = middleware;
