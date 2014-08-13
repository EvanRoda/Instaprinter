var socket = io.connect();

$('.jumbotron').hide();
$('.photos').hide();
$('.one_photo').hide();

//socket.emit('create_player_object', {parent_id: itIsYou._id, ship_type: shipType});

/*socket.on('buttons', function(data){
    world_opt = data;
    renderButtons(world_opt);
});*/

socket.on('hello', function(data){
    $('#get_button').click(function(){
        socket.emit('start');
        console.log('Получить фотки');
    });

    $('.jumbotron').show();
});

socket.on('printedFotos', function(data){
    console.log(data);
});

socket.on('photos', function(data){
    $('.jumbotron').hide();
    $('.photos').show();

    console.log(data);

    data.forEach(function(media){
        if(media.type == 'image'){
            $('#photo_list').append('<img id="' + media.id + '" class="img-thumbnail" src="'+ media.images.low_resolution.url +'" alt=""/>');
            $('#'+ media.id).click(function(){
                $('.photos').hide();
                $('.one_photo').show();
                $('#photo_wrap').append('<img class="img-thumbnail" src="'+ media.images.standard_resolution.url +'" alt=""/>');
                $('#print_photo').click(function(){
                    socket.emit('print_photo', media);
                });
            });
        }
    });

});