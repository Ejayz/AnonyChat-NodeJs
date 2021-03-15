"use strict"
const wsServer = require('websocket').server;
const http = require('http');
var socket = new wsServer({
    httpServer: http.createServer().listen(1337)
});


var client = [];
var history = [];
var muted = [];


function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

socket.on("request", function (request) {
    var connection = request.accept(null, request.origin);
    var index = client.push(connection) - 1;
    var userName = false;
    console.log("New connection accepted from " + request.origin + " on " + new Date() + 'Client ' + index);

    if (history.length > 0) {
        connection.sendUTF(JSON.stringify({ type: 'history', data: history }));
    }
    connection.on("message", function (message) {

        if (userName === false) {
            userName = htmlEntities(message.utf8Data);
            connection.sendUTF(JSON.stringify({
                type: "username", data: userName
            }));
        } else {
            var obj = {
                dat: new Date(),
                text: htmlEntities(message.utf8Data),
                author: userName
            }
            history.push(obj);
            history = history.slice(-100);
            var json = JSON.stringify({ type: "message", data: obj });
            for (var i = 0; i < client.length; i++) {
                client[i].sendUTF(json);

            }

        }

    });
    connection.on("close", function (connection) {
        if (userName !== false) {
            console.log("Connection Disconnected :" + new Date() + "Peer:" + index);
            client.slice(index, 1);
        }
    });
});

