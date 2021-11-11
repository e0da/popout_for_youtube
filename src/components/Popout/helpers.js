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

const readyHandler =
  ({ videoId, seekTime, width, height }) =>
  () => {
    const player = new YT.Player("player", {
      height,
      width,
      videoId,
      playerVars: { enablejsapi: 1 },
      events: {
        onReady: () => {
          player.seekTo(seekTime - 1)
          player.playVideo()
        },
      },
    })
  }

export const configurePlayer = async (video) => {
  const onReady = readyHandler(video)
  window.onYouTubeIframeAPIReady = onReady
  return onReady
}

export const loadIframe = async ({ videoId }) => {
  const iframe = document.createElement("iframe")
  iframe.id = "player"
  iframe.title = "Video Player"
  iframe.width = "100%"
  iframe.height = "100%"
  iframe.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1`
  iframe.setAttribute("frameborder", "0")
  iframe.setAttribute("allowfullscreen", "")
  document.body.appendChild(iframe)
  return iframe
}

export const loadIframeApi = () =>
  new Promise((resolve) => {
    const script = document.createElement("script")
    script.src = "https://www.youtube.com/iframe_api"

    const firstScript = document.getElementsByTagName("script")[0]
    firstScript.parentNode.insertBefore(script, firstScript)

    script.addEventListener("load", resolve.bind(script))
  })

const helpers = {
  getVideoMetadata,
  configurePlayer,
  loadIframe,
  loadIframeApi,
}

export default helpers
