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

insert_button = ->
  fix_visibility()
  $(BOX).append button

  # shift the icon to make it look clicked
  button.mousedown -> button.css {marginTop: 1}
  button.mouseup   -> button.css {marginTop: 0}

$ -> insert_button()
