class Extension

  @version: ->
    "v#{chrome.runtime.getManifest().version}"

  @reportVersion: ->
    @trackEvent 'Background', 'version', @version()

  @reportButtonClick: ->
    @trackEvent 'YouTubeVideoPage', 'popoutButtonClick'

  @trackEvent: (category, action, value)->
    # _gaq.push(['_trackEvent', 'Videos', 'Play', 'Gone With the Wind']);
    # https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide
    value = "#{value}" unless value is undefined # Make it a string or leave it undefined
    _gaq.push ['_trackEvent', category, action, value]

  @reportVideoViewed: ->
    @trackEvent 'YouTubeVideoPage', 'videoViewed'

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
    'getVideoIdAndCurrentTime'
    'openPopout'
    'videoViewed'
  ]

  constructor: ->
    @videos = []
    @setUpListeners()
    Extension.reportVersion()

  setUpListeners: ->
    chrome.runtime.onMessage.addListener (request, sender, sendResponse)=>
      LISTENERS.forEach (listener)=>
        if request.action is listener
          @[listener] request, sender, sendResponse

  openPopout: (request, sender, sendResponse)=>
    Extension.reportButtonClick()
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

  videoViewed: (request, sender, sendResponse)=>
    Extension.reportVideoViewed()

new Background
