function loadYouTubeAPI() {
  const script = document.createElement("script")
  script.src = "https://www.youtube.com/iframe_api"
  const firstScript = document.getElementsByTagName("script")[0]
  return firstScript.parentNode.insertBefore(script, firstScript)
}

export class Popout {
  constructor() {
    this.name = chrome.i18n.getMessage("name")
  }

  mount() {
    this.getVideoMetadata(() =>
      this.setUpPlayer(() => this.loadVideo(() => loadYouTubeAPI()))
    )
  }

  loadVideo(callback) {
    const iframe = document.createElement("iframe")
    iframe.id = "player"
    iframe.title = "YouTube video player iframe"
    iframe.width = "100%"
    iframe.height = "100%"
    iframe.src = `https://www.youtube.com/embed/${this.videoId}?enablejsapi=1`
    iframe.setAttribute("frameborder", "0")
    iframe.setAttribute("allowfullscreen", "")
    document.body.appendChild(iframe)
    return callback()
  }

  setUpPlayer(callback) {
    window.onYouTubeIframeAPIReady = () => {
      this.player = new YT.Player("player", {
        height: this.height,
        width: this.width,
        videoId: this.videoId,
        playerVars: {
          enablejsapi: 1,
        },
        events: {
          onReady: () => {
            this.player.seekTo(this.currentTime - 1)
            this.player.playVideo()
          },
        },
      })
      window.player = this.player
    }
    return callback()
  }

  getVideoMetadata(callback) {
    chrome.windows.getCurrent((window) =>
      chrome.extension.sendMessage(
        {
          action: "getVideoMetadata",
          windowId: window.id,
        },
        (response) => {
          this.videoId = response.videoId
          this.currentTime = response.currentTime
          document.title = this.windowTitle(response.title)
          callback()
        }
      )
    )
  }

  windowTitle(videoTitle) {
    return `${videoTitle.replace(/ - YouTube$/, "")} - ${this.name}`
  }
}
export default Popout
