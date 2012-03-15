###
Author: Justin Force <justin.force@gmail.com
Copyright 2011 by Justin Force
GitHub: http://github.com/sidewaysmilk/popout-for-youtube
License: 3-clause BSD license
         http://www.w3.org/Consortium/Legal/2008/03-bsd-license.html
###

ICON   = chrome.extension.getURL 'images/icon29.png'
VIDEO  = 'embed, video'
WINDOW = $(window)
BOX    = '#watch-player'

button = $('<button id=popout_for_youtube>Pop out</button>')
           .css {background: "url(#{ICON})"}

fix_visibility = ->
  $([
    '#watch-player'
    '#watch-video'
    '#watch-video-container'
    '#watch-container'
  ].join(',')).css {overflow: 'visible'}

video_id = -> $('[name=video_id]').val()

launch_popout = ->
  chrome.extension.sendRequest {
    action: 'launch'
    video_id: video_id()
    title: document.title
  }

insert_button = ->
  fix_visibility()
  $(BOX).append button

  # shift the icon to make it look clicked
  button.mousedown -> button.css {marginTop: 1}
  button.mouseup   -> button.css {marginTop: 0}

  #
  # TODO in addition to launching the popout, the video should be stopped (it
  #      should stop downloading) and the current time should be sent along
  #      with the launch request so it can pick up where it left of.
  #
  button.click launch_popout

$ -> insert_button()
