class Background

  constructor: ->
    chrome.runtime.onMessage.addListener (request, sender, sendResponse)=>
      if request.action is 'openPopout'
        new Popout request.videoId,
                   request.currentTime,
                   request.width,
                   request.height

new Background
