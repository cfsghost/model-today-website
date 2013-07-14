
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

	var skipCover = false;
	function switchToPhotoSlider() {
		sliderPlay();

		$('body').animate({
			scrollTop: $('#cover').outerHeight(),
		}, 1000, 'easeOutCubic');
	}

	function switchToWishboard() {
		$('body').animate({
			scrollTop: $('#cover').outerHeight() + $('#photo-slider-layer').outerHeight(),
		}, 1000, 'easeOutCubic');
	}

	function showCoverSubtitle(target, end, callback) {

		$('#cover-subtitle' + target).fadeIn(3000, function() {

			if (target == end) {
				callback();
				return;
			}

			setTimeout(function() {

				$('#cover-subtitle' + target).fadeOut(1500, function() {
					showCoverSubtitle(target + 1, end, callback);
				});
			}, 3000);
		});
	}

	showCoverSubtitle(1, 3, function() {

		if (!skipCover) {
			setTimeout(function() {
				switchToPhotoSlider();
			}, 1500);
		}
	});

	$('#cover-skipbtn').on('click', function() {
		skipCover = true;
		switchToPhotoSlider();
	});

	$('#photo-slider-skipbtn').on('click', function() {
		skipCover = true;
		switchToWishboard();
	});
	

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
	var sliderRunning = false;
	var sliderState = 'ready';

	function switchPhoto(id) {

		sliderState = 'loading';

		var $photo = $('<div>')
			.addClass('photo')
			.css({
				'position': 'absolute',
				'left': 0,
				'margin-left': 0,
				'top': 0,
				'width': '100%',
				'height': '90%'
			})
			.hide();

		var $img =  $('<img>')
			.addClass('image')
			.css({
				'margin': 'auto',
				'margin-left': 0,
				'width': '100%'
			})
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

	function sliderPlay() {

		if (sliderRunning)
			return;

		sliderRunning = true;

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
	}

	sliderPlay();

	var hideTimer = null;
	$('#photo_slider').on('mouseover mousemove', function() {
		$('#photo-slider-skipbtn').stop(true, true).fadeIn();

		clearTimeout(hideTimer);
		hideTimer = setTimeout(function() {
			$('#photo-slider-skipbtn').stop(true, true).fadeOut();
		}, 2000);
	});

});
