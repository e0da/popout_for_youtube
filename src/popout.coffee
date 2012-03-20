#
# current playback time (within a second)
#
current_time = null


#
# Get the video details from the extension
#
chrome.extension.sendRequest {action: 'get_video'}, (response) ->


  #
  # Load the player API then set up the player and play the video
  #
  $.getScript "#{response.protocol}//www.youtube.com/player_api", ->


    #
    # Set window title and resize to fit the video
    #
    document.title = response.title
    window.resizeTo response.width, response.height

    player = null # the YouTube player


    #
    # Seek to the appropriate time and play the video when the player is ready.
    #
    window.onYouTubePlayerAPIReady = ->
      player = new YT.Player 'player', {
        height: response.height
        width: response.width
        videoId: response.video_id
        enablejsapi: 1
        events: {
          'onReady': ->
            player.seekTo response.current_time-1
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
          name: response.name
          current_time: player.getCurrentTime()
          original_tab_id: response.original_tab_id
        }
      , 1000
