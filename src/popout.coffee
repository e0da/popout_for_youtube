#
# current playback time (within a second)
#
current_time = null

chrome.extension.onRequest.addListener (request, sender, send_response) ->

  if request.action == 'current_time'
    send_response player.getCurrentTime()

  if request.action == 'launch'

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
      # Seek to the appropriate time and play the video when the player is
      # ready.
      #
      window.onYouTubePlayerAPIReady = ->
        player = new YT.Player 'player', {
          height: request.height
          width: request.width
          videoId: request.video_id
          enablejsapi: 1
        }
