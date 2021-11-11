const name = chrome.i18n.getMessage("name")

function windowTitle(videoTitle) {
  return `${videoTitle.replace(/ - YouTube$/, "")} - ${name}`
}

async function getVideoMetadata() {
  return new Promise((resolve, reject) => {
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
}

function configurePlayer({ videoId, seekTime, width, height }) {
  return () => {
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
}

async function loadIframe({ videoId }) {
  const iframe = document.createElement("iframe")
  const vid = Promise.resolve(videoId)
  iframe.id = "player"
  iframe.title = "Video Player"
  iframe.width = "100%"
  iframe.height = "100%"
  iframe.src = `https://www.youtube.com/embed/${await vid}?enablejsapi=1`
  iframe.setAttribute("frameborder", "0")
  iframe.setAttribute("allowfullscreen", "")
  document.body.appendChild(iframe)
  return iframe
}

async function loadIframeApi() {
  return new Promise((resolve) => {
    const script = document.createElement("script")
    script.src = "https://www.youtube.com/iframe_api"

    const firstScript = document.getElementsByTagName("script")[0]
    firstScript.parentNode.insertBefore(script, firstScript)

    script.addEventListener("load", () => {
      resolve(script)
    })
  })
}

export async function loadPopout({ width, height }) {
  const [videoId, seekTime] = await getVideoMetadata()
  const iframe = loadIframe({ videoId })
  const onReady = configurePlayer({ videoId, seekTime, width, height })
  const iframeApi = onReady.then(loadIframeApi)
  window.onYouTubeIframeAPIReady = await onReady
  return Promise.all([iframe, iframeApi])
}

export default loadPopout
