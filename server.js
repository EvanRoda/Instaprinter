var express = require('express');
var http = require('http');
var path = require('path');
var _ = require('lodash');
var fs = require('fs');
var gm = require('gm');

var file = null;
var request = null;


var ig = require('instagram-node').instagram();

ig.use({ client_id: 'b34087bf9c074e3b9b9cf89b8f5e9d36',
    client_secret: 'f255b2ed763d4980add72306344031cf' });

var app = express();
var server = http.createServer(app);
var sockets = [];

var io;

app.use(express.static(path.join(__dirname, 'static')));

server.listen(3000, function(){
    console.log('Express server listening on port ' + 3000);
});

io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket){
    socket.emit('hello', {});

    socket.on('getPhoto', function(){
        ig.tag_media_recent('IDwedding2014', function(err, medias, pagination, limit){
            socket.emit('photos', medias);
        });
        console.log('Получаем фотки');
    });

    socket.on('print_photo', function(media){
        console.log('Пишем в файл');

        //gm("img.png").frame(width, height, outerBevelWidth, innerBevelWidth)
        //gm("img.png").gravity('North')
        //gm("img.png").resize(null, 50)

        file = fs.createWriteStream("file.jpg");
        request = http.get(media.images.standard_resolution.url, function(response){
            //response.pipe(file);
            gm(response)
                .matteColor('white')
                .extent(640, 800)
                .frame(10, 10, 0, 0)
                .stream(function (err, stdout, stderr) {
                    stdout.pipe(file);
                });
        });

    });
});