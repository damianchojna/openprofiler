const WebSocket = require('ws');

module.exports = function (ws, req, message, container) {
    let wss = container.get('wss');

    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
};