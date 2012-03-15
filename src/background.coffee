chrome.extension.onRequest.addListener (request, sender, sendResponse) ->
  #if action == 'launch'
    #
    # TODO create window; inject iframe with YouTube API; play video;
    #      periodically report the current time back to the background page
