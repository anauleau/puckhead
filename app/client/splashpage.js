var basicUrl = 'http://localhost:8080';

$(document).ready(function(){

	$('.public').click(function(e){
		e.preventDefault();
		window.location = basicUrl + '/game';
	});

	$('.private').click(function(){

	});

});