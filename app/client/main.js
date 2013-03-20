$(document).ready(function () {
	//This is the handler for clicking the submit button next to the nickname input. It emits the 'assignNickname'
	//event for the server to pick up, so that the server can set the nickname of the user.
	$('#submitName').click(function(){
		socket.emit('assignNickname', {$('#nameInput').val()});
	});
});