var express = require('express');
var http = require('http');
var path = require('path');
var _ = require('lodash');
var fs = require('fs');
var gm = require('gm');
var moment = require('moment');

var file = null;
var request = null;
var intId = null;


var ig = require('instagram-node').instagram();

ig.use({ client_id: 'b34087bf9c074e3b9b9cf89b8f5e9d36',
    client_secret: 'f255b2ed763d4980add72306344031cf' });

var app = express();
var server = http.createServer(app);
var forPrint = [];
var lastID = '';
var theEnd = false;
var params = {};

var io;

app.use(express.static(path.join(__dirname, 'static')));

server.listen(3000, function(){
    console.log('Express server listening on port ' + 3000);
});

io = require('socket.io').listen(server);

function createImage(photo){
    console.log('CREATE_FILE', photo);

    var created_time = moment().format('DD.MM.YY');

    gm(photo.caption.from.profile_picture)
        .resize(81, 81)
        .noProfile()
        .extent(640)
        .fill('#5e5e5e')
        .fontSize(18)
        //.font('Open Sans')
        .drawText(108, 15, photo.user.username)
        .drawText(0, 15, created_time+'', 'NorthEast')
        .write("avatar.jpg", function () {
            console.log('done1');
            gm("b28.jpg")
                .append("avatar.jpg")
                .append("b28.jpg")
                .append(photo.images.standard_resolution.url)
                .append("b28.jpg")
                .append("b27.jpg")
                .append("Instaramka.jpg")
                .append("b27.jpg")
                .append("b28.jpg")
                .matteColor('white')
                .frame(27, 0, 0, 0)
                .write("images/" + photo.id + ".jpg", function (err) {
                    console.log('done2');
                });
        });
}

io.sockets.on('connection', function(socket){
    socket.emit('hello', {});

    //todo: Протестировать переход через 20 и через 30
    socket.on('start', function(){
        intId = setInterval(function(){
            console.log('START_WATCHING');
            //IDwedding2014
            //superpupermegatest
            ig.tag_media_recent('superpupermegatest', function(err, medias, pagination, limit){

                console.log('LASTID', lastID);
                console.log('GET_MEDIA', medias.length);

                theEnd = false;
                forPrint = medias.reduce(function(array, photo){
                    theEnd = theEnd || photo.id == lastID;
                    if(!theEnd){
                        array.push(photo);
                    }
                    return array;
                }, []);

                forPrint = theEnd ? forPrint : [];

                if(forPrint.length){
                    socket.emit('printedFotos', forPrint);
                }

                console.log('FOR_PRINT', forPrint.length);

                forPrint.forEach(function(photo){
                    if(photo.type == "image"){
                        createImage(photo);
                    }
                });

                lastID = medias[0].id;
            });
        }, 5000);
    });
});