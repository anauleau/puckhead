var basicUrl = 'http://localhost:8080';
var roomUrl;

$(document).ready(function(){

	$('.public').click(function(e){
		e.preventDefault();
		window.location = basicUrl + '/public';
	});

	$('.private').click(function(e){
		e.preventDefault();
		$.ajax({
			type: 'GET',
			url: basicUrl + '/room_id',
			success: function(data){

				$('.buttons').remove();
				$('.start').append('<p class="privateUrl"><span class="sendUrl">Send this url to your friend:</span>'
					+ data
					+ '</p><button class="toRoom splashButton">Go to the room</button>');

				$('.toRoom').click(function (e) {
					e.preventDefault();
					console.log(roomUrl);
					window.location = data;
				});

			}
		})
	});

});