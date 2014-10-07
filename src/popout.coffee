class Popout

  constructor: ->
    @getVideoIdAndCurrentTime => @setUpPlayer => @loadVideo => @loadAPI()

  loadVideo: (callback)->
    iframe                 = document.createElement('iframe')
    iframe.id              = 'player'
    iframe.frameborder     = '0'
    iframe.allowfullscreen = '1'
    iframe.title           = 'YouTube video player'
    iframe.width           = '100%'
    iframe.height          = '100%'
    iframe.src             = [
      "https://www.youtube.com/embed/#{@videoId}"
      '?enablejsapi=1'
    ].join('')
    document.body.appendChild iframe
    callback()

  loadAPI: ->
    script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    firstScript = document.getElementsByTagName('script')[0]
    firstScript.parentNode.insertBefore(script, firstScript)

  setUpPlayer: (callback)->
    window.onYouTubeIframeAPIReady = =>
      @player = new YT.Player('player', {
        height:  @height
        width:   @width
        videoId: @videoId
        playerVars:
          enablejsapi: 1
        events:
          'onReady': =>
            @player.seekTo @currentTime-1
            @player.playVideo()
      })
      window.player = @player
    callback()

  getVideoIdAndCurrentTime: (callback)->
    chrome.windows.getCurrent (window)=>
      chrome.extension.sendMessage
        action:   'getVideoIdAndCurrentTime'
        windowId: window.id
        (response)=>
          @videoId     = response.videoId
          @currentTime = response.currentTime
          callback()

new Popout
