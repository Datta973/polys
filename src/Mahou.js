/*
Name : MahouJs
Author : M.Vageswara Datta
Date : 29/04/2018
*/

console.log('%c \u2605\u2605\u2605 MahouJs \u2605\u2605\u2605 ', 'background: #e74c3c; color:white ');

let _canvas;
let __Mahou__;
let frameRate = 60;
let updateInterval;
let stage;
let mouse = { x: 0, y: 0 };
let resources = { "images": [] };
let eventQueue = {
    "click": [],
    "mouseover": [],
    "mouseout": [],
    "mousedown": [],
    "mouseup": [],
    "keyup": [],
    "keydown": []
};

let keyEvents = {
    "key_up": false,
    "key_down": false,
    "key_left": false,
    "key_right": false
}

let statics = [], dynamics = [];
Array.prototype.remove = function (id) {
    this.splice(this.indexOf(id), 1);
}

// let backgroundImage = loadSpriteSheet("images/blackback_1.png");
let backgroundImage = loadSpriteSheet("images/PSA.png");
let back;




document.onreadystatechange = () => {
    try {
        if (document.readyState === 'interactive') {
            setup();
        }
        if (document.readyState === 'complete') {
            create();
            //updateInterval = setInterval(loop, 1000 / frameRate);
            loop();
        }
    } catch (ex) {

    }
};

class Stage {
    constructor(x, y) {
        this.children = [];
        this.x = x;
        this.y = y;
        this._absPos = { x: 0, y: 0 };
        this.addChild = function (childNode) {
            childNode._index = this.children.length;
            childNode._parent = this;
            this.children.push(childNode);
            if (childNode._parent.constructor.name != "Stage") return;
            if (childNode.type == 'static') {
                statics.push(childNode);
            } else {
                dynamics.push(childNode);
            }
        };
        this.removeChild = function (childNode) {
            childNode._parent = undefined;
            this.children.splice(this.children.indexOf(childNode), 1);
        };
        this.forEach = function (caller) {
            for (var i = 0; i < this.children.length; i++) {
                caller(this.children[i]);
            }
        }
        this.eventList = {};


        this.on = function (eventName, eventHandler) {
            this.eventList[eventName] = eventHandler;
            eventQueue[eventName].push(this);
        }

        this.off = function (eventName) {
            eventQueue[eventName].splice(eventQueue[eventName].indexOf(this), 1);
        }
        this.trigger = function (eventName, event) {
            if (this.eventList[eventName])
                this.eventList[eventName](event);
        }
    }
}

class MahouObject extends Stage {
    constructor(x, y, w, h) {
        super(x, y);

        let tweens = [];

        this.width = w;
        this.height = h;
        this.rotation = 0;
        this._index = null;
        this.visible = true;
        this._fillOpacity = 1;
        this._strokeOpacity = 1;
        this.colors = { fill: "#000000", stroke: "#000000" };
        this._origin = { x: this.width / 2, y: this.height / 2 };
        this.border = true;
        this.borderWidth = 1;
        this._parent = null;
        this.circumRadius = null;
        this.index = function () {
            if (arguments.length > 0) {
                this._index = arguments[0];
                this._parent.children.sort(function (a, b) {
                    return a._index - b._index;
                })
                return;
            }
            return this._index;
        }
        this.strokeStyle = function () {
            if (arguments[0]) {
                this.colors.stroke = colorToString(...arguments);
                return;
            }
            return this.colors.stroke;
        }
        this.fillStyle = function () {
            if (arguments[0]) {
                this.colors.fill = colorToString(...arguments);
                return;
            }
            return this.colors.fill;
        }
        this._stroke = function (path) {
            __Mahou__.lineWidth = this.borderWidth;
            this.colors.stroke = colorConversion(this.colors.stroke);
            if (this.colors.stroke.substring(0, 4) != 'rgba') {
                let rgb = hexToRgb(this.colors.stroke);
                __Mahou__.strokeStyle = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + this._strokeOpacity + ")";
            } else {
                __Mahou__.strokeStyle = this.colors.stroke;
            }
            if (path)
                __Mahou__.stroke(path);
            else
                __Mahou__.stroke();
        };
        this.opacity = function () {
            if (arguments.length > 0 && arguments.length < 3) {
                this._fillOpacity = arguments[0];
                if (arguments[1] == undefined) return;
                this._strokeOpacity = arguments[1];

                return;
            } else {
                return [this._fillOpacity, this._strokeOpacity];
            }

        }
        this.origin = function () {
            if (arguments.length == 2) {
                this._origin.x = arguments[0];
                this._origin.y = arguments[1];
                return;
            }
            return this._origin;
        };
        this.parent = function () {
            return this._parent;
        }
        this.absPos = function () {
            let obj = { x: 0, y: 0 };
            try {
                obj = this._parent.absPos();
            } catch (ex) {
            }
            return { x: obj.x + this.x, y: obj.y + this.y };
        };
        this.draw = function () {
            this._absPos.x = this._parent._absPos.x + this.x;
            this._absPos.y = this._parent._absPos.y + this.y;
            this.rotation %= 360;
            if (!this.visible) this.opacity(0, 0);
            __Mahou__.fillStyle = this.colors.fill;
            if (this.isBeingDragged) {
                this.x = mouse.x - this.mouse.x;
                this.y = mouse.y - this.mouse.y;
            }



            this.colors.fill = colorConversion(this.colors.fill);

            if (this.colors.fill.substring(0, 4) != 'rgba') {
                let rgb = hexToRgb(this.colors.fill);
                __Mahou__.fillStyle = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + this._fillOpacity + ")";
            } else {
                __Mahou__.fillStyle = this.colors.fill;
            }

            if (this.rotation != 0) {
                this.rotate();
            } else {
                this.executeBluePrint();
            }

            if (this.border) {
                this._stroke();
            }
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].draw();
            }

