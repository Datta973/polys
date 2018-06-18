// socket dependencies
let socket = io();
// end socket dependencies

var x, y,
    x2 = 0,
    y2 = 0,
    speed = 2, // max speed
    friction = 0.98, // friction
    keys = [];


let nitro = false;
let fuel = 1000;
let hasThrust = true;
let size = 3;
let thrustTime = 0;
let canThrust = true;
let thrustDirection = 1;
let angle = 0;
let angle2;
let damage = 0;
let damaged = false;
let damageid = null;
let _speed = 40;
let _range = 40;
let _size = 15;

let span = 10;

let experience = 0;

let phi, distance, sign;

let tipX, tipY;

let level = 1;
let usedPoints = 0;
let availablePoints = 10;
let points_sc = [0, 2, 4, 6, 8, 10, 12, 13, 14, 15, 16];

let test;
let sides = 3;

let dx = 0, dy = 0;
let rgb;

let food = [];

let colors = ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#f1c40f", "#e67e22", "#e74c3c", "#ecf0f1"];

const world_width = 3000;
const world_height = 3000;

function setup() {
    canvas("game_canvas");
    _canvas.width = window.innerWidth;
    _canvas.height = window.innerHeight;
    frameRate = 100;
}

function create() {
    player = new rectangle(_canvas.width / 2, _canvas.height / 2, 50, 7);
    cap = new ellipse(0, 0, 20, 20);
    eye1 = new ellipse(-7, 0, 7, 7);
    eye2 = new ellipse(7, 0, 7, 7);
    eyeBall1 = new ellipse(0, 0, 3, 3);
    eyeBall2 = new ellipse(0, 0, 3, 3);
    tip = new polygon(0, 0, _size, 3);
    tipX = tip.x;
    tipY = tip.y;

    healthBar = new percentageBar(0, 27, 50, 3.5);
    xpBar = new circularLevelBar(player.x, player.y, 32);

    speedBar = new percentageBar(100, _canvas.height - 70, 140, 10, 2);
    rangeBar = new percentageBar(100, _canvas.height - 50, 140, 10, 2);
    movementSpeedBar = new percentageBar(100, _canvas.height - 30, 140, 10, 2);

    levelBar = new percentageBar(158, 15, 300, 18, 2);
    levelBar.fillStyle("#dcdde1")

    levelText = new Text("level " + level, -20, -5, 21);
    levelText.family = 'cursive';
    levelText.fontBorderColor = '#000';
    levelText.fillStyle("transparent");
    levelText.strokeStyle("transparent");
    levelText.fontBorder = true;
    levelText.bold = true;

    pointsText = new Text("x" + availablePoints, speedBar.x - speedBar.width / 2, speedBar.y - 30, 25);
    pointsText.fillStyle("transparent");
    pointsText.family = 'cursive';
    pointsText.strokeStyle("transparent");
    pointsText.fontBorderColor = '#000';
    pointsText.fontBorder = true;
    pointsText.bold = true;
    pointsText.fontBorderWidth = 1.5;

    speedText = new Text("Pointer Speed", speedBar.x + speedBar.width / 2 + 10, speedBar.y - speedBar.height / 2);
    speedText.fillStyle("#8e44ad")
    speedText.opacity(0, 0);
    rangeText = new Text("Pointer Range", rangeBar.x + rangeBar.width / 2 + 10, rangeBar.y - rangeBar.height / 2);
    rangeText.fillStyle("#8e44ad")
    rangeText.opacity(0, 0);
    movementSpeedText = new Text("Body Speed", movementSpeedBar.x + movementSpeedBar.width / 2 + 10, movementSpeedBar.y - movementSpeedBar.height / 2, 20);
    movementSpeedText.fillStyle("#8e44ad")
    movementSpeedText.opacity(0, 0);

    speedTween = speedText.tween.add({ _fillOpacity: 0 }, { _fillOpacity: 1 }, 10);
    rangeTween = rangeText.tween.add({ _fillOpacity: 0 }, { _fillOpacity: 1 }, 10);
    movementSpeedTween = movementSpeedText.tween.add({ _fillOpacity: 0 }, { _fillOpacity: 1 }, 10);

    speedBar.primaryColor("#2ecc71");
    rangeBar.primaryColor("#3498db");
    movementSpeedBar.primaryColor("#e74c3c");

    speedBar.secondaryColor("#dcdde1");
    rangeBar.secondaryColor("#dcdde1");
    movementSpeedBar.secondaryColor("#dcdde1");

    levelBar.primaryColor("#686de0");
    levelBar.secondaryColor("transparent");



    speedText.size(15);
    rangeText.size(15);
    movementSpeedText.size(15);


    levelBar.health = 0;

    speedText.padding = rangeText.padding = movementSpeedText.padding = 4;

    speedBar.health = 100 / 6;
    rangeBar.health = 100 / 6;
    movementSpeedBar.health = 100 / 6;

    //healthBar.border = false;
    speedBar.opacity(0.5, 0.5);
    rangeBar.opacity(0.5, 0.5);
    movementSpeedBar.opacity(0.5, 0.5);

    eye1.borderWidth = 3;
    eye2.borderWidth = 3;
    tip.borderWidth = 3;
    eye1.opacity(1, 0.5);
    eye2.opacity(1, 0.5);
    eye1.fillStyle("#fff")
    eye2.fillStyle("#fff")
    eyeBall1.fillStyle("#000")
    eyeBall2.fillStyle("#000");
    tip.fillStyle(colors[tip.sides - 3])
    tip.origin(- tip.inRadius - tip.circumRadius - 6, 15);
    eyeBall1.origin(0, 0);
    eyeBall2.origin(0, 0);
    player.borderWidth = 3;
    player.origin(0, 3.5);
    cap.borderWidth = 3;
    cap.strokeStyle("#3d3b3b");
    player.strokeStyle("#3d3b3b");
    player.fillStyle("#16a085");
    cap.fillStyle("#27ae60");
    tip.fillStyle("#e74c3c");
    cap.opacity(1, 1)
    player.opacity(0, 0);
    //tip.opacity(0,1)
    player.circumRadius = cap.circumRadius;
    stage.addChild(xpBar);
    eye1.addChild(eyeBall1);
    eye2.addChild(eyeBall2);
    cap.addChild(eye1);
    cap.addChild(eye2);
    player.addChild(cap);
    player.addChild(tip);
    //player.addChild(healthBar);
    levelBar.addChild(levelText)
    stage.addChild(player);
    stage.addChild(pointsText);
    stage.addChild(speedBar);
    stage.addChild(rangeBar);
    stage.addChild(movementSpeedBar);
    stage.addChild(speedText)
    stage.addChild(rangeText)
    stage.addChild(movementSpeedText);
    stage.addChild(levelBar)

    let color = 3;
    let temp;
    for (var i = 40; i >= 10; i -= 10) {
        forLoop(0, i, 1, function () {
            var hbar = new percentageBar(0, 27, 50, 3.5, 1);
            temp = new polygon(random(20, 2981), random(20, 2981), 20, color);
            temp.type = 'static';
            temp.borderWidth = 2;
            hbar.visible = false;
            hbar._fillOpacity = 0;
            temp.fillStyle(colors[color - 3]);
            temp.addChild(hbar);
            temp.healthBar = hbar;
            stage.addChild(temp);
        })
        color++;
    }

    // event handlers

    speedBar.on("mouseover", function () {
        speedBar.opacity(1, 1);
        speedTween.from._fillOpacity = 0;
        speedTween.to._fillOpacity = 1;
        speedText.tween.start(speedTween);
    })
    speedBar.on("mouseout", function () {
        speedBar.opacity(0.5, 0.5);
        speedTween.from._fillOpacity = 1;
        speedTween.to._fillOpacity = 0;
        speedText.tween.start(speedTween);
    })

    rangeBar.on("mouseover", function () {
        rangeBar.opacity(1, 1);
        rangeTween.from._fillOpacity = 0;
        rangeTween.to._fillOpacity = 1;
        rangeText.tween.start(rangeTween);
    })
    rangeBar.on("mouseout", function () {
        rangeBar.opacity(0.5, 0.5);
        rangeTween.from._fillOpacity = 1;
        rangeTween.to._fillOpacity = 0;
        rangeText.tween.start(rangeTween);
    })

    movementSpeedBar.on("mouseover", function () {
        movementSpeedBar.opacity(1, 1);
        movementSpeedTween.from._fillOpacity = 0;
        movementSpeedTween.to._fillOpacity = 1;
        movementSpeedText.tween.start(movementSpeedTween);

    })
    movementSpeedBar.on("mouseout", function () {
        movementSpeedBar.opacity(0.5, 0.5);
        movementSpeedTween.from._fillOpacity = 1;
        movementSpeedTween.to._fillOpacity = 0;
        movementSpeedText.tween.start(movementSpeedTween);
    })

    speedBar.on("click", function () {

        if (availablePoints == 0 || speedBar.health >= 100 || usedPoints == 10) return;
        usedPoints += 1;
        _speed += 20;
        speedBar.health += 100 / 6;
        availablePoints--;
        pointsText.string = "x" + availablePoints;
    })

    rangeBar.on("click", function () {
        if (availablePoints == 0 || rangeBar.health >= 100 || usedPoints == 10) return;
        usedPoints += 1;
        _range += 60;
        rangeBar.health += 100 / 6;
        availablePoints--;
        pointsText.string = "x" + availablePoints;
    })

    movementSpeedBar.on("click", function () {
        if (availablePoints == 0 || movementSpeedBar.health >= 100 || usedPoints == 10) return;
        usedPoints += 1;
        speed += 0.3;
        movementSpeedBar.health += 100 / 6;
        availablePoints--;
        pointsText.string = "x" + availablePoints;
    })


    // end of event handlers
    x = 50;
    y = 50;
    __Mahou__.font = '20px tahoma';

    // *** socket ***
    others = {};

    socket.emit("pre_data", { clientWidth: _canvas.width, clientHeight: _canvas.height })

    socket.on('update_data', function (data) {
        socket.emit('update_data', { angle: angle + 180 });
        food = data["food_data"];
        for (var id in others) {
            if (data["player_list"][id] == undefined) {
                delete others[id];
            }
        }
        for (var id in data["player_list"]) {
            // if (id != socket.id) {
            if (!others[id]) {
                others[id] = new Player(data["player_list"][id]);
                continue;
            }
            others[id].target.x = data["player_list"][id].x;
            others[id].target.y = data["player_list"][id].y;
            others[id].xpBar.level = (data["player_list"][id].level - 1) * 10;
            others[id].level = data["player_list"][id].level;
            others[id].rotation.target = data["player_list"][id].angle;
            others[id].target.tip = data["player_list"][id].tip;
            others[id].freezed = data["player_list"][id].freezed;
            // }
        }

        xpBar.level = others[socket.id].xpBar.level;
        levelBar.health = (data["player_list"][socket.id].experience / points_sc[data["player_list"][socket.id].level]) * 100;
        levelText.string = "level " + data["player_list"][socket.id].level;
        sides = data["player_list"][socket.id].level + 2;
        tip.sides(sides)
        tip.radius(sides * 7)
        tip.origin(- tip.inRadius + cap.width / 2 - xpBar.width / 2 - 6, 15);
        _range = sides * 30;
        _speed = sides * 30;
    })

    // *** socket ***
}

