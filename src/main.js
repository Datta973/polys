var x, y,
    x2 = 0,
    y2 = 0,
    speed = 2, // max speed
    friction = 0.98 // friction


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

let points_sc = [0, 1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 68, 93, 120];
let _inums = ["polys-polyserver.a3c1.starter-us-west-1.openshiftapps.com","mani-mani.193b.starter-ca-central-1.openshiftapps.com", "polys.herokuapp.com","manikantaserver.herokuapp.com"]
// let _inums = ["localhost:8000"]
let s_capacity = [10,10,5,5];
let sockets = [];

let test;
let sides = 3;

let dx = 0, dy = 0;
let rgb;

let food = [];



let colors = ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#f1c40f", "#e67e22", "#e74c3c", "#ecf0f1"];

const world_width = 3072;
const world_height = 3072;

let connectedToServer = false;
let mobileDevice = false;

// let V = SAT.Vector;
// let P = SAT.Polygon;
let polys = {};
let manager;
let username = " ";
let levelTextWidth = 21;
let levelBarHeight = 18;
let fontFamily = "cursive"
let textWidth = 2;

let participants = [];
let i_pings = [];
let socket;

// socket dependencies

// for (let i = 0; i < _inums.length; i++) {
//     if (i == _inums.length - 1) {
//         ping(_inums[i], function (ms) {
//             i_pings[i] = ms;
//             setSocket();
//         })
//     } else {
//         ping(_inums[i], function (ms) {
//             i_pings[i] = ms;
//         })
//     }
// }


s_iterate(0);

function s_iterate(i) {
    if (i == _inums.length - 1) {
        getPCount(_inums[i], function (pcount) {
            if (pcount <= s_capacity[i]) {
                // console.log(_inums[i],"was selected as last server pcount:",pcount)
                setSocket(sockets[i]);
            }else{
                alert("Sorry :( all servers are busy")
            }
        })
    } else {
        // ping(_inums[i], function (ms) {
        //     i_pings[i] = ms;
        // })
        getPCount(_inums[i], function (pcount) {
            if (pcount <= s_capacity[i]) {
                // console.log(_inums[i],"was selected pcount:",pcount)
                setSocket(sockets[i]);
            }else{
                s_iterate(i + 1);
            }
        })
        
    }
}

setTimeout(function () {
    if (socket != undefined) return;
    console.log("retrying")
    s_iterate(0);
}, 5000)


// let socket = io.connect("https://polys.herokuapp.com");
// end socket dependencies