            for (var i = 0; i < tweens.length; i++) {
                if (tweens[i].counter != -1) {
                    tweens[i].counter += 1;
                    for (var item in tweens[i]["from"]) {
                        this[item] += (tweens[i]["to"][item] - tweens[i]["from"][item]) / tweens[i].time;
                        //log(Number.parseFloat(this[item]).toPrecision(1), tweens[i].counter, (tweens[i]["to"][item] - tweens[i]["from"][item]) / tweens[i].time)
                    }
                    tweens[i].update ? tweens[i].update() : 0;
                    if (tweens[i].counter == tweens[i].time) {
                        for (var item in tweens[i]["from"]) {
                            this[item] = tweens[i]["to"][item];
                        }
                        tweens[i].callback ? tweens[i].callback() : 0;
                        tweens[i].counter = -1;
                    }
                }
            }

        };
        this.mouse = {};
        this.mouseIsOver = false;
        this.mouseIsOut = true;
        this.isBeingDragged = false;
        this.drag = function () {
            this.isBeingDragged = true;
            this.mouse.x = mouse.x - this.x;
            this.mouse.y = mouse.y - this.y;
        }
        this.drop = function () {
            this.isBeingDragged = false;
        }
        this.toggleDrag = function () {
            if (this.isBeingDragged) {
                this.drop();
            } else {
                this.drag();
            }
        }
        this.tween = {
            add: function (obj1, obj2, time, callback) {
                var obj = {
                    time: time,
                    counter: -1,
                    from: obj1,
                    to: obj2,
                    callback: callback,
                };
                tweens.push(obj);
                return obj;
            },
            getTween: function (id) {
                tweens[tweens.indexOf(id)];
            },
            remove: function (id) {
                tweens.splice(tweens.indexOf(id), 1);
            },
            start: function (id) {
                tweens[tweens.indexOf(id)].counter = 0;
            },
            onUpdate: function (id, callback) {
                this.getTween(id).update = callback;
            },

        }
        this.remove = function (array, callback) {
            array.splice(array.indexOf(this));
            callback();
        }
    }
}

