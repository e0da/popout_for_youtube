class Popout

  constructor: =>
    @name = chrome.i18n.getMessage("name")
    @getVideoMetadata => @setUpPlayer => @loadVideo => @loadAPI()

  loadVideo: (callback)=>
    iframe        = document.createElement('iframe')
    iframe.id     = 'player'
    iframe.title  = 'YouTube video player iframe'
    iframe.width  = '100%'
    iframe.height = '100%'
    iframe.src    = "https://www.youtube.com/embed/#{@videoId}?enablejsapi=1"

    iframe.setAttribute 'frameborder', '0'
    iframe.setAttribute 'allowfullscreen', ''

    document.body.appendChild iframe
    callback()

  loadAPI(callback): =>
    script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    firstScript = document.getElementsByTagName('script')[0]
    firstScript.parentNode.insertBefore(script, firstScript)
    callback()

  setUpPlayer: (callback)=>
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

  getVideoMetadata: (callback)=>
    chrome.windows.getCurrent @onWindow(callback)

  onWindow: (callback)=> (window)=>
    message = [
      {
        action:   'getVideoMetadata'
        windowId: window.id
      },
      @onVideoMetadata(callback)
    ]
    chrome.extension.sendMessage(...message)
  
  onVideoMetadata: (callback)=> (response)=>
    @onVideoId(response.videoId)
    @onCurrentTime(response.currentTime)
    @onTitle(response.title)
    @callback()

  onTitle: (title)=>
    @title = @windowTitle(title)
    document.title = @title

  onVideoId: (videoId)=>
    @videoId = videoId

  onCurrentTime: (currentTime)=>
    @currentTime = response.currentTime

  @windowTitle(response.title)

  windowTitle: (videoTitle)=>
    videoTitle.replace(/ - YouTube$/, '') + " - #{@name}"

new Popout
