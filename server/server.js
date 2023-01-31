const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 5656 });
const util = require('util');
const sleep = util.promisify(setTimeout);

CLIENTS = [];
TurtleCLIENTS = [];
let idCounter = 0;

wss.on('connection', function connection(ws, req) {
    ws.id = idCounter++;
    CLIENTS.push(ws);
    console.log("Client ID connected: ", ws.id);
    ws.send(JSON.stringify({ message: 'print("' + ws.id + '")' }));

    ws.on('message', function incoming(message) {
        try {
            const data = JSON.parse(message);
            if (data.type === "turtle") {
                console.log("Turtle Sent Message: ", ws.id, data.type, data.id, data);
                sendToID(data.turtle, data.id - 1);
            }
            if (data.type === "controller") {
                console.log("Controller Sent Message: ", ws.id, data.type, data.id, data);
                sendToID(data.turtle, data.id, data.delay, data.return);
            }
        } catch (e) {
            message = message.toString();
            console.log("Something went wrong with message:" + message + " " + e);
        }
    });
    ws.on('close', function close() {
        console.log('disconnected ' + ws.id);
    });
});

function sendToID(message, id, delay = 0, returnMessage) {
    if (returnMessage = "false") {
        idCounter = undefined;
    }
    let client = CLIENTS.find(client => client.id === id);
    if (client) {
        setTimeout(function() {
            client.send(JSON.stringify({ message: message, id: idCounter }));
        }, delay);
        console.log("Message sent to client:", idCounter, message);
    }
}