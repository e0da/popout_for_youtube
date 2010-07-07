// Author: Justin Force <justin.force@gmail.com
// Copyright 2010 by Justin Force
// GitHub: http://github.com/sidewaysmilk/YouTube-Popout
// License: GPL http://www.gnu.org/licenses/gpl.html

jQuery.noConflict();
(function($) {
	$(function() {

		// The movie player object
		var player = $('#movie_player');

		var buttonHTML = '<button id=YouTubePopoutButton>';
		buttonHTML += '<img width=29 height=29';
		buttonHTML += ' alt="'+chrome.i18n.getMessage('buttonText')+'"';
		buttonHTML += ' title="'+chrome.i18n.getMessage('buttonText')+'">';
		buttonHTML += '</button>'; 

		var button = $(buttonHTML).css({ position: 'absolute' });

		$('body').append(button);

		disableButton();

		// Reposition the button when the window is resized
		$(window).resize(function(e) {
			var offset = player.offset();
			button.css({
				top: offset.top - button.height(),
				left: offset.left + player.width() - button.width(),
				zIndex: 99999
			});
		});
		$(window).resize(); // Position the button immediately

		button.click(function() {

			// Assign player and re-enable button in case video has changed
			player = $('#movie_player'); 
			disableButton();
			tryToEnableButton();

			player.get(0).pauseVideo();

			// Tell background.html to open new window
			chrome.extension.sendRequest({set: true, html: player.get(0).getVideoEmbedCode(), title: document.title});

			return false;
		});

		function tryToEnableButton() {

			// timeout to recheck whether player is ready
			if (this.timeout)
				clearTimeout(this.timeout);
			else
				this.timeout = null;

			// Don't enable button until the player is fully initialized
			if (!player.get(0).getPlayerState)
				this.timeout = setTimeout(tryToEnableButton,500);
			else {
				button.removeAttr('disabled').css( {cursor: 'pointer' }).children('img').hover(function() {
					$(this).attr('src', chrome.extension.getURL('icon29.png'));
				}, function() {
					$(this).attr('src', chrome.extension.getURL('icon29disabled.png'));
				});
			}
		}
		tryToEnableButton();

		function disableButton() {
			button.attr('disabled', 'disabled').css({cursor: 'default'}).children('img').unbind('mouseenter mouseleave').attr('src', chrome.extension.getURL('icon29disabled.png'));
		}
	});
})(jQuery);

