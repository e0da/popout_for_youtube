const name = chrome.i18n.getMessage("name")

const windowTitle = (videoTitle) =>
  `${videoTitle.replace(/ - YouTube$/, "")} - ${name}`

export const getVideoMetadata = () =>
  new Promise((resolve, reject) => {
    chrome.windows.getCurrent((window) =>
      chrome.extension.sendMessage(
        {
          action: "getVideoMetadata",
          windowId: window.id,
        },
        (response) => {
          document.title = windowTitle(response.title)
          if (response.title) {
            resolve([response.videoId, response.currentTime])
          } else {
            reject(new Error("Response had no title"))
          }
        }
      )
    )
  })

export default getVideoMetadata
