class Video

  constructor: (@videoId, @currentTime, @width, @height)->

  openWindow: (callback)->
    chrome.windows.create
      type:   'popup'
      url:    'popout.html'
      width:  @width
      height: @height
      (window)-> callback window

class Background

  LISTENERS = [
    'openPopout'
    'getVideoIdAndCurrentTime'
  ]

  constructor: ->
    @videos = []
    @setUpListeners()

  setUpListeners: ->
    chrome.runtime.onMessage.addListener (request, sender, sendResponse)=>
      LISTENERS.forEach (listener)=>
        if request.action is listener
          @[listener] request, sender, sendResponse

  openPopout: (request, sender, sendResponse)=>
    ga 'send', 'event', 'button', 'click', 'popout button', 1
    video = new Video(
      request.videoId
      request.currentTime
      request.width
      request.height
    )

    video.openWindow (window)=> @videos[window.id] = video

  getVideoIdAndCurrentTime: (request, sender, sendResponse)=>
    video = @videos[request.windowId]
    sendResponse
      videoId:     video.videoId
      currentTime: video.currentTime

new Background
