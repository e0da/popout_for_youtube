class Extension

  DEFAULTS =
    whatsNewDismissed: false

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

  @doUnlessWhatsNewWasDismissed: (callback)->
    chrome.storage.local.get DEFAULTS, (results)->
      callback() unless !!results['whatsNewDismissed']

  @dismissWhatsNew: ->
    chrome.storage.local.set whatsNewDismissed: true

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

  maintainAlignment: ->
    setInterval =>
      @align()
    , 100

  topRightCorner: ->
    x: @offset().left + @width()
    y: @offset().top

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

class Button extends Node

  constructor: (@video, @whatsNew)->
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

  align: ->
    @setBottomLeftCorner @video.topRightCorner()

  setBottomLeftCorner: (point)->
    @node.style.top  = "#{point.y - @height()}px"
    @node.style.left = "#{point.x}px"

class WhatsNew extends Node

  constructor: (@button)->
    whatsNew = document.createElement('div')
    super whatsNew
    whatsNew.className = 'popout-for-youtube__whats-new'
    whatsNew.innerHTML = """
      <header>
        <h1>What's New</h1>
      </header>
      <p>You can access options for Popout for YouTube™ by right-clicking the icon.</p>
      <a class="dismiss" href="#">Dismiss</a>
    """
    link = whatsNew.querySelector('a')
    link.addEventListener 'click', (event)=>
      Extension.dismissWhatsNew()
      @node.remove()
      false
    @maintainAlignment()

  align: ->
    @setTopLeftCorner @button.topRightCorner()

  setTopLeftCorner: (point)->
    @node.style.top  = "#{point.y}px"
    @node.style.left = "#{point.x}px"

class YouTubeVideoPage

  constructor: ->

    @whenVideoChanges =>
      try @button.remove()
      @videoId = @getVideoId()
      @video   = new Video @videoId
      @button  = new Button @video
      document.body.appendChild @button.node

      Extension.doUnlessWhatsNewWasDismissed => @setUpToolTip()

  setUpToolTip: ->
    try @whatsNew.remove()
    @whatsNew = new WhatsNew @button
    document.body.appendChild @whatsNew.node

  whenVideoChanges: (callback)->
    setInterval =>
      callback() if @videoChanged()
    , 250

  videoChanged: ->
    @videoId != @getVideoId()

  getVideoId: ->
    try document.querySelector('meta[itemprop=videoId]').content

new YouTubeVideoPage
