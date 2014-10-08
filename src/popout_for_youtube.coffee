class Extension

  @openOptions: ->
    window.open chrome.extension.getURL "options.html"

  @openPopout: (video)->
    chrome.extension.sendMessage
      action:       'openPopout'
      videoId:      video.id
      currentTime:  video.currentTime()
      width:        video.width()
      height:       video.height()
      uniqueId:     @uniqueId()

  @uniqueId: ->
    Math.random() ^ new Date().getTime()

class Node

  constructor: (@node)->

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

class Video extends Node

  constructor: (@id)->
    super document.querySelector('#player video')

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

  topRightCorner: ->
    x: @offset().left + @width()
    y: @offset().top

class Button extends Node

  constructor: (@video)->
    button           = document.createElement('button')
    button.title     = 'Pop out'
    button.className = 'popout-for-youtube__button'
    super button
    @setClickBehavior()
    @setRightClickBehavior()
    @maintainAlignment()

  setClickBehavior: ->
    @node.addEventListener 'click', (event)=>
      @video.pause()
      Extension.openPopout @video

  setRightClickBehavior: ->
    @node.addEventListener 'contextmenu', (event)=>
      event.preventDefault()
      Extension.openOptions()

  maintainAlignment: ->
    setInterval =>
      @setBottomLeftCorner @video.topRightCorner()
    , 100

  setBottomLeftCorner: (point)->
    @node.style.top  = "#{point.y - @height()}px"
    @node.style.left = "#{point.x}px"

class YouTubeVideoPage

  constructor: ->

    @whenVideoChanges =>
      try @button.remove()
      @videoId = @getVideoId()
      @video   = new Video @videoId
      @button  = new Button @video
      document.body.appendChild @button.node

  whenVideoChanges: (callback)->
    setInterval =>
      callback() if @videoChanged()
    , 250

  videoChanged: ->
    @videoId != @getVideoId()

  getVideoId: ->
    try document.querySelector('meta[itemprop=videoId]').content

new YouTubeVideoPage
