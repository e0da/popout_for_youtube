// Author: Justin Force <justin.force@gmail.com
// Copyright 2010 by Justin Force
// GitHub: http://github.com/sidewaysmilk/YouTube-Popout
// License: GPL http://www.gnu.org/licenses/gpl.html

jQuery.noConflict();
(function($) { $(function() {

  var selector = $('video') ? 'video' : '#movie_player';

  $(window).bind('playerReady', function(e) {
    var player = getPlayer();
    console.log(player.getPlayerState());
  });

  function getPlayer() {
    return $('#movie_player').get(0);
  }

  var checkPlayerReady = setInterval(function() {

    function trigger() {
      clearInterval(checkPlayerReady);
      $(window).trigger('playerReady');
    }

    try {
      $('video').get(0).readyState && trigger();
    } catch (e) {
      console.log(e);
    }

    try {
      $('#movie_player').get(0).getPlayerState && trigger();
    } catch(e) {
      console.log(e);
    }
    console.log('checked');
  }, 200);

}); })(jQuery);

