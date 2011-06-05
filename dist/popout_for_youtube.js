/*
* Author: Justin Force <justin.force@gmail.com
* Copyright 2011 by Justin Force
* GitHub: http://github.com/sidewaysmilk/popout-for-youtube
* License: 3-clause BSD license
*          http://www.w3.org/Consortium/Legal/2008/03-bsd-license.html
*/

jQuery.noConflict();
(function($) { $(function() {

  // Constants/labels
  var HTML5 = 0x0;
  var FLASH = 0x1;
  var html5Selector = 'video';
  var flashSelector = '#movie_player';
  var iconUrl = chrome.extension.getURL('icon29.png');
  var text = chrome.i18n.getMessage('buttonText');

  var css = {
    textIndent: '-999em',
    width: 29,
    height: 29,
    background: 'url(' + iconUrl + ')',
    position: 'absolute',
    right: 0,
    top: -30,
    zIndex: 99, // so that it doesn't get covered by ads, etc.
    cursor: 'pointer'
  };

  // The YouTube player
  var player = null;

  // The YouTube video ID
  var id = null;

  // The player type (HTML5 or Flash)
  var type = null;

  // The parent of the button (where we append it). Varies between players. By
  // choosing a good parent, we can get the button to automatically align to
  // the right edge of the player.
  var buttonParent = null;

  // Get the player
  getPlayer();

  // If there's no player, this page doesn't have one. Just quit.
  if (player === null) {
    return;
  }

  // Wait until the player is loaded and ready (the custom playerReady event is
  // triggered) to get started
  $(window).bind('playerReady', function(e) {
    normalize();
    addButton();
  });

  // Trigger custom event playerReady when the player is ready
  var interval = setInterval(function() {
    if (playerReady()) {
      clearInterval(interval);
      $(window).trigger('playerReady');
    }
  }, 250);

  function getPlayer() {
    // Default to HTML5 player, then fall back to the Flash player
    player = $('video');
    type = HTML5;
    id = document.URL.match(/\?.*v=([^\&]+)/)[1]; // pull ID from URL

    if (player.length === 0) {
      player = $('#movie_player');
      type = FLASH;
    }
  }

  // Check whether there is a player state attribute or method. If there is,
  // the player has loaded and is ready to be manipulated.
  function playerReady() {
    if (player.length === 0) {
      return false;
    } else if (type === HTML5) {
      return player.get(0).readyState;
    }
    else { // type === FLASH
      return player.get(0).getPlayerState;
    }
  }

  // Normalize the environment for all player types
  function normalize() {
    var node = player.get(0);
    if (type === HTML5) {

      buttonParent = player.parent().parent().parent();

      player.state = function() {
        return node.readyState;
      }
      player.time = function() {
        return node.currentTime;
      }
      player.pause = function() {
        return node.pause();
      }
      player.play = function() {
        return node.play();
      }
      player.seek = function(time) {
        return node.currentTime = time;
      }
    }
    else { // type === FLASH

      buttonParent = player.parent();

      player.pause = function() {
        return node.pauseVideo();
      }
      player.play = function() {
        return node.playVideo();
      }
      player.state = function() {
        return node.getPlayerState();
      }
      player.seek = function(time) {
        return node.seekTo(time, true);
      }
      player.time = function() {
        return node.getCurrentTime();
      }
    }
  }

  function addButton() {

    // Create the button and append it to the previously defined buttonParent,
    // then fade it in all classy-like.
    var button = $('<button>').text(text).css(css).attr('title', text);
    buttonParent.append(button);
    button.hide().fadeIn();

    button.click(popout);

    // Because full screen in the HTML5 player just expands the video to fill
    // the whole screen, we need to set the player's z-Index to be higher than
    // the button's so that the button doesn't appear on top of the full screen
    // video.
    if (type == HTML5) {
      player.css({zIndex: 100});
      console.log(player.css('z-index'));
    }

  }

  function popout() {

    // Pause video, note current time and dimensions
    player.pause();
    var time = player.time();
    var width = player.outerWidth(true);
    var height = player.outerHeight(true);


    // Run it back a couple seconds. If we've only been playing a few seconds,
    // start the popped out video at the beginning.
    time = time < 10 ? 0 : time - 3;

    // Tell background.html to create new window containing video with current
    // time and dimentions.
    chrome.extension.sendRequest({id: id, title: document.title, time: time, width: width, height: height});
  }
}); })(jQuery);

