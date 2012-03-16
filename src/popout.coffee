#
# current playback time (within a second)
#
current_time = null

chrome.extension.onRequest.addListener (request, sender, send_response) ->

  #
  # Set window title and resize to fit the video
  #
  document.title = request.title
  window.resizeTo request.width, request.height

  #
  # Load the player API then set up the player and play the video
  #
  $.getScript "#{request.protocol}//www.youtube.com/player_api", ->

    player = null # the YouTube player


    #
    # Seek to the appropriate time and play the video when the player is ready.
    #
    window.onYouTubePlayerAPIReady = ->
      player = new YT.Player 'player', {
        height: request.height
        width: request.width
        videoId: request.video_id
        enablejsapi: 1
        events: {
          'onReady': ->
            player.seekTo request.current_time-1
            player.playVideo()
        }
      }


    #
    # Report the current playback time to the background so we can keep the
    # original page up to date
    #
    window.setInterval ->
      chrome.extension.sendRequest {
        action: 'current_time'
        name: request.name
        current_time: player.getCurrentTime()
        original_tab_id: request.original_tab_id
      }
    , 1000
