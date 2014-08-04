class Popout

  constructor: (@videoId, @currentTime, @width, @height)->
    @createWindow()

  createWindow: ->
    chrome.windows.create
      type: 'popup'
      url:  'popout.html'
      width: @width
      height: @height
    , (window)=>
      @window = window
      @loadPlayer()

  loadPlayer: ->
    script = document.createElement('script')
    script.src = 'https://www.youtube.com/player_api'
    script.onload = @handleScriptLoad
    document.body.appendChild script

  # FIXME bad name?
  @handleScriptLoad: =>
    debugger
    @window.onYouTubePlayerAPIReady = ->
      @player = new YT.Player 'player', {
        height: @height
        width: @width
        videoId: @videoId
        enablejsapi: 1
        events: {
          'onReady': =>
            @player.seekTo @currentTime-1
            @player.play()
        }
      }
