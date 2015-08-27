// *******************
// require modules
// *******************
global.fs = require('fs');
var express = require("express");
var WebSocketServer = require("ws").Server;
var http = require("http");
var path = require('path');


// *******************
// app variables
// *******************
var app = express();
var port = process.env.PORT || 5000;
var server = http.createServer(app)


// *******************
// global variables
// *******************
global.appStatus = {};
global.version = JSON.parse(global.fs.readFileSync('./app/version.json', 'utf8'));


// *******************
// router
// *******************
app.get('/', function (req, res) {
    if (req.query.shop == undefined) {
        res.status(406).json({error: "parameter shop couldn't be empty"})
        return false
    }

    try {
        global.appData = JSON.parse(global.fs.readFileSync('./app/shops/' + req.query.shop + '/app.json', 'utf8'));
        app.use('/', express.static(__dirname + "/app/" + global.appData.appFolder));
        res.sendFile(path.join(__dirname, '/app/', global.appData.appFolder, 'index.html'));
    } catch (e) {
        res.status(406).json({error: "you set incorrect shop parameter"})
    }
})

app.use('/admin', express.static(__dirname + "/admin"));
app.get('/admin', function (req, res) {
    res.sendFile(path.join(__dirname, '/admin/', 'index.html'));
})


// version.json update listener
global.fs.watchFile('app/version.json', function (curr, prev) {
    global.version = JSON.parse(global.fs.readFileSync('./app/version.json', 'utf8'));
});


// Create HTTP server
server.listen(port)
console.log("http server listening on %d", port);


// Create WebSocketServer
global.wss = new WebSocketServer({server: server});
console.log("WebSocket server created");
require('./socket');