function update() {
    if (!mouse) return;

    // face decoration updates
    if(!others[socket.id].freezed)
    angle = Math.atan2(mouse.x - player.x, - (mouse.y - player.y)) * (180 / Math.PI);
    // x -= speed * Math.cos(d2r(angle));
    // y -= speed * Math.sin(d2r(angle));
    tip.rotation = angle - 180;
    eyeBall1.rotation = angle - 90 - 180 - 45;
    eyeBall2.rotation = angle - 90 - 180 - 45;
    angle2 = -(angle - 90) + 180;


    // if (nitro && fuel > 0) {
    //     fuel -= 0.5;
    //     speed = 6;
    // }
    // else {
    //     speed = 2
    // };

    // if (keys[37] || keys[65]) {
    //     x -= speed;
    // } else if (keys[39] || keys[68]) {
    //     x += speed;
    // }

    // if (keys[38] || keys[87]) {
    //     y -= speed;
    // } else if (keys[40] || keys[83]) {
    //     y += speed;
    // }

    // if (x >= world_width - player.width / 2 + 3) {
    //     x = world_width - player.width / 2 + 3;
    // } else if (x <= player.width / 2 - 3) {
    //     x = player.width / 2 - 3;
    // }

    // if (y > world_height - player.width / 2 + 3) {
    //     y = world_height - player.width / 2 + 3;
    // } else if (y <= player.width / 2 - 3) {
    //     y = player.width / 2 - 3;
    // }

    // dx = tipX + rcos(tip.inRadius + tip.circumRadius * 2 + 30 + 10, angle2);
    // dy = tipY - rsin(tip.inRadius + tip.circumRadius * 2 + 30 + 10, angle2);

    //testPoint(player.x + rcos(_range + 50, angle), player.y - rsin(_range + 50, angle))
    // if (!hasThrust) {
    //     // thrustTime += 1;

    //     // // if (span * (_range / _speed) % span != 0 && thrustTime == Math.floor(span * (_range / _speed))) {
    //     // //     tipX += rcos(_range - dist(0, 0, tipX, tipY), angle);
    //     // //     tipY += -rsin(_range - dist(0, 0, tipX, tipY), angle);
    //     // //     console.log(dist(0, 0, tipX, tipY));
    //     // // }
    //     // if (thrustTime % span == 0) {
    //     //     //console.log(dist(0, 0, tipX, tipY));
    //     // }
    //     // if (thrustTime >= span * (_range / _speed)) {
    //     //     //console.log(dist(0, 0, tipX, tipY), thrustTime)
    //     //     thrustTime = 0;
    //     //     hasThrust = true;
    //     //     tipX = 0;
    //     //     tipY = 0;
    //     //     keys[80] = 0;
    //     // } else {
    //     //     tipX = tip.x + rcos(_speed / span, angle2);
    //     //     tipY = tip.y + -rsin(_speed / span, angle2);

    //     // }

    //     tipX += 30;
    //     tipY += 30;
    //     hasThrust = true;

    // }else{
    //     tipX = 0;
    //     tipY = 0;
    // }

    tip.x = others[socket.id].tip.x;
    tip.y = others[socket.id].tip.y;

    __Mahou__.save();
    __Mahou__.translate(player.x - others[socket.id].x, player.y - others[socket.id].y);
    moved();
    drawOthers();
    drawFood();
    __Mahou__.restore();
    fixed();
    //if(!hasThrust)
    //testPoint(_canvas.width/2 + _range + player.width+ (-tip._origin.x) , _canvas.height/2 );
    if (!hasThrust && keys[80]) {
        x2 = player.x + tipX + rcos(tip.inRadius + 30 + 6, angle2);
        y2 = player.y + tipY - rsin(tip.inRadius + 30 + 6, angle2);
        testPoint(x2, y2, 'lightgreen');
        Ellipse(x2, y2, 40, 40, true);
    }
    //testPoint(player.x + dx, player.y + dy, 'lightpink');
}

