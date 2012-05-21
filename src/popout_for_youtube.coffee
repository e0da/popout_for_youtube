###
Author: Justin Force <justin.force@gmail.com
Copyright 2012 by Justin Force
GitHub: http://github.com/sidewaysmilk/popout_for_youtube
License: 3-clause BSD license
         http://www.w3.org/Consortium/Legal/2008/03-bsd-license.html
###


WINDOW     = $(window)                                 # cache jQuerified window
BOX        = '#watch-player, .channels-featured-video' # where we put the button
PLAY_PAUSE = '[data-default-title=Play]'               # selector for play/pause button


#
# Is it the HTML5 player or the Flash player? (In caps because it's more
# readable, and they're constant once they're set.)
#
HTML5 = false
FLASH = false


#
# the button, player node, and player type (HTML5 or FLASH), and current
# playback time, and whether the video is stopped.
#
button       = $('<button id=popout_for_youtube>Pop out')
player       = null
player_type  = null
current_time = null
stopped      = false
src          = null


#
# The button is attached to a container which holds the video to align it with
# the right edge of the video. It's positioned in the top-right corner, then
# pulled up with a negative margin to appear above the video. At various times,
# YouTube will adjust the overflow: CSS property of various container elements
# and this will hide the button. So we set overflow: visible on the parent of
# the button and its parent and so on up the chain until the button is visible.
# The list of elements can change overtime. If the button stops displaying,
# this is where you want to look.
#
fix_visibility = ->
  $([
    # Flash and WebM player
    '#watch-player'
    '#watch-video'

    # channel page
    '#branded-page-body'
    '.tab-content-body'
  ].join(',')).css {overflow: 'visible'}


#
# Get the video ID
#
video_id = ->
  id = null

  #
  # Try a few different things.
  #

  # canonical link on the page
  try id = $('link[rel=canonical]').attr('href').match(/v=([^&]+)/)[1]

  # JavaScript on the page
  try id = $('script').text().match(/"video_id": "([^"]+)"/)[1] unless id

  # URL
  try id = location.href.match(/v=([^&]+)/)[1] unless id

  id

#
# Set current playback time as floating point number
#
get_current_time = ->
  current_time = player.getCurrentTime() if FLASH
  current_time = player.currentTime if HTML5


#
# Set current playtack time to whatever the last reported current_time was
# minus a second to avoid skipping content.
#
seek = ->
  player.seekTo current_time-1 if FLASH
  player.currentTime = current_time-1 if HTML5


#
# Resume playback from a stopped state (HTML5 only). This only runs the first
# time that the click event fires per popout, so we unbind it.
#
resume = (e) ->
  $(player).add($(PLAY_PAUSE)).unbind 'click.resume', resume
  player.src = src
  player.load()


#
# Stop the video. This is more aggressive than pausing. It stops the
# downloading of the video so that when the new window opens you're not
# downloading the same video twice simultaneously.
#
# For the HTML5 player, we have to set the src to nothing then load it to stop
# streaming. We cache the src and the fact that it's stopped so we can resume
# playback later. Once it's stopped, we tell it to play the video as soon as it
# can (this will happen when we .load() it again) and we attack click handlers
# to the video object and the play/pause button so that clicking either will
# cleanly resume playback.
#
stop_video = ->
  player.stopVideo() if FLASH
  if HTML5
    player.pause()
    src = player.src unless src
    player.src = ''
    player.load()
    stopped = true

    $(player).bind 'canplaythrough', (e) ->
      $(player).unbind e
      seek()
      player.play()
   
    $(player).add($(PLAY_PAUSE)).bind 'click.resume', resume


#
# Play the video. If we've returned from a popout, the current_time will have
# changed and the video should seek to it. If the HTML5 video has been stopped,
# load it again before hitting play.
#
play_video = ->
  seek()
  player.playVideo() if FLASH
  if HTML5
    player.src = src
    player.load()
    player.play()


#
# Open a new window containing the embedded player for this video.
#
launch_popout = ->
  chrome.extension.sendRequest {
    width: $(player).outerWidth(true)
    height: $(player).outerHeight(true)
    action: 'launch'
    video_id: video_id()
    title: document.title
    protocol: window.location.protocol
    current_time: current_time
  }


#
# attach the Popout button to the video player
#
attach_button_to_player = ->
  fix_visibility()
  $(BOX).append button


#
# Attach event handlers to the button
#
attach_button_events = ->

  # shift the icon to make it look clicked
  button.mousedown -> button.css {marginTop: 1}
  button.mouseup   -> button.css {marginTop: 0}

  button.click ->
    get_current_time()
    stop_video()
    launch_popout()


#
# Determine the player node (video or embed object) and whether this is the
# HTML5 or Flash version of the player (some actions, such as stopping playback,
# work differently for each player).
#
set_player_and_type = (callback) ->

  interval = null
  video_node = null

  clear_and_callback = ->
    clearInterval interval
    player = video_node
    callback()

  # The video or embed node may not be present immediately. YouTube may create
  # it dynamically, so simply poll for the node until it appears.
  #
  interval = setInterval ->
    video_node = $('video, embed').get 0

    # On the channel page when using HTML5, the video node isn't loaded until
    # you click the player. We want it to load immediately so we can attach the
    # button, so go ahead and click it.
    #
    $('.html5-video-loader').click()

    unless video_node == undefined
      if video_node.nodeName == 'VIDEO'
        HTML5 = true
        clear_and_callback()
      else if video_node.nodeName == 'EMBED'
        FLASH  = true
        clear_and_callback()
  , 100


#
# Update current time as received from popout
#
chrome.extension.onRequest.addListener ( request, sender, send_response) ->
  if request.action == 'current_time'
    current_time = request.current_time


################################################################################
##                               document.ready
################################################################################


#
# Set everything up when the document is ready
#
$ ->
  set_player_and_type ->
    attach_button_to_player()
    attach_button_events()
