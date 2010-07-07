/**
 * Author: Justin Force <justin.force@gmail.com
*/

/*
* TODO Swap globals for a more jQuery solution. (set|clear)Timeout are
* blockers. AFAIK they eval arguments as strings, so they have to refer to
* globals. I may be wrong about this, and jQuery may have slick wrappers for
* timeouts that I haven't learned yet.
*/
var player, timeout;

function tryToEnableYouTubePopoutButton() {

	if (timeout)
		clearTimeout(timeout);
	else 
		timeout = null;

	/* Don't enable button until the player is fully initialized */
	if (!player.getPlayerState) {
		timeout = setTimeout(tryToEnableYouTubePopoutButton,500);
	}
	else {
		var img = jQuery('#YouTubePopoutButton img');
		jQuery('#YouTubePopoutButton').removeAttr('disabled').css(
			{cursor: 'pointer'
		}).mouseover(function(e) {
			img.attr('src',chrome.extension.getURL('icon29.png'));
		}).mouseout(function() {
			img.attr('src',chrome.extension.getURL('icon29disabled.png'));
		});
	}
}

function addYouTubePopoutButton() {

	/* Append a the button to the document. We'll position it with JavaScript/CSS */
	var jp = jQuery(player);
	var button = jQuery('<button disabled id=YouTubePopoutButton><img src="'+chrome.extension.getURL('icon29disabled.png')+'" width=29 height=29 alt="'+chrome.i18n.getMessage('buttonText')+'" title="'+chrome.i18n.getMessage('buttonText')+'"></button>');
	jQuery('body').append(button);

	button.css({ 'position': 'absolute' });

	/* Reposition the button when the window is resized */
	jQuery(window).resize(function(e) {
		var button = jQuery('#YouTubePopoutButton');
		var jp = jQuery('#movie_player');
		var offset = jp.offset();
		button.css({
			'top': offset.top - button.height() + 'px',
			'left': offset.left + jp.width() - button.width() + 'px',
			'zIndex': 99999
		});
	});

	jQuery(window).resize(); /* Position the button immediately */

	button.click(function() {
		player = jQuery('#movie_player')[0]; /* Have to assign player again in case video has changed */

		player.pauseVideo();

		chrome.extension.sendRequest({set: true, html: player.getVideoEmbedCode(), title: document.title});

		return false;
	});

}

jQuery.noConflict(); /* Don't clobber $ */
jQuery(document).ready(function() {
	player = jQuery('#movie_player')[0];
	if (player) {
		addYouTubePopoutButton();
		tryToEnableYouTubePopoutButton();
	}
});