class Sprite extends MahouObject {
    constructor(img, x, y, w, h, fr) {
        super(x, y, w, h);

        let frameCount = -1;
        let startFrame, endFrame, loop = false, isPlaying = false, isPaused = false;
        let frameWidth, frameHeight;
        let _image = img;
        let r = img.r, c = img.c;
        frameWidth = _image.width / c; frameHeight = _image.height / r;
        this.border = false;
        this.frame = 0;
        this.frames = r * c;
        this.frameRate = fr || frameRate;

        this.image = function () {
            if (arguments[0]) {
                _image = arguments[0];
                return;
            }
            return _image;
        }
        this.play = function () {

            if (arguments.length == 2 || arguments.length == 3) {
                startFrame = arguments[0];
                if (!isPaused) this.frame = startFrame;
                endFrame = arguments[1];
                loop = arguments[2] || false;
                isPlaying = true;
                isPaused = false;
                return;
            }
            loop = arguments[0] || false;
            startFrame = 0;
            if (!isPaused) this.frame = startFrame;
            endFrame = this.frames - 1;
            isPlaying = true;
            isPaused = false;
        }
        this.pause = function () {
            isPlaying = false;
            isPaused = true;
        }
        this.stop = function () {
            isPlaying = false;
            isPaused = false;
            if (arguments[0]) {
                this.frame = endFrame;
                return;
            }
            this.frame = 0;

        }

        this.executeBluePrint = function () {
            frameCount = ++frameCount % (frameRate / this.frameRate);
            __Mahou__.drawImage(_image, (this.frame % c) * frameWidth, Math.floor(this.frame / c) * frameHeight, frameWidth, frameHeight, this._absPos.x - this._origin.x, this._absPos.y - this._origin.y, this.width, this.height);
            __Mahou__.beginPath();
            __Mahou__.rect(this._absPos.x - this._origin.x, this._absPos.y - this._origin.y, this.width, this.height);
            __Mahou__.closePath();
            if (mouse) {
                this.mouseIsOver = __Mahou__.isPointInPath(mouse.x, mouse.y) || __Mahou__.isPointInStroke(mouse.x, mouse.y);
            }
            if (!frameCount && isPlaying) {
                if (!((this.frame + 1) % (endFrame + 1)) && !loop) return;
                this.frame = ++this.frame % (endFrame + 1) + startFrame * Math.floor(this.frame / (endFrame + 1));
            }
        }
        this.rotate = function () {
            frameCount = ++frameCount % (frameRate / this.frameRate);
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].rotation = this.rotation;
            }
            __Mahou__.save();
            __Mahou__.translate(this._absPos.x, this._absPos.y);
            __Mahou__.rotate(this.rotation * Math.PI / 180);
            __Mahou__.drawImage(_image, (this.frame % c) * frameWidth, Math.floor(this.frame / c) * frameHeight, frameWidth, frameHeight, -this._origin.x, -this._origin.y, this.width, this.height);
            __Mahou__.beginPath();
            __Mahou__.rect(-this._origin.x, -this._origin.y, this.width, this.height);
            __Mahou__.closePath();
            if (mouse) {
                this.mouseIsOver = __Mahou__.isPointInPath(mouse.x, mouse.y) || __Mahou__.isPointInStroke(mouse.x, mouse.y);
            }
            __Mahou__.restore();
            if (!frameCount && isPlaying) {
                if (!((this.frame + 1) % (endFrame + 1)) && !loop) return;
                this.frame = ++this.frame % (endFrame + 1) + startFrame * Math.floor(this.frame / (endFrame + 1));
            }
        }
    }
}

class rectangle extends MahouObject {
    constructor(x, y, w, h) {
        super(x, y, w, h);
        this.executeBluePrint = function () {
            __Mahou__.beginPath();
            __Mahou__.rect(this._absPos.x - this._origin.x, this._absPos.y - this._origin.y, this.width, this.height);
            __Mahou__.closePath();
            __Mahou__.fill();
            if (mouse) {
                this.mouseIsOver = __Mahou__.isPointInPath(mouse.x, mouse.y) || __Mahou__.isPointInStroke(mouse.x, mouse.y);
            }
        }
        this.rotate = function () {
            __Mahou__.save();
            __Mahou__.translate(this._absPos.x, this._absPos.y);
            __Mahou__.rotate(this.rotation * Math.PI / 180);
            __Mahou__.beginPath();
            __Mahou__.rect(-this._origin.x, -this._origin.y, this.width, this.height);
            __Mahou__.closePath();
            __Mahou__.fill();
            if (mouse) {
                this.mouseIsOver = __Mahou__.isPointInPath(mouse.x, mouse.y) || __Mahou__.isPointInStroke(mouse.x, mouse.y);
            }
            __Mahou__.restore();
        }
    }
}

