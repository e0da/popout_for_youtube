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

  constructor: ->
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

  constructor: (@videoId, @video)->
    button           = document.createElement('button')
    button.title     = 'Pop out'
    button.className = 'popout-for-youtube__button'
    super button
    @setClickBehavior()
    @maintainAlignment()

  setClickBehavior: ->
    @node.addEventListener 'click', (event)=>
      @video.pause()
      @openPopout()

  openPopout: ->
    chrome.runtime.sendMessage
      action:       'openPopout'
      videoId:      @videoId
      currentTime:  @video.currentTime()
      width:        @video.width()
      height:       @video.height()
    , (response)->
      console.log 'clickity clackers!'

  maintainAlignment: ->
    setInterval =>
      @setBottomLeftCorner @video.topRightCorner()
    , 100

  setBottomLeftCorner: (point)->
    @node.style.top  = "#{point.y - @height()}px"
    @node.style.left = "#{point.x}px"

class YouTubePage

  constructor: ->
    @videoId = document.querySelector('meta[itemprop=videoId]').content
    @video   = new Video
    @button  = new Button(@videoId, @video)
    document.body.appendChild @button.node

new YouTubePage
