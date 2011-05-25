// Author: Justin Force <justin.force@gmail.com
// Copyright 2010 by Justin Force
// GitHub: http://github.com/sidewaysmilk/YouTube-Popout
// License: GPL http://www.gnu.org/licenses/gpl.html

jQuery.noConflict();
(function($) { $(function() {

  /* Constants/labels */
  var HTML5 = 0x0;
  var FLASH = 0x1;
  var html5Selector = 'video';
  var flashSelector = '#movie_player';

  /* The YouTube player */
  var player = null;

  /* The player type (HTML5 or Flash) */
  var type = null;

  /* Get the player */
  getPlayer();

  /* If there's no player, this page doesn't have one. Just quit. */
  if (player === null) {
    return;
  }

  /* Wait until the player is loaded and ready (the custom playerReady event is
  * triggered) to get started */
  $(window).bind('playerReady', function(e) {
    normalizePlayer();
    addButton();
  });

  /* Trigger custom event playerReady when the player is ready */
  var interval = setInterval(function() {
    if (playerReady()) {
      clearInterval(interval);
      $(window).trigger('playerReady');
    }
  }, 250);

  function getPlayer() {
    /* Default to HTML5 player, then fall back to the Flash player */
    player = $('video');
    type = HTML5;

    if (player.length === 0) {
      player = $('#movie_player');
      type = FLASH;
    }
  }

  /* Check whether there is a player state attribute or method. If there
  * is, the player has loaded and is ready to be manipulated. */
  function playerReady() {
    if (player.length === 0) {
      return false;
    } else if (type === HTML5) {
      return player.get(0).readyState;
    }
    else { /* type === FLASH */
      return player.get(0).getPlayerState;
    }
  }

  /* Set up normalized API on top of player of either type */
  function normalizePlayer() {
    var node = player.get(0);
    if (type === HTML5) {
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
    else { /* type === FLASH */
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
    /*
    * TODO
    *
    * Create and add the button. Should be inside the container that holds the
    * video so that it is aligned to the right and directly above the video.
    *
    */
    var button = $('<button>Popout</button>');
    $('body').prepend(button);

    button.click(popout);
  }

  function popout() {
    /* Pause video, note current time. */
    player.pause();
    var time = player.time();

    /* Run it back a couple seconds. If we've only been playing a few seconds,
    * start the popped out video at the beginning. */
    time = time < 10 ? 0 : time - 2;
    
    /*
    * TODO
    *
    * Create new window, copy player to it, advance to current time, and play
    * video. This requires utilizing the Chrome API messaging system.
    */
  }
}); })(jQuery);

