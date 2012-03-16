#
# List of all existing popouts
#
popouts = []


#
# Return an appropriate popout name for the given request
#
name = (request) ->
  "Popout_for_YouTube_#{request.title}"


#
# Launch a popout
#
launch_popout = (request, sender) ->
  window = chrome.windows.create {
    type: 'popup'
    url:  'popout.html'
  }, (window) ->
    popouts[name request] = window.id

    chrome.tabs.sendRequest window.tabs[0].id, {
      video_id: request.video_id
      title: request.title
      time: request.time
      width: request.width
      height: request.height
      protocol: request.protocol
      current_time: request.current_time
      original_tab_id: sender.tab.id
    }


#
# Close any conflicting popouts then launch a new one
#
launch_unique_popout = (request, sender) ->
  if popouts[name request]
    try chrome.windows.remove popouts[name request], -> launch_popout(request, sender)
  else
    launch_popout(request, sender)


#
# Handle requests
#
chrome.extension.onRequest.addListener (request, sender, sendResponse) ->

  if request.action == 'launch'
    launch_unique_popout request, sender

  if request.action == 'current_time'
    chrome.tabs.sendRequest request.original_tab_id, {
      action: 'current_time'
      current_time: request.current_time
    }
