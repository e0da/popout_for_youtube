BUTTON_CLASS = 'popout-for-youtube__button'
HIDDEN_CLASS = "#{BUTTON_CLASS}--hidden"

POLLING_INTERVAL = 250

class Extension

  @openPopout: (video)=>
    chrome.extension.sendMessage
      action:       'openPopout'
      title:        video.title
      videoId:      video.id
      currentTime:  video.currentTime()
      width:        video.width()
      height:       video.height()
      uniqueId:     @uniqueId()

  @uniqueId: =>
    Math.random() ^ new Date().getTime()

  @notifyVideoViewed: =>
    chrome.extension.sendMessage action: 'videoViewed'

class Node

  offset: ->
    el = @node
    left = top = 0
    while true
      left += el.offsetLeft
      top  += el.offsetTop
      break unless (el = el.offsetParent)
    left: left
    top:  top

  width: ->
    parseInt @node.offsetWidth

  height: ->
    parseInt @node.offsetHeight

  topRightCorner: ->
    x: @offset().left + @width()
    y: @offset().top

class Video extends Node

  selectVideo = -> document.querySelector('#player video')

  constructor: (@id, @title)->
    super()
    @waitForVideoNode().then (node)=> @node = node

  pause: ->
    @node.pause()

  play: ->
    @node.play()

  currentTime: ->
    @node.currentTime

  seekTo: (time)->
    @node.currentTime = time

  togglePlayback: ->
    if @node.paused then @node.play() else @node.pause()

  waitForVideoNode: ->
    new Promise (resolve)=>
      setInterval =>
        node = selectVideo()
        resolve(node) if node
      , POLLING_INTERVAL

class Button extends Node

  constructor: (@video)->
    super()
    buttonText = chrome.i18n.getMessage('buttonText')
    @styleInterval = null
    button             = document.createElement('button')
    button.title       = buttonText
    button.className   = "#{BUTTON_CLASS} #{HIDDEN_CLASS}"
    @node = button
    @setClickBehavior()
    @maintainStyle()

  setClickBehavior: ->
    @node.addEventListener 'click', (event)=>
      @video.pause()
      Extension.openPopout @video

  setBottomLeftCorner: (point)->
    @node.style.top  = "#{point.y - @height()}px"
    @node.style.left = "#{point.x}px"

  remove: ->
    clearInterval @styleInterval
    @node.parentNode.removeChild @node

  maintainStyle: ->
    @video.waitForVideoNode().then =>
      @styleInterval = setInterval =>
        @setDisplay()
        @setBottomLeftCorner @video.topRightCorner()
      , POLLING_INTERVAL

  setDisplay: ->
    if @node.style.top == ''
      @node.classList.add HIDDEN_CLASS
    else
      @node.classList.remove HIDDEN_CLASS

class YouTubeVideoPage

  constructor: ->

    @previousVideoId = null
    @title = document.title

    @whenVideoChanges =>
      try @button.remove() # Can fail if the button isn't arleady there. Ignore.
      @previousVideoId = @newVideoId
      @newVideoId      = @getVideoId()
      @title           = document.title
      @video           = new Video @newVideoId, @title
      @button          = new Button @video

      document.body.appendChild @button.node

      Extension.notifyVideoViewed()

  whenVideoChanges: (callback)->
    setInterval =>
      callback() if @videoChanged()
    , POLLING_INTERVAL

  videoChanged: ->
    @getVideoId() != @previousVideoId

  getVideoId: ->
    new URLSearchParams(document.location.search.substring(1)).get('v')

new YouTubeVideoPage