function moved() {
    // #mover - draw something here you want to move with world
    for (var i = 0; i <= world_width / 20; i++) {
        __Mahou__.lineWidth = 1;
        __Mahou__.beginPath();
        __Mahou__.strokeStyle = "lightgray";
        __Mahou__.moveTo(20 * i, 0);
        __Mahou__.lineTo(20 * i, world_height);
        __Mahou__.moveTo(0, 20 * i);
        __Mahou__.lineTo(world_width, 20 * i);
        __Mahou__.stroke();
    }



    // for (var i = 0; i < statics.length; i++) {
    //     if ((statics[i].x < (x + player.x + statics[i].inRadius) && statics[i].y < (y + player.y + statics[i].inRadius)) && (statics[i].x > (x - player.x - statics[i].inRadius) && statics[i].y > (y - player.y - statics[i].inRadius))) {
    //         statics[i].draw();
    //         if (!statics[i]) continue;
    //         if (hasThrust) {
    //             statics[i].invincible = true;
    //             continue;
    //         };

    //         __Mahou__.translate(statics[i].x, statics[i].y);

    //         if (checkCollision2(statics[i].path, player.x + dx, player.y + dy)) {
    //             if (statics[i].invincible) {
    //                 statics[i].invincible = false;
    //                 switch (statics[i].sides()) {
    //                     case 3: damage = 50; break;
    //                     case 4: damage = 25; break;
    //                     case 5: damage = 6.25; break;
    //                     case 6: damage = 3.125; break;
    //                 }
    //                 if (statics[i].healthBar.visible == false) {
    //                     statics[i].healthBar.visible = true;
    //                     test = statics[i].healthBar.tween.add({ _fillOpacity: 0 }, { _fillOpacity: 1 }, 5);
    //                     test.update = closure(function () {
    //                         statics[index].healthBar.opacity(statics[index].healthBar._fillOpacity, statics[index].healthBar._fillOpacity);
    //                     }, { index: i })
    //                     statics[i].healthBar.tween.start(test);

    //                 }
    //                 statics[i].healthBar.health -= damage;
    //             }
    //         }

    //         __Mahou__.translate(-statics[i].x, -statics[i].y);

    //         if (statics[i].healthBar.health <= 0 && statics[i].alive) {
    //             statics[i].alive = false;
    //             switch (statics[i].sides()) {
    //                 case 3: experience += 0.5; break;
    //                 case 4: experience += 1; break;
    //                 case 5: experience += 2; break;
    //                 case 6: experience += 5; break;
    //             }
    //             levelBar.health = (experience / points_sc[level]) * 100;
    //             if (experience >= points_sc[level]) {
    //                 experience = experience - points_sc[level];
    //                 xpBar.level = level * 10;
    //                 level++;
    //                 socket.emit("level_inc");
    //                 levelBar.health = (experience / points_sc[level]) * 100;
    //                 availablePoints++;
    //                 levelText.string = "level " + level;
    //                 pointsText.string = "x" + availablePoints;
    //             }
    //             test = statics[i].tween.add({ _fillOpacity: statics[i]._fillOpacity, _strokeOpacity: 1, circumRadius: statics[i].circumRadius }, { _fillOpacity: 0, _strokeOpacity: 0, circumRadius: 0 }, 10,
    //                 (function (index) {
    //                     return function () {
    //                         statics.splice(index, 1);
    //                     }
    //                 })(i));

    //             test.update = closure(function () {
    //                 statics[index].radius(statics[index].circumRadius);
    //                 statics[index].healthBar.opacity(statics[index]._fillOpacity, statics[index]._fillOpacity);
    //             }, { index: i })
    //             statics[i].tween.start(test);
    //         }
    //         //Ellipse(statics[i].x,statics[i].y,40,40,true);
    //         // if (checkCollision({ x: x + dx, y: y + dy, circumRadius: tip.circumRadius }, statics[i])) {}

    //     }
    // }

    //end #mover
}