window.mobilecheck = function () {
    var check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

HTMLElement.prototype.append = function (html) {
    let elem = document.createElement("div");
    this.appendChild(elem);
    elem.outerHTML = html;
}

byId("name").focus();

window.onresize = function () {
    _canvas.width = window.innerWidth;
    _canvas.height = window.innerHeight;
    player.x = _canvas.width / 2;
    player.y = _canvas.height / 2;
}

function setup() {
    canvas("game_canvas");
    _canvas.width = window.innerWidth;
    _canvas.height = window.innerHeight;
    frameRate = 100;
    glow = loadSpriteSheet("images/glow_b.png")
}

function create() {



    if (!mobilecheck()) {



        _canvas.addEventListener("mousedown", function () {
            // if (!this.webkitIsFullScreen) {
            //     _canvas.webkitRequestFullScreen();
            //     _canvas.height = window.screen.height;
            // }
            // if (speedBar.mouseIsOver || rangeBar.mouseIsOver || movementSpeedBar.mouseIsOver) return;
            hasThrust = false;
            socket.emit("fire");
        })

        _canvas.addEventListener("mouseup", function () {
            mouseIsDown = false;
        })

        document.addEventListener("keydown", function (e) {
            if (e.keyCode == 32) {
                if (nitro) return
                nitro = true;
            }
        })

        document.addEventListener("keyup", function (e) {
            if (e.keyCode == 32) {
                nitro = false;
            }
        })

    } else {
        $("#namefield").css("top", "10%")
        $("#name").click(function () {
            document.body.webkitRequestFullScreen();
        })
        // window.screen.orientation.lock("landscape")

        // locOrientation = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation || screen.orientation.lock;
        // locOrientation('landscape');

        // try{
        //     alert(JSON.stringify(screen.orientation.lock("landscape")) )
        // }catch(ex){
        //     alert(ex);
        // }

        document.getElementById("nitro").style.display = 'block';
        document.getElementById("fire").style.display = 'block';

        mobileDevice = true;
        var options = {
            zone: document.getElementById('zone_joystick'),
            color: '#2ecc71',
            mode: 'static',
            position: { left: '15%', bottom: '22%' },
            size: 100,
        };
        _canvas.style.position = 'absolute';
        manager = nipplejs.create(options);
        manager.on("move", function (evt, data) {
            if (hasThrust)
                angle = -(data.angle.degree - 90) //- 180;
        })
        levelTextWidth = 25;
        levelBarHeight = 30;
        textWidth = 1;
        fontFamily = "Helvetica"
        // document.addEventListener("mousedown", function () {
        //     if (!this.webkitIsFullScreen) {
        //         document.getElementById("screen").webkitRequestFullScreen();
        //         _canvas.width = window.screen.width * window.devicePixelRatio;
        //         _canvas.height = window.screen.height * window.devicePixelRatio;
        //     }
        // })

        document.getElementById("nitro").addEventListener("touchstart", function () {

            // if (speedBar.mouseIsOver || rangeBar.mouseIsOver || movementSpeedBar.mouseIsOver) return;
            nitro = true;
        });
        document.getElementById("nitro").addEventListener("touchend", function () {
            // if (speedBar.mouseIsOver || rangeBar.mouseIsOver || movementSpeedBar.mouseIsOver) return;
            nitro = false;
        });
        document.getElementById("fire").addEventListener("touchstart", function () {
            // if (speedBar.mouseIsOver || rangeBar.mouseIsOver || movementSpeedBar.mouseIsOver) return;
            socket.emit("fire");
        });
        // _canvas.addEventListener("touchmove", handleMove);
        // _canvas.addEventListener("touchend", handleEnd);
        // _canvas.addEventListener("touchcancel", handleCancel);
    }


    player = new rectangle(_canvas.width / 2, _canvas.height / 2, 50, 7);
    cap = new ellipse(0, 0, 32, 32);
    cap.gradient = cap.shadow = true;
    eye1 = new ellipse(-7, 0, 7, 7);
    eye2 = new ellipse(7, 0, 7, 7);
    eyeBall1 = new ellipse(0, 0, 3, 3);
    eyeBall2 = new ellipse(0, 0, 3, 3);
    tip = new polygon(0, 0, _size, 3);
    tipX = tip.x;
    tipY = tip.y;

    healthBar = new percentageBar(0, 27, 50, 3.5);
    xpBar = new circularLevelBar(player.x, player.y, 32);



    levelBar = new percentageBar(153, 18, 300, levelBarHeight, 2);
    levelBar.fillStyle("#dcdde1")

    levelText = new Text("level " + level, -20, -5, levelTextWidth);
    levelText.family = (levelTextWidth > 21) ? 'helvetica' : 'cursive';
    levelText.fontBorderColor = '#000';
    levelText.fillStyle("transparent");
    levelText.strokeStyle("transparent");
    levelText.fontBorder = true;
    levelText.bold = true;


    levelBar.primaryColor("#686de0");
    levelBar.secondaryColor("transparent");



    levelBar.health = 0;



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
    // cap.strokeStyle("#3d3b3b");
    cap.strokeStyle("transparent");
    player.strokeStyle("#3d3b3b");
    player.fillStyle("#16a085");
    cap.fillStyle("#27ae60");
    tip.fillStyle("#e74c3c");
    cap.opacity(1, 1)
    player.opacity(0, 0);
    //tip.opacity(0,1)
    player.circumRadius = cap.circumRadius;
    //stage.addChild(xpBar);
    eye1.addChild(eyeBall1);
    eye2.addChild(eyeBall2);
    cap.addChild(eye1);
    cap.addChild(eye2);
    player.addChild(cap);
    player.addChild(tip);
    //player.addChild(healthBar);
    levelBar.addChild(levelText)
    stage.addChild(player);


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



    // end of event handlers
    x = 50;
    y = 50;
    __Mahou__.font = '20px tahoma';




}

function setSocket(soc) {
    $("#namelabel").animate({ opacity: 0 }, function () {
        $("#namelabel").text("Your name ?")
        $("#namelabel").animate({ opacity: 1 })
    })


    $("#name").attr("placeholder", "")
    $("#name").removeAttr("disabled")
    $("#name").focus()

    // *** socket ***

    // socket = io(_inums[i_pings.indexOf(Math.min(...i_pings))])
    socket = soc
    // socket = io("localhost:8000")

    others = {};

    socket.on('update_data', function (data) {
        connectedToServer = true;

        food = data["food_data"];

        for (var id in others) {

            if (data["player_list"][id] == undefined || !data["player_list"][id].alive) {
                delete others[id];
                byId(id).parentElement.remove();
            }
        }
        for (var id in data["player_list"]) {

            // if (id != socket.id) {
            if (!others[id]) {
                if (!data["player_list"][id].alive) continue;
                others[id] = new Player(data["player_list"][id]);
                $("#scoreboard").append(`
                 <div class="row">
                 <div class="name">${data["player_list"][id].username}</div><div id=${id} class="score">0</div>
                 </div>
                 `)
                //byId("scoreboard").append("<li data-score=0 ><div class='displayname'  >" + data["player_list"][id].username + "</div>" + " - " + "<font id='" + id + "' ></font></li>")
            }
            else {
                time = 0;
                others[id].previous.x = others[id].target.x;
                others[id].previous.y = others[id].target.y;
                others[id].target.x = data["player_list"][id].x;
                others[id].target.y = data["player_list"][id].y;
                // others[id].time = 1;
                others[id].xpBar.level = (data["player_list"][id].level - 1) * 10;
                others[id].level = data["player_list"][id].level;
                others[id].rotation.target = data["player_list"][id].angle;
                others[id].target.tip = data["player_list"][id].tip;
                others[id].freezed = data["player_list"][id].freezed;
                others[id].username = data["player_list"][id].username;
                others[id].invincible = data["player_list"][id].invincible;
                others[id].score = Math.round(data["player_list"][id].experience * 1000);
                others[id].cool_counter = data["player_list"][id].cool_counter;
                //byId(id).parentElement.setAttribute('data-score', others[id].score);
                participants.push({ id: id, score: others[id].score, name: others[id].username })
                //$("#" + id).text(others[id].score);
            }
            // }
        }


        if (others[socket.id]) {
            xpBar.level = others[socket.id].xpBar.level;
            levelBar.health = ((data["player_list"][socket.id].experience - points_sc[data["player_list"][socket.id].level - 1]) / (points_sc[data["player_list"][socket.id].level] - points_sc[data["player_list"][socket.id].level - 1])) * 100;
            levelText.string = "level " + data["player_list"][socket.id].level;
            sides = data["player_list"][socket.id].level + 2;
            tip.sides(sides)
            tip.radius(sides * 4)
            tip.origin(- tip.inRadius - (cap.width / 4) - 3, 15);
        }

        // $("#scoreboard").children().sort(function (a, b) {
        //     return parseInt(a.dataset.score) < parseInt(b.dataset.score);
        // }).appendTo("#scoreboard")



        participants.sort(function (a, b) {
            return b.score - a.score;
        })

        participants.splice(10, participants.length - 10);

        $("#scoreboard").empty();

        for (let participant of participants) {
            $("#scoreboard").append(`
                 <div class="row">
                 <div class="name">${participant.name}</div><div id="${participant.id}" class="score">${participant.score}</div>
                 </div>
             `)
        }
        $("#" + socket.id).parent().css("background", "rgb(41, 128, 185)")

        participants = [];

        socket.emit('update_data', { angle: angle, nitro: nitro });
    })

    socket.on("death", function () {
        $("#namelabel").text("Oops You Died");
        byId("name").focus();
        byId("blackscreen").classList.remove("hidden");
        // socket.emit("start_game", { clientWidth: _canvas.width, clientHeight: _canvas.height, username: username })
    })

    // *** socket ***
}

// setInterval(function () {
//     let elements = []
//     let container = document.querySelector('#scoreboard')
//     // Add each row to the array
//     container.querySelectorAll('.row').forEach(el => elements.push(el))
//     // Clear the container
//     container.innerHTML = ''
//     // Sort the array from highest to lowest
//     elements.sort((a, b) => b.querySelector('.score').textContent - a.querySelector('.score').textContent)
//     // Put the elements back into the container
//     elements.forEach(e => container.appendChild(e))
// }, 500)

function update() {
    if (!connectedToServer) {
        __Mahou__.fillText("connecting to server...", _canvas.width / 2, _canvas.height / 2);
        return;
    };

    if (!others[socket.id]) {
        return;
    }

    if (!others[socket.id].freezed && !mobileDevice)
        angle = Math.atan2(mouse.x - player.x, - (mouse.y - player.y)) * (180 / Math.PI);

    //console.log(others[socket.id].target.x, others[socket.id].x, others[socket.id].time)

    tip.rotation = angle;
    eyeBall1.rotation = angle - 90 - 45;
    eyeBall2.rotation = angle - 90 - 45;
    angle2 = -(angle - 90);

    tip.x = others[socket.id].tip.x;
    tip.y = others[socket.id].tip.y;

    tip.opacity(1 - others[socket.id].cool_counter / (5 * others[socket.id].level), 1)

    cap.opacity(others[socket.id].opa, 1)
    //xpBar.strokeColor = others[socket.id].color;
    xpBar.strokeColor = "transparent"
    __Mahou__.save();
    __Mahou__.translate(player.x - others[socket.id].x, player.y - others[socket.id].y);
    moved();
    drawOthers();
    drawFood();

    // for (var id in polys) {
    //     __Mahou__.beginPath();
    //     __Mahou__.moveTo(polys[id].points[0].x, polys[id].points[0].y);
    //     for (var i = 1; i < polys[id].points.length; i++) {
    //         __Mahou__.lineTo(polys[id].points[i].x, polys[id].points[i].y)
    //     }
    //     __Mahou__.fillStyle = 'black';
    //     __Mahou__.fill();
    //     if(id!= socket.id){
    //         if(SAT.testPolygonPolygon(polys[socket.id], polys[id])){
    //             alert("game over")
    //         }
    //     }
    // }

    __Mahou__.restore();
    fixed();

}

function moved() {
    // #mover - draw something here you want to move with world
    // for (var i = 0; i <= world_width / 20; i++) {
    //     __Mahou__.lineWidth = 1;
    //     __Mahou__.beginPath();
    //     __Mahou__.strokeStyle = "lightgray";
    //     __Mahou__.moveTo(20 * i, 0);
    //     __Mahou__.lineTo(20 * i, world_height);
    //     __Mahou__.moveTo(0, 20 * i);
    //     __Mahou__.lineTo(world_width, 20 * i);
    //     __Mahou__.stroke();
    // }
    __Mahou__.fillStyle = back;
    __Mahou__.rect(0, 0, world_width, world_height);
    __Mahou__.fill();

    //end #mover
}

function fixed() {
    // #fixed - draw somethin here to stay fixed on screen


    for (var i = 0; i < dynamics.length; i++) {
        dynamics[i].draw();
    }


    __Mahou__.fillStyle = 'white';
    __Mahou__.strokeStyle = 'black';
    __Mahou__.lineWidth = textWidth;
    __Mahou__.font = "bold 25px " + fontFamily;
    __Mahou__.fillText(others[socket.id].username.substring(0, 15), _canvas.width / 2 - 32, _canvas.height / 2 - 45);
    __Mahou__.strokeText(others[socket.id].username.substring(0, 15), _canvas.width / 2 - 32, _canvas.height / 2 - 45)


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



function ping(host, pong) {
    var soc = io(host);
    let started = new Date().getTime();
    soc.emit("s_ping");
    soc.on("s_pong", function () {

        let ended = new Date().getTime();
        // console.log("pong")
        if (pong != null) {
            pong(ended - started);
        }
    })

}

function getPCount(host, callback) {
    var soc =  io(host);
    // console.log("sock")
    sockets.push(soc);
    soc.emit("p_count");
    soc.on("p_count", function (data) {
        if (callback != null) {
            callback(data);
        }
    })
}



// document.addEventListener("keyup", function (e) {
//     if (!keys[e.keyCode]) return;
//     keys[e.keyCode] = 0
//     if (e.keyCode == 37 || e.keyCode == 65) {
//         if (keys[39] || keys[68]) {
//             socket.emit("key_left", 0)
//             socket.emit("key_right", 1)
//         } else
//             socket.emit("key_left", 0)
//     } else if (e.keyCode == 39 || e.keyCode == 68) {
//         if (keys[37] || keys[65]) {
//             socket.emit("key_right", 0)
//             socket.emit("key_left", 1)
//         } else
//             socket.emit("key_right", 0)
//     }

//     if (e.keyCode == 38 || e.keyCode == 87) {
//         socket.emit("key_up", 0)
//     } else if (e.keyCode == 40 || e.keyCode == 83) {
//         socket.emit("key_down", 0)
//     }
// })

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
    this.previous = { x: this.x, y: this.y };
    this.rotation = { target: data.angle, current: data.angle }
    this.xpBar = new circularLevelBar(data.x, data.y, 32);
    this.level = 1;
    this.list = {};
    this.opa = 1;
    this.opaDir = -1;
    this.color = '#3dbdbd';
    this.color = '#fff';
    this.invincible = true;
    this.time = 1;
    this.username = "";
    this.cool_counter = 1;
    this.modify = function () {

        sides = this.level + 2;

        this.x += (this.target.x - this.x) / 4;
        this.y += (this.target.y - this.y) / 4;

        // this.x = this.previous.x + ((this.target.x - this.previous.x) / 2 * this.time)
        // this.y = this.previous.y + ((this.target.y - this.previous.y) / 2 * this.time)


        this.tip.x += (this.target.tip.x - this.tip.x) / 4;
        this.tip.y += (this.target.tip.y - this.tip.y) / 4;


        this.rotation.current += (((((this.rotation.target - this.rotation.current) % 360) + 540) % 360) - 180) / 2;


        if (this.invincible) {
            this.opa < 0 ? this.opaDir = 1 : this.opa >= 1 ? this.opaDir = -1 : 0; this.opa += this.opaDir * 0.1; this.color = "rgba(61,59,59," + this.opa + ")";
        } else {
            this.color = '#3d3b3b';
            this.color = '#fff';
            this.opa = 1;
        }



    }
    this.draw = function () {
        this.xpBar.x = this.x;
        this.xpBar.y = this.y;
        this.xpBar.strokeColor = this.color;
        // this.xpBar.executeBluePrint();


        var radgrad = __Mahou__.createRadialGradient(this.x, this.y, 0, this.x, this.y, 32);
        radgrad.addColorStop(0, 'rgba(255, 56, 46,' + this.opa + ')');
        // radgrad.addColorStop(0.8, 'rgba(192, 57, 43,1)');
        radgrad.addColorStop(1, 'rgba(160, 57, 43,1)');
        __Mahou__.beginPath();
        __Mahou__.arc(this.x, this.y, 32, 0, 2 * Math.PI);
        __Mahou__.closePath();
        // __Mahou__.fillStyle = '#e74c3c';
        __Mahou__.shadowBlur = 20;
        __Mahou__.shadowColor = "#000";
        __Mahou__.fillStyle = radgrad;
        __Mahou__.fill();
        __Mahou__.shadowColor = "transparent";
        __Mahou__.lineWidth = 3;
        __Mahou__.strokeStyle = this.color //'#3d3b3b';

        //this.color = 'green'
        //__Mahou__.stroke();
        __Mahou__.fillStyle = '#fff';
        // __Mahou__.strokeStyle = '#34495e';
        __Mahou__.strokeStyle = '#fff';
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
        __Mahou__.translate(sides * 4 * Math.cos(Math.PI / sides) + 34, 0);
        __Mahou__.beginPath();
        __Mahou__.moveTo(sides * 4, 0);
        for (var i = 1; i < sides; i++) {
            __Mahou__.lineTo(sides * 4 * Math.cos(i * (Math.PI * 2) / sides), sides * 4 * Math.sin(i * (Math.PI * 2) / sides));
        }
        __Mahou__.closePath();
        __Mahou__.fill();
        __Mahou__.stroke();
        __Mahou__.restore();

        __Mahou__.fillStyle = 'white';
        __Mahou__.strokeStyle = 'black';
        __Mahou__.lineWidth = '1.5';
        __Mahou__.font = "bold 25px " + fontFamily;
        __Mahou__.fillText(this.username.substring(0, 10), this.x - 32, this.y - 45);
        __Mahou__.strokeText(this.username.substring(0, 10), this.x - 32, this.y - 45);

    }
}

function drawOthers() {
    for (var enemy in others) {
        others[enemy].modify();
        if (enemy != socket.id)
            others[enemy].draw();
        // else
        //     console.log(others[enemy].previous.x,others[enemy].target.x,others[enemy].x,others[enemy].time)
        //console.log(others[enemy].target.x,others[enemy].previous.x)//,others[enemy].x)
    }
}


function drawFood() {
    __Mahou__.globalCompositeOperation = "lighter";



    for (let pellet of food) {
        __Mahou__.beginPath();
        var radgrad = __Mahou__.createRadialGradient(pellet.x, pellet.y, 0, pellet.x, pellet.y, pellet.radius);
        radgrad.addColorStop(0, 'rgba(41,128,185,1)');
        radgrad.addColorStop(0.8, 'rgba(41,128,185,.5)');
        radgrad.addColorStop(1, 'rgba(41,128,185,0)');
        // __Mahou__.fillStyle = "#2980b9";
        __Mahou__.fillStyle = radgrad;

        __Mahou__.arc(pellet.x, pellet.y, pellet.radius, 0, 2 * Math.PI);
        __Mahou__.globalAlpha = 1;
        __Mahou__.fill();
        __Mahou__.globalAlpha = 1;
        __Mahou__.globalCompositeOperation = "lighter";
        __Mahou__.drawImage(glow, pellet.x - 32 * (pellet.radius / 10), pellet.y - 32 * (pellet.radius / 10), 64 * (pellet.radius / 10), 64 * (pellet.radius / 10));


        __Mahou__.strokeStyle = "#000"//'#34495e';
        __Mahou__.lineWidth = 3;
        //__Mahou__.stroke();
    }
}

function byId(id) {
    return document.getElementById(id);
}

function byTag(tagName) {
    return document.getElementsByTagName(tagName);
}

function byClass(className) {
    return document.getElementsByClassName(className);
}

function onInput(e) {
    if (e.keyCode == 13) {
        username = byId("name").value;
        byId("blackscreen").classList.add("hidden");
        byId("name").blur();
        socket.emit("start_game", { clientWidth: _canvas.width, clientHeight: _canvas.height, username: username })
    }
}
