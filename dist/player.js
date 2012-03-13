/*jslint browser: true */
/*global $, chrome, YT */

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {

  // Set the title
  document.title = request.title;

  // Set the window size to match the video size
  window.resizeTo(request.width, request.height);

  // Load the YouTube Player API
  $.getScript('http://www.youtube.com/player_api', function() {

    var player;

    function seekAndPlay(e) {
      player.seekTo(request.time);
      player.playVideo();
    }

    window.onYouTubePlayerAPIReady = function () {
      player = new YT.Player('player', {
        height: request.height,
        width: request.width,
        videoId: request.id,
        enablejsapi: 1,
        events: {
          'onReady': seekAndPlay
        }
      });
    };
  });
});