function fixed() {
    // #fixed - draw somethin here to stay fixed on screen


    for (var i = 0; i < dynamics.length; i++) {
        dynamics[i].draw();
    }

    // if (!hasThrust) {
    //     __Mahou__.fillStyle = 'black;'
    //     __Mahou__.fillRect(player.x + dx + tipX - 5, player.y + dy + tipY - 5, 10, 10)
    // }

    // end #fixed
}

function d2r(d) {
    var r = d * (Math.PI / 180);
    return r;
}

document.addEventListener("mousedown", function () {
    if (speedBar.mouseIsOver || rangeBar.mouseIsOver || movementSpeedBar.mouseIsOver) return;
    hasThrust = false;
    socket.emit("fire");
})

document.addEventListener("mouseup", function () {
    mouseIsDown = false;
})

document.addEventListener("keydown", function (e) {
    if (keys[e.keyCode]) return;
    keys[e.keyCode] = 1
    if (e.keyCode == 37 || e.keyCode == 65) {
        socket.emit("key_left", 1)
    } else if (e.keyCode == 39 || e.keyCode == 68) {
        socket.emit("key_right", 1)
    }

    if (e.keyCode == 38 || e.keyCode == 87) {
        socket.emit("key_up", 1)
    } else if (e.keyCode == 40 || e.keyCode == 83) {
        socket.emit("key_down", 1)
    }
})

