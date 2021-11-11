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
        ({ title, id, currentTime }) => {
          document.title = windowTitle(title)
          if (title) {
            resolve([id, currentTime])
          } else {
            reject(new Error("Response had no title"))
          }
        }
      )
    )
  })

export default getVideoMetadata