class ellipse extends MahouObject {
    constructor(x, y, w, h) {
        var radgrad;
        super(x, y, 2 * w, 2 * h);
        this.portion = 1;
        this.circumRadius = w > h ? w : h;
        this.gradient = false;
        this.shadow = false;
        this.executeBluePrint = function () {

            __Mahou__.beginPath();
            __Mahou__.ellipse(this._absPos.x - this._origin.x + this.width / 2, this._absPos.y - this._origin.y + this.height / 2, this.width / 2, this.height / 2, 0 * Math.PI / 180, 0, this.portion * 2 * Math.PI);
            __Mahou__.closePath();
            if (this.gradient) {
                radgrad = __Mahou__.createRadialGradient(this._absPos.x, this._absPos.y, 0, this._absPos.x, this._absPos.y, 32);
                radgrad.addColorStop(0, 'rgba(39, 255, 96,' + this._fillOpacity + ')');
                radgrad.addColorStop(1, 'rgba(42, 100, 105,' + this._fillOpacity + ')');
                // radgrad.addColorStop(1, 'rgba(46, 255, 113,1)');
                __Mahou__.fillStyle = radgrad;
            }
            if (this.shadow) {
                __Mahou__.shadowBlur = 20;
                __Mahou__.shadowColor = "#000";
            }
            __Mahou__.fill();
            __Mahou__.shadowColor = "transparent";
            if (mouse) {
                this.mouseIsOver = __Mahou__.isPointInPath(mouse.x, mouse.y) || __Mahou__.isPointInStroke(mouse.x, mouse.y);
            }
        }
        this.rotate = function () {
            __Mahou__.save();
            __Mahou__.translate(this._absPos.x, this._absPos.y);
            __Mahou__.rotate(this.rotation * Math.PI / 180);
            __Mahou__.beginPath();
            __Mahou__.ellipse(-this._origin.x + this.width / 2, -this._origin.y + this.height / 2, this.width / 2, this.height / 2, 0 * Math.PI / 180, 0, this.portion * 2 * Math.PI);
            __Mahou__.closePath();
            __Mahou__.fill();
            if (mouse) {
                this.mouseIsOver = __Mahou__.isPointInPath(mouse.x, mouse.y) || __Mahou__.isPointInStroke(mouse.x, mouse.y);
            }
            __Mahou__.restore();
        }
    }
}

class polygon extends MahouObject {
    constructor(x, y, r, n) {
        super(x, y, 2 * r, 2 * r);
        var theta = (Math.PI * 2) / n;
        this.path = new Path2D();
        this.circumRadius = r;
        this._sides = n;
        this.inRadius = r * Math.cos(Math.PI / n);
        this.sideLength = Math.round(2 * r * Math.sin(Math.PI / n));
        this.invincible - false;
        this.alive = true;
        // start blue print
        this.path.moveTo(r, 0);
        for (var i = 1; i < n; i++) {
            this.path.lineTo(r * Math.cos(i * theta), r * Math.sin(i * theta));
        }
        this.path.closePath();
        // end blue print

        this.executeBluePrint = function () {
            __Mahou__.save();
            __Mahou__.translate(this._absPos.x, this._absPos.y);
            __Mahou__.rotate((-Math.PI / 2) + this.rotation * Math.PI / 180);
            __Mahou__.translate(- this._origin.x + this.width / 2, - this._origin.y + this.height / 2);
            __Mahou__.beginPath();
            __Mahou__.fill(this.path);
            this._stroke(this.path);
            __Mahou__.restore();
        }
        this.rotate = function () {
            __Mahou__.save();
            __Mahou__.translate(this._absPos.x, this._absPos.y);
            __Mahou__.rotate((-Math.PI / 2) + this.rotation * Math.PI / 180);
            __Mahou__.translate(- this._origin.x + this.width / 2, - this._origin.y + this.height / 2);
            __Mahou__.beginPath();
            __Mahou__.fill(this.path);
            this._stroke(this.path);
            __Mahou__.restore();
        }
        this.sides = function () {
            if (!arguments[0]) return this._sides;
            var s = arguments[0];
            this._sides = s;
            this.path = new Path2D();
            this.path.moveTo(r, 0);
            theta = (Math.PI * 2) / s;
            for (var i = 1; i < s; i++) {
                this.path.lineTo(r * Math.cos(i * theta), r * Math.sin(i * theta));
            }
            this.path.closePath();
            this.inRadius = r * Math.cos(Math.PI / s);
            this.sideLength = Math.round(2 * r * Math.sin(Math.PI / s));
        }
        this.radius = function () {
            if (!arguments[0]) return this.width / 2;
            var rad = arguments[0];
            this.circumRadius = rad;
            this.path = new Path2D();
            this.path.moveTo(rad, 0);
            theta = (Math.PI * 2) / this._sides;
            for (var i = 1; i < this._sides; i++) {
                this.path.lineTo(rad * Math.cos(i * theta), rad * Math.sin(i * theta));
            }
            this.path.closePath();
            this.inRadius = rad * Math.cos(Math.PI / this._sides);
            this.sideLength = Math.round(2 * rad * Math.sin(Math.PI / this._sides));
        }

    }
}

