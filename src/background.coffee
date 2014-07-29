#
# Lists of all existing popouts and videos
#
popouts = []
videos  = []


#
# Return an appropriate popout name for the given request
#
name = (request) ->
  "Popout_for_YouTube_#{request.title}"


#
# Launch a popout. Add the popout and video to the lists.
#
launch_popout = (request, sender) ->
  window = chrome.windows.create {
    type: 'panel'
    url:  'popout.html'
    width: request.width
    height: request.height
  }, (window) ->

    # Save the window to the list
    #
    popouts[name request] = window.id

    # Add a couple of fields to the request and save it
    #
    request.name = name request
    request.original_tab_id = sender.tab.id
    videos[window.tabs[0].id] = request


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
chrome.extension.onRequest.addListener (request, sender, send_response) ->

  if request.action == 'launch'
    launch_unique_popout request, sender

  if request.action == 'current_time'
    chrome.tabs.sendRequest request.original_tab_id, {
      action: 'current_time'
      current_time: request.current_time
    }

  if request.action == 'get_video'
    send_response videos[sender.tab.id]
