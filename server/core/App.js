const ws = require('ws');
const fs = require('fs');
const url = require('url');
const http = require('http');
const WebSocket = require('ws');

class App {

    constructor() {
        this.container = {};
        this.httpRoutes = {};
        this.websocketRoutes = {};
    }

    setContainer(container) {
        this.container = container;
    }

    getContainer() {
        return this.container;
    }

    addHttpRoute(path, file) {
        this.httpRoutes[path] = file;
    }

    addWebsocketRoute(path, file) {
        this.websocketRoutes[path] = file;
    }

    handle() {
        let server = http.createServer((req, res) => {

            let reqPath = url.parse(req.url).pathname;
            let route = null;
            for (let path in this.httpRoutes) {
                if (reqPath.indexOf(path) === 0) {
                    route = path;
                    break;
                }
            }
            if (route) {
                this.httpRoutes[route](req, res, this.getContainer());
            } else {
                res.statusCode = 404;
                res.end();
            }

        });

        let wss = new ws.Server({ server });

        wss.on('connection', (ws, req) => {
            ws.on('message', (message) => {
                for (var firstKey in this.websocketRoutes) break;
                this.websocketRoutes[firstKey](ws, req, message, this.container);
            });

            let clientsCount = 0;
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    clientsCount++;
                }
            });
            ws.send(JSON.stringify({
                clients: clientsCount
            }));
        });

        this.container.set('server', server);
        this.container.set('wss', wss);

        server.listen(this.container.get('config').get('server.port'), () => {
            console.log('Listening on %d', server.address().port);
        });
    }
}

module.exports = new App();