class percentageBar extends MahouObject {
    constructor(x, y, width, height, bw) {
        super(x, y, width, height)
        this.health = 100;
        var health = new rectangle(0, 0, width - bw, height - bw);
        var damage = new rectangle(0, 0, width - bw, height - bw);
        health.fillStyle("#4cd137");
        damage.fillStyle("#e84118");

        health.border = false;
        damage.border = false;
        this.colors.fill = "transparent";
        this.addChild(damage);
        this.addChild(health);
        this.borderWidth = bw;
        this.executeBluePrint = function () {

            health.width = this.health < 0 ? 0 : this.health / 100 * (width - bw);
            __Mahou__.beginPath();
            __Mahou__.rect(this._absPos.x - this._origin.x, this._absPos.y - this._origin.y, this.width, this.height);
            __Mahou__.closePath();
            __Mahou__.fill();
            if (mouse) {
                this.mouseIsOver = __Mahou__.isPointInPath(mouse.x, mouse.y) || __Mahou__.isPointInStroke(mouse.x, mouse.y);
            }
        }
        this.rotate = function () {
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].rotation = this.rotation;
            }
            __Mahou__.save();
            __Mahou__.translate(this._absPos.x, this._absPos.y);
            __Mahou__.rotate(this.rotation * Math.PI / 180);
            __Mahou__.beginPath();
            __Mahou__.rect(-this._origin.x, -this._origin.y, this.width, this.height);
            __Mahou__.closePath();
            __Mahou__.fill();
            if (mouse) {
                this.mouseIsOver = __Mahou__.isPointInPath(mouse.x, mouse.y) || __Mahou__.isPointInStroke(mouse.x, mouse.y);
            }
            __Mahou__.restore();
        }
        this.primaryColor = function (color) {
            health.fillStyle(color);

        }
        this.secondaryColor = function (color) {
            damage.fillStyle(color);
        }
        this.opacity = function (f, s) {
            this._fillOpacity = health._fillOpacity = damage._fillOpacity = f;
            this._strokeOpacity = health._strokeOpacity = damage._strokeOpacity = s;
        }

    }
}

class circularLevelBar extends MahouObject {
    constructor(x, y, radius) {
        super(x, y, 2 * radius, 2 * radius)
        this.level = 0;
        // this.strokeColor = "#3d3b3b";
        this.strokeColor = "#fff";
        this._stroke = function () { }
        this.executeBluePrint = function () {

            __Mahou__.beginPath();
            __Mahou__.arc(this.x, this.y, radius, 0, 2 * Math.PI);
            __Mahou__.closePath();
            __Mahou__.lineWidth = 2.5;
            __Mahou__.strokeStyle = this.strokeColor;
            __Mahou__.stroke();
            __Mahou__.beginPath();
            __Mahou__.arc(this.x, this.y, radius - 1, 0, 2 * Math.PI);
            __Mahou__.closePath();
            __Mahou__.save();
            __Mahou__.clip();
            __Mahou__.fillStyle = "#3498db";
            __Mahou__.fillRect(this.x - radius, this.y + radius - (this.level * radius * 2) / 100, 100, 100);
            __Mahou__.restore();
        }
        this.rotate = function () { }
    }
}