document.addEventListener("keyup", function (e) {
    if (!keys[e.keyCode]) return;
    keys[e.keyCode] = 0
    if (e.keyCode == 37 || e.keyCode == 65) {
        if (keys[39] || keys[68]) {
            socket.emit("key_left", 0)
            socket.emit("key_right", 1)
        } else
            socket.emit("key_left", 0)
    } else if (e.keyCode == 39 || e.keyCode == 68) {
        if (keys[37] || keys[65]) {
            socket.emit("key_right", 0)
            socket.emit("key_left", 1)
        } else
            socket.emit("key_right", 0)
    }

    if (e.keyCode == 38 || e.keyCode == 87) {
        socket.emit("key_up", 0)
    } else if (e.keyCode == 40 || e.keyCode == 83) {
        socket.emit("key_down", 0)
    }
})

function forLoop(i, l, inc, func) {
    for (var j = i; j < l; j += inc) {
        func(j);
    }
}

function testPoint(x, y, color) {
    __Mahou__.fillStyle = color || 'red'
    __Mahou__.fillRect(x - 5, y - 5, 10, 10);
}

function rcos(r, theta) {
    return r * Math.cos(d2r(theta))
}

function rsin(r, theta) {
    return r * Math.sin(d2r(theta))
}

function log() {
    console.log(...arguments);
}

