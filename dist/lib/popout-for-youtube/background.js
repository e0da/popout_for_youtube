/*jslint browser: true */
/*global chrome */

var popouts = [];

function killCurrentPopoutIfItExists(name, callback) {
  if (popouts[name]) {

    chrome.windows.remove(popouts[name], callback);
    popouts[name] = null;
  }
  else {
    callback();
  }
}

chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {

  var name = 'Popout_for_YouTube' + request.title;

  function openNewPopout() {

    var window = chrome.windows.create({
      type: 'popup',
      url: 'player.html'
    }, function (window) {

      popouts[name] = window.id;

      // Tell the tab about the video so it can embed and play it
      chrome.tabs.sendRequest(window.tabs[0].id, {
        id: request.id,
        title: request.title,
        time: request.time,
        width: request.width,
        height: request.height
      });
    });
  }

  // Open a new window with a unique name, but if it already exists, kill it
  // and make a new one
  killCurrentPopoutIfItExists(name, openNewPopout);
  sendResponse({});
});