class Text extends MahouObject {
    constructor(string, x, y, s) {
        super(x, y)
        let w, size = s || 20, rgb = {};
        this.string = string;
        this.size = function () {
            if (arguments.length == 1) {
                size = arguments[0];
                __Mahou__.font = size + "px " + this.family;
                w = __Mahou__.measureText(string).width;
                this.width = w + this.padding * 2;
                this.height = size + this.padding * 2;
                this.origin(0, this.height)
            }
            else
                return size;
        }
        this.padding = 0;
        this.family = 'tahoma';
        __Mahou__.font = size + "px " + this.family;
        w = __Mahou__.measureText(string).width;
        this.width = w + this.padding * 2;
        this.height = size + this.padding * 2;
        this.fontColor = '#fff';
        this.bold = false;
        this.fontBorderWidth = 1.1;
        this.fontBorderColor = '#000';
        this.fontBorder = false;
        this.origin(0, 0);
        this.executeBluePrint = function () {

            this.height = size + this.padding * 2;
            if (this.bold)
                __Mahou__.font = "bold " + size + "px " + this.family;
            else
                __Mahou__.font = size + "px " + this.family;
            w = __Mahou__.measureText(this.string).width;
            this.width = w + this.padding * 2;
            __Mahou__.beginPath();
            __Mahou__.rect(this._absPos.x, this._absPos.y - 3 - this.padding, this.width, this.height);
            __Mahou__.closePath();
            if (this.colors.fill.substring(0, 4) != 'rgba')
                this.changeColor(this.colors.fill);
            __Mahou__.fill();
            this.changeColor(this.fontColor)
            __Mahou__.fillText(this.string, this._absPos.x + this.padding, this._absPos.y + size / 2 + 2);
            if (!this.fontBorder) return
            rgb = hexToRgb(colorConversion(this.fontBorderColor));
            __Mahou__.lineWidth = this.fontBorderWidth;
            __Mahou__.strokeStyle = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + this._fillOpacity + ")";
            __Mahou__.strokeText(this.string, this._absPos.x + this.padding, this._absPos.y + size / 2 + 2);
        }
        this.rotate = {}
        this.changeColor = function (color) {
            rgb = hexToRgb(colorConversion(color));
            __Mahou__.fillStyle = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + this._fillOpacity + ")";
        }
    }
}

function canvas(id) {
    _canvas = document.getElementById(id);
    __Mahou__ = _canvas.getContext("2d");
    __Mahou__.width = parseInt(document.getElementById(id).getAttribute("width"));
    __Mahou__.height = parseInt(document.getElementById(id).getAttribute("height"));

    backgroundImage.onload = function () {
        back = __Mahou__.createPattern(backgroundImage, "repeat");
    }


    _canvas.addEventListener("mousemove", function (e) {
        mouse = windowToCanvas(e.clientX, e.clientY);
    })
    _canvas.addEventListener("click", function (e) {
        eventQueue["click"].forEach(function (childNode) {
            if (childNode.mouseIsOver)
                childNode.trigger("click", e)
        })
    })
    _canvas.addEventListener("mousedown", function (e) {
        eventQueue["mousedown"].forEach(function (childNode) {
            if (childNode.mouseIsOver)
                childNode.trigger("mousedown", e)
        })
    })
    _canvas.addEventListener("mouseup", function (e) {
        eventQueue["mouseup"].forEach(function (childNode) {
            if (childNode.mouseIsOver)
                childNode.trigger("mouseup", e)
        })
    })
    _canvas.addEventListener("mousemove", function (e) {

        eventQueue["mouseover"].forEach(function (childNode) {
            if (childNode.mouseIsOver && childNode.mouseIsOut) {
                childNode.mouseIsOut = false;
                childNode.trigger("mouseover", e)
            }
        })
        eventQueue["mouseout"].forEach(function (childNode) {
            if (!childNode.mouseIsOver && !childNode.mouseIsOut) {
                childNode.mouseIsOut = true;
                childNode.trigger("mouseout", e)
            }
        })
    })
    document.addEventListener("keyup", function (e) {
        eventQueue["keyup"].forEach(function (childNode) {
            childNode.trigger("keyup", e)
        })

        switch (e.keyCode) {
            case 37: keyEvents["key_left"] = false; break;
            case 38: keyEvents["key_up"] = false; break;
            case 39: keyEvents["key_right"] = false; break;
            case 40: keyEvents["key_down"] = false; break;
            default: break;
        }
    })
    document.addEventListener("keydown", function (e) {
        eventQueue["keydown"].forEach(function (childNode) {
            childNode.trigger("keydown", e)
        })

        switch (e.keyCode) {
            case 37: keyEvents["key_left"] = true; break;
            case 38: keyEvents["key_up"] = true; break;
            case 39: keyEvents["key_right"] = true; break;
            case 40: keyEvents["key_down"] = true; break;
            default: break;
        }
    })
    stage = new Stage(0, 0);
}

