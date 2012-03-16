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
    popouts[name request] = [window.id, window]
    console.log window

    chrome.tabs.sendRequest window.tabs[0].id, {
      action: 'launch'
      video_id: request.video_id
      title: request.title
      time: request.time
      width: request.width
      height: request.height
      protocol: request.protocol
      original_tab_id: sender.tab.id
    }


#
# Close any conflicting popouts then launch a new one
#
launch_unique_popout = (request, sender) ->
  if popouts[name request]
    try chrome.windows.remove popouts[name request][0], -> launch_popout(request, sender)
  else
    launch_popout(request, sender)

#
# Get current time from popout
#
get_current_time = (request) ->
  current_time = null
  chrome.tabs.sendRequest popouts[name request][1].tabs[0].id, {
    action: 'current_time'
  }, (response) ->
    current_time = response.current_time


#
# Handle requests
#
chrome.extension.onRequest.addListener (request, sender, sendResponse) ->

  if request.action == 'launch'
    launch_unique_popout request, sender

  if request.action == 'current_time'
    sendResponse {
      current_time: get_current_time request
    }
