
// Example
App.require('WishBoard', function() {
	var wishBoard = App.Engine('WishBoard');

	function escapeHTML(msg) {
		return msg
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;")
			.replace(/\n/g, '<br>');
	}

	function appendMessage(msg) {

		var d = new Date(msg.created);

		var $wish = $('<div>').addClass('post').hide();
		var $header = $('<div>');
		var $name = $('<span>').addClass('name').text(msg.name);
		var $created = $('<span>').addClass('created').text(d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds());
		var $message = $('<div>').addClass('message').html(escapeHTML(msg.msg));

		$header.append($name).append($created);
		$wish.append($header).append($message);

		$('#wishboard_messages').append($wish);

		return $wish;
	}

	function prependMessage(msg) {

		var d = new Date(msg.created);

		var $wish = $('<div>').addClass('post').hide();
		var $header = $('<div>');
		var $name = $('<span>').addClass('name').text(msg.name);
		var $created = $('<span>').addClass('created').text(d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds());
		var $message = $('<div>').addClass('message').html(escapeHTML(msg.msg));

		$header.append($name).append($created);
		$wish.append($header).append($message);

		$('#wishboard_messages').prepend($wish);

		return $wish;
	}

	$('#submitMsg').on('click', function() {
		if ($('#name').val() == '' || $('#message').val() == '') {
			return;
		}

		wishBoard.wish({
			name: $('#name').val(),
			msg: $('#message').val()
		}, function(err, msg) {

			if (err)
				return;

			var $wish = prependMessage(msg);

			$('body').animate({
				scrollTop: 780
			}, function() {

				$wish.fadeIn();
			});

			wishBoard.messageCount(function(err, num) {
				$('#wishboard_count').text(num + ' fans have left a message for Pei');
			});
		});

		$('#name').val('');
		$('#message').val('');
	});

	wishBoard.getWishMsg(0, 50, function(err, msgs) {

		for (var index in msgs) {
			var msg = msgs[index];

			var $wish = appendMessage(msg);
			$wish.show();
		}
	});

	wishBoard.messageCount(function(err, num) {

		$('#wishboard_count').text(num + ' fans have left a message for Pei');
	});
});

$(function() {

	var photoURLs = [
		'IMG_0171.jpg',
		'IMG_1175.jpg',
		'IMG_1795.jpg',
		'IMG_2865.jpg',
		'IMG_3028.jpg',
		'IMG_3045.jpg',
		'IMG_3110.jpg',
		'IMG_3202.jpg',
		'IMG_5926.jpg'
	];

	var $curPhoto = null;
	var sliderState = 'ready';

	function switchPhoto(id) {

		sliderState = 'loading';

		var $photo = $('<div>')
			.addClass('span10 photo')
			.css({
				'position': 'absolute',
				'left': 0,
				'margin-left': 75,
				'top': 0
			})
			.hide();

		var $img =  $('<img>')
			.addClass('image')
			.attr('src', '/img/photo/' + photoURLs[id])
			.on('load', function() {

				sliderState = 'ready';

				if ($curPhoto) {
					$curPhoto.fadeOut(2000);
				}

				$photo.fadeIn(3000, function() {

					// Release old photo
					if ($curPhoto) {
						$curPhoto.remove();
					}
					
					$curPhoto = $photo;
				});
			});

		$photo.append($img);

		$('#photo_slider').append($photo);
	}

	var current = 1;
	switchPhoto(0);
	setInterval(function() {
		if (sliderState != 'ready')
			return;

		if (current == photoURLs.length)
			current = 0;

		switchPhoto(current);

		current++;
	}, 10000);

});
