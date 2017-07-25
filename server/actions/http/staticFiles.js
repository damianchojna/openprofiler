const fs = require('fs');
const path = require('path');
const url = require('url');
const crypto = require('crypto');
const zlib = require('zlib');
const mime = require('mime-types')

module.exports = function (req, res, container) {

    req.url = req.url === '/' ? 'index.html' : req.url;
    let reqPath = url.parse(req.url).pathname;

    let rootDir = container.get('config').get('root');

    let filePath = path.join(rootDir, 'client', 'public', path.normalize(reqPath));
    if (fs.existsSync(filePath)) {

        let cacheControl = container.get('config').get('server')["cache-control"] || {
                "text/html": "no-cache",
                "default":   "private,max-age:86400"
            };
        let stats = fs.statSync(filePath);
        let headers = {
            "Content-Type": mime.lookup(filePath),
            "Cache-Control": cacheControl[mime.lookup(filePath)] || cacheControl.default, //Cache for 24h
            "ETag": crypto.createHash('md5').update(JSON.stringify(stats)).digest('hex'),
            "Last-Modified": stats.mtime.toUTCString()
        };

        let fileStream = fs.createReadStream(filePath);

        let acceptEncoding = req.headers['accept-encoding'] || '';

        // See http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.3
        if (/\bdeflate\b/.test(acceptEncoding)) {
            headers["Content-Encoding"] = 'deflate';
            res.writeHead(200, headers);
            fileStream.pipe(zlib.createDeflate()).pipe(res);
        } else if (/\bgzip\b/.test(acceptEncoding)) {
            headers["Content-Encoding"] = 'gzip';
            res.writeHead(200, headers);
            fileStream.pipe(zlib.createGzip()).pipe(res);
        } else {
            res.writeHead(200, headers);
            fileStream.pipe(res);
        }

    } else {
        res.statusCode = 404;
        res.end();
    }
}