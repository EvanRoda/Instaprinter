var express = require('express');
var http = require('http');
var path = require('path');
var _ = require('lodash');
var fs = require('fs');
var gm = require('gm');

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
//var photos = [];
var params = {};

var io;

app.use(express.static(path.join(__dirname, 'static')));

server.listen(3000, function(){
    console.log('Express server listening on port ' + 3000);
});

io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket){
    socket.emit('hello', {});

    //todo: Протестировать переход через 20 и через 30
    socket.on('start', function(){
        intId = setInterval(function(){
            console.log('START_WATCHING');
            //IDwedding2014
            //superpupermegatest
            ig.tag_media_recent('superpupermegatest', function(err, medias, pagination, limit){
                //photos = medias;

                console.log('LASTID', lastID);
                //console.log('PAGINATION', pagination);

                /*if(pagination.next_max_id){
                    params = {max_id: pagination.next_max_id};
                }*/
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

                //forPrint = photos.slice(0, newCount - count);

                console.log('FOR_PRINT', forPrint.length);

                forPrint.forEach(function(photo){
                    if(photo.type == "image"){

                        console.log('CREATE_FILE', photo);

                        photo.file = fs.createWriteStream(photo.id + ".jpg");
                        request = http.get(photo.images.standard_resolution.url, function(response){
                            gm(response)
                                .matteColor('white')
                                .extent(640, 790)
                                .frame(10, 100, 0, 0)
                                .stream(function (err, stdout, stderr) {
                                    stdout.pipe(photo.file);
                                });
                        });
                    }
                });

                lastID = medias[0].id;
                /*photos.forEach(function(photo){
                    console.log(photo.id);
                });*/
            });
        }, 5000);
    });
});