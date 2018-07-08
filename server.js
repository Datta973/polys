var express = require('express');
var app = express();
var http = require('http').Server(app);

app.use(express.static("src"))

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/src/index.html');
});

http.listen(process.env.PORT || 8080)