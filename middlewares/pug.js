const fs = require('fs');
const path = require('path');
const pug = require('pug');

function readFile(roots, url, cb, idx) {
  idx = idx || 0;
  var root = roots[idx];
  if (!root) {
    return cb('not found');
  }

  var parts = url.split('.');
  parts.pop();

  var jadeFilename = path.join(root, parts + '.jade');
  var pugFilename = path.join(root, parts + '.pug');

  fs.readFile(jadeFilename, function(err, data) {
    if (err) {
      return fs.readFile(pugFilename, function(err, data) {
        if (err) {
          return readFile(roots, url, cb, idx + 1);
        }

        return cb(null, data);
      });
    }

    return cb(null, data);
  });
}

function middleware(roots) {
  const jadeRe = /\.jade$/;
  const pugRe = /\.pug$/;
  const htmlRe = /\.html$/;


  return function(req, res, next) {
    var url = req.url;

    if (url === '/') {
      url = '/index.html';
    }

    if (!url.match(htmlRe)) {
      return next();
    }


    readFile(roots, url, function(err, data) {
      if (err) {
        return next();
      }

      try {
        var html = pug.render(data);
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.end(html);    
      } catch(err) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(err));
      }
    });
  }
}


module.exports = middleware;