class Node

  constructor: (@node)->

  offset: ->
    el = @node
    left = top = 0
    while true
      left += el.offsetLeft
      top += el.offsetTop
      break unless (el = el.offsetParent)
    left: left
    top: top

  width: ->
    parseInt @node.style.width

  height: ->
    parseInt @node.style.height

  topRightCorner: ->
    x: @offset().left + @width()
    y: @offset().top

  bottomLeftCorner: ->
    x: @offset().left
    y: @offset().top + @height()


class Video extends Node

  constructor: ->
    @video = document.querySelector('#player video')
    super @video

  pause: ->
    @video.pause()

  play: ->
    @video.play()

  currentTime: ->
    @video.currentTime

  seekTo: (time)->
    @video.currentTime = time

  togglePlayback: ->
    if @video.paused then @video.play() else @video.pause()

class Popout

  constructor: (videoId)->
    console.log videoId

class Button extends Node

  constructor: ->
    @button = document.createElement('button')
    @button.className = 'popout-for-youtube__button'
    super @button

class YouTubePage

  constructor: ->
    @videoId = yt.getConfig('VIDEO_ID')
    @video = new Video
    @button = new Button
    @appendButton()
    @keepButtonPositioned()
    @setButtonClickBehavior()
    debugger

  keepButtonPositioned: ->
    # setInterval ->
    #   @button.top
    # , 100

  appendButton: ->
    document.body.appendChild @button.button

  setButtonClickBehavior: ->
    @button.button.addEventListener (event)=>
      @video().pause()
      new Popout @videoId

window.youTubePage = new YouTubePage
