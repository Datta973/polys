var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
let Mahou = require("./lib/quadtree.js")

let boundary = new Mahou.Rectangle(1500, 1500, 1500, 1500);

let qTree = new Mahou.QuadTree(boundary, 5);

let players = {};
let pellets = [];
let requiredPelletData = [];
let collidedPellets = [];
let temp = {};
let viewport = new Mahou.Rectangle(0, 0, 0, 0);
let points_sc = [0, 2, 4, 6, 8, 10, 12, 13, 14, 15, 16];
let temp_data = {};


const RAD = (Math.PI / 180);

for (var i = 0; i < 400; i++) {
    qTree.insert({ x: Math.floor(Math.random() * 3000), y: Math.floor(Math.random() * 3000), radius: 10 });
}

app.use(express.static("src"))

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/src/index.html');
});



io.on('connection', function (socket) {
    players[socket.id] = {
        x: 0,
        y: 0,
        angle: 0,
        tip: { x: 0, y: 0 },
        experience: 0,
        level: 1,
        speedX: 0,
        speedY: 0,
        freezed: false
    }

    temp_data[socket.id] = {
        clientWidth: 1024,
        clientHeight: 1024,
        angle: 0,
        isFiring: false,
        back:false
    }

    socket.on("pre_data", function (data) {
        temp_data[socket.id].clientWidth = data.clientWidth;
        temp_data[socket.id].clientHeight = data.clientHeight;
    })

    socket.on('disconnect', function () {
        socket.removeAllListeners("update_data");
        delete players[socket.id];
        delete temp_data[socket.id];
    })
    socket.on('update_data', function (data) {
        for (var prop in data) {
            players[socket.id][prop] = data[prop];
        }
    })
    socket.on("key_left", function (key) {
        players[socket.id].speedX = -4 * key;
    })
    socket.on("key_up", function (key) {
        players[socket.id].speedY = -4 * key;
    })
    socket.on("key_right", function (key) {
        players[socket.id].speedX = 4 * key;
    })
    socket.on("key_down", function (key) {
        players[socket.id].speedY = 4 * key;
    })
    socket.on("level_inc", function () {
        players[socket.id].level += 1;
    })
    socket.on("fire", function () {
        temp_data[socket.id].isFiring = true;
        temp_data[socket.id].angle = players[socket.id].angle;
        players[socket.id].freezed = true;
    })

});

http.listen(3000);



function resend() {

    for (var player in players) {

        if (temp_data[player].isFiring) {
            // console.log(dist(players[player].tip, { x: players[player].level * 70 * Math.cos(RAD * -(temp_data[player].angle - 90)), y: -(players[player].level * 70 * Math.sin(RAD * -(temp_data[player].angle - 90))) }));
            if (dist(players[player].tip, { x: players[player].level * 70 * Math.cos(RAD * -(temp_data[player].angle - 90)), y: -(players[player].level * 70 * Math.sin(RAD * -(temp_data[player].angle - 90))) }) > 1 && temp_data[player].back != true ) {

                players[player].tip.x += players[player].level * 10 * Math.cos(RAD * -(temp_data[player].angle - 90));
                players[player].tip.y -= players[player].level * 10 * Math.sin(RAD * -(temp_data[player].angle - 90));
            } else {
                temp_data[player].back = true;
                if (dist(players[player].tip, { x: 0, y: 0 }) > 1) {
                    players[player].tip.x -= players[player].level * 10 * Math.cos(RAD * -(temp_data[player].angle - 90));
                    players[player].tip.y += players[player].level * 10 * Math.sin(RAD * -(temp_data[player].angle - 90));
                } else {
                    temp_data[player].isFiring = false;
                    players[player].tip.x = 0;
                    players[player].tip.y = 0;
                    players[player].freezed = false;
                    temp_data[player].back = false;
                }
            }
        } else {
            players[player].x += players[player].speedX;
            players[player].y += players[player].speedY;
        }

        viewport.x = players[player].x;
        viewport.y = players[player].y;
        viewport.w = temp_data[player].clientWidth;
        viewport.h = temp_data[player].clientHeight - 340;
        requiredPelletData = qTree.query(viewport);
        checkCollision(players[player])
        removePellets();
        io.to(player).emit('update_data', { player_list: players, food_data: requiredPelletData })
    }
    collidedPellets = [];
    requiredPelletData = [];
    // io.emit('update_data', players);
}

setInterval(resend, 1000 / 30)

function random() {
    if (arguments.length == 0) {
        return Math.random();
    } else if (arguments.length == 1) {
        return Math.floor(Math.random() * arguments[0]);
    } else {
        return Math.floor(Math.random() * (arguments[1] - arguments[0])) + arguments[0];
    }
}

function checkCollision(plyr) {
    for (let pellet of requiredPelletData) {
        if (dist(plyr, pellet) < 32 + pellet.radius) {
            collidedPellets.push(pellet);
            qTree.remove(pellet);
            qTree.insert({ x: Math.floor(Math.random() * 3000), y: Math.floor(Math.random() * 3000), radius: 10 });
            plyr.experience += 0.25;
            if (plyr.experience >= points_sc[plyr.level]) {
                plyr.experience -= points_sc[plyr.level];
                plyr.level++;
            }
        }
    }
}

function removePellets() {
    for (let pellet of collidedPellets) {
        requiredPelletData.splice(requiredPelletData.indexOf(pellet), 1)
    }
}

function dist() {
    var a = arguments[0].x - arguments[1].x;
    var b = arguments[0].y - arguments[1].y;
    return Math.sqrt(a * a + b * b);
}