function fillStyle() {
    style("fillStyle", arguments);
}

function strokeStyle() {
    style("strokeStyle", arguments)
}

function style(styleType) {
    if (arguments[1][1]) {
        __Mahou__[styleType] = "rgb(" + arguments[1][0] + "," + arguments[1][1] + "," + arguments[1][2] + ")";
        return __Mahou__[styleType];
    }
    __Mahou__[styleType] = arguments[1][0];
    return __Mahou__[styleType];
}



function background() {
    fillStyle(...arguments);
    __Mahou__.fillRect(0, 0, _canvas.width, _canvas.height);
}

// conversion functions 

function colorToString() {
    if (arguments[2]) {
        return "rgb(" + arguments[0] + "," + arguments[1] + "," + arguments[2] + ")";
    }
    return arguments[0];
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function windowToCanvas(x, y) {
    return {
        x: x - _canvas.offsetTop,
        y: y - _canvas.offsetLeft
    };
}

// end of conversion functions

function random() {
    if (arguments.length == 0) {
        return Math.random();
    } else if (arguments.length == 1) {
        return Math.floor(Math.random() * arguments[0]);
    } else {
        return Math.floor(Math.random() * (arguments[1] - arguments[0])) + arguments[0];
    }
}

function dist() {
    var a, b;
    if (arguments.length == 4) {
        a = arguments[0] - arguments[2];
        b = arguments[1] - arguments[3];
        return Math.sqrt(a * a + b * b);
    }
    a = arguments[0].x - arguments[1].x;
    b = arguments[0].y - arguments[1].y;
    return Math.sqrt(a * a + b * b);
}

function checkCollision() {
    var p;
    var d = dist(...arguments);
    var r1, r2;
    var x1, x2, x3, x4;
    if (arguments.length == 2) {
        x1 = arguments[0].x;
        y1 = arguments[0].y;
        x2 = arguments[1].x;
        y2 = arguments[1].y;
        r1 = arguments[0].circumRadius;
        r2 = arguments[1].circumRadius;
    }
    else if (arguments.length == 6) {
        x1 = arguments[0];
        y1 = arguments[1];
        x2 = arguments[3];
        y2 = arguments[4];
        r1 = arguments[2];
        r2 = arguments[5];
    }
    if (d < r1 + r2) {
        return true;
    }
    return false;
}

function cursor() {
    if (arguments[0]) {
        document.body.style.cursor = arguments[0];
        return;
    }
    return document.body.style.cursor;
}

function loop() {
    background("#2c3e50");
    update();
    requestAnimationFrame(loop);
}



function loadSpriteSheet(src, r, c) {
    let image = new Image();
    image.id = "img" + resources.images.length;
    image.src = src;
    image.r = r;
    image.c = c;
    resources.images.push(image);
    return image;
}

function Ellipse(x, y, w, h, stroke, fill) {
    __Mahou__.beginPath();
    __Mahou__.ellipse(x, y, w / 2, h / 2, 0 * Math.PI / 180, 0, 2 * Math.PI);
    __Mahou__.closePath();
    if (stroke) __Mahou__.stroke();
    if (fill) __Mahou__.fill();
}

function checkCollision2(path, x, y) {
    return __Mahou__.isPointInPath(path, x, y) || __Mahou__.isPointInStroke(path, x, y);
}

function colorConversion(str) {
    __Mahou__.fillStyle = str;
    return __Mahou__.fillStyle;
}
