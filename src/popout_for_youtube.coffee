###
Author: Justin Force <justin.force@gmail.com
Copyright 2011 by Justin Force
GitHub: http://github.com/sidewaysmilk/popout-for-youtube
License: 3-clause BSD license
         http://www.w3.org/Consortium/Legal/2008/03-bsd-license.html
###

ICON_URL = chrome.extension.getURL 'images/icon29.png'
VIDEO = 'embed, video'
WINDOW = $(window)

button = $('<button id=popout_for_youtube>Pop out</button>')
          .css 'background', "url(#{ICON_URL})"

insertCSS = ->
  chrome.extension.sendRequest {getCSS: true}

video_top = ->
  $(VIDEO).offset().top

video_right = ->
  $(VIDEO).offset().left + $(VIDEO).width()

# position the button immediately and every 100ms for 1 second (in case content
# reflows)
#
# FIXME this still doesn't work for the Flash player since it doesn't bubble
#       the clicks to the window.
#
position_button = ->
  i = window.setInterval ->
    button.css {
      top:  video_top() - button.height()
      left: video_right() - button.width()
    }
  , 100

  window.setTimeout ->
    window.clearInterval i
  , 1000

attach_button = ->
  $('body').append(button)
  position_button()
  WINDOW.bind 'resize click', position_button

$ ->
  attach_button()
  console.log $('button').last()