function closure(func, paramObj) {
    let names = [];
    let values = [];
    Object.getOwnPropertyNames(paramObj).forEach(
        function (val, idx, array) {
            names.push(val);
            values.push(paramObj[val]);
        }
    );
    return eval("(function (" + names.join(",") + ") {return " + func.toString() + "})(...values)");
}


function Player(data) {

    this.x = data.x;
    this.y = data.y;
    this.tip = { x: data.tip.x, y: data.tip.y, sides: 3 };
    this.target = { x: this.x, y: this.y, tip: this.tip };
    this.rotation = { target: data.angle, current: data.angle }
    this.xpBar = new circularLevelBar(data.x, data.y, 32);
    this.level = 1;

    this.modify = function () {
        this.x += (this.target.x - this.x) / 2;
        this.y += (this.target.y - this.y) / 2;

        this.tip.x += (this.target.tip.x - this.tip.x) / 2;
        this.tip.y += (this.target.tip.y - this.tip.y) / 2;

        

        this.rotation.current += (((((this.rotation.target - this.rotation.current) % 360) + 540) % 360) - 180) / 2;

        sides = this.level + 2;
        // tip.origin(- tip.inRadius + cap.width/2 - xpBar.width/2 - 6,15 );
    }
    this.draw = function () {

        this.xpBar.x = this.x;
        this.xpBar.y = this.y;
        this.xpBar.executeBluePrint();

        __Mahou__.beginPath();
        __Mahou__.arc(this.x, this.y, 20, 0, 2 * Math.PI);
        __Mahou__.closePath();
        __Mahou__.fillStyle = '#e74c3c';
        __Mahou__.fill();
        __Mahou__.lineWidth = 3;
        __Mahou__.strokeStyle = '#3d3b3b';
        __Mahou__.stroke();
        __Mahou__.fillStyle = '#fff';
        __Mahou__.strokeStyle = '#34495e';
        __Mahou__.lineWidth = 3;
        __Mahou__.strokeStyle = 'black';
        __Mahou__.beginPath();
        __Mahou__.arc(this.x - 7, this.y, 7, 0, 2 * Math.PI);
        __Mahou__.closePath();
        __Mahou__.fill();
        __Mahou__.globalAlpha = 0.5;
        __Mahou__.stroke();
        __Mahou__.globalAlpha = 1;
        __Mahou__.beginPath()
        __Mahou__.arc(this.x + 7, this.y, 7, 0, 2 * Math.PI);
        __Mahou__.closePath();
        __Mahou__.fill();
        __Mahou__.globalAlpha = 0.5;
        __Mahou__.stroke();
        __Mahou__.globalAlpha = 1;
        __Mahou__.fillStyle = '#000';
        __Mahou__.save();
        __Mahou__.translate(this.x - 7, this.y);
        __Mahou__.rotate((this.rotation.current - 180 - 90) * Math.PI / 180);
        __Mahou__.beginPath();
        __Mahou__.arc(-7 + 3, 0, 3.5, 0, 2 * Math.PI);
        __Mahou__.closePath();
        __Mahou__.fill();
        __Mahou__.restore();
        __Mahou__.save();
        __Mahou__.translate(this.x + 7, this.y);
        __Mahou__.rotate((this.rotation.current - 180 - 90) * Math.PI / 180);
        __Mahou__.beginPath();
        __Mahou__.arc(-7 + 3, 0, 3.5, 0, 2 * Math.PI);
        __Mahou__.closePath();
        __Mahou__.fill();
        __Mahou__.restore();
        __Mahou__.fillStyle = '#e74c3c';
        __Mahou__.save();
        __Mahou__.translate(this.x + this.tip.x, this.y + this.tip.y);
        __Mahou__.rotate((-Math.PI / 2) + ((this.rotation.current - 180 - 90) - 90) * Math.PI / 180);
        __Mahou__.translate(sides*7 * Math.cos(Math.PI / sides) + 34 , - (15) + 15);
        __Mahou__.beginPath();
        __Mahou__.moveTo(sides * 7, 0);
        for (var i = 1; i < sides; i++) {
            __Mahou__.lineTo(sides * 7 * Math.cos(i * (Math.PI * 2) / sides), sides * 7 * Math.sin(i * (Math.PI * 2) / sides));
        }
        __Mahou__.closePath();
        __Mahou__.fill();
        __Mahou__.stroke();
        __Mahou__.restore();




    }
}

function drawOthers() {
    for (var enemy in others) {
        others[enemy].modify();
        if (enemy != socket.id)
            others[enemy].draw();
    }
}

function drawFood() {
    for (let pellet of food) {
        __Mahou__.beginPath();
        __Mahou__.arc(pellet.x, pellet.y, pellet.radius, 0, 2 * Math.PI);
        __Mahou__.fillStyle = "#e67e22";
        __Mahou__.fill();
        __Mahou__.strokeStyle = '#34495e';
        __Mahou__.lineWidth = 3;
        __Mahou__.stroke();
    }
}
