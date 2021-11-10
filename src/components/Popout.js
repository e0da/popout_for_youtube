import { loadPlayerAPI } from "./Popout/loadPlayerAPI"
import { loadVideo } from "./Popout/loadVideo"
import { setUpPlayer } from "./Popout/setUpPlayer"

export class Popout {
  constructor() {
    this.name = chrome.i18n.getMessage("name")
  }

  mount = async () => {
    const { width, height } = this
    const [videoId, seekTime] = await this.getVideoMetadata()
    await Promise.all([
      loadPlayerAPI(),
      loadVideo(videoId),
      setUpPlayer({ videoId, seekTime, width, height }),
    ])
  }

  getVideoMetadata = () =>
    new Promise((resolve, reject) => {
      chrome.windows.getCurrent((window) =>
        chrome.extension.sendMessage(
          {
            action: "getVideoMetadata",
            windowId: window.id,
          },
          (response) => {
            document.title = this.windowTitle(response.title)
            if (response.title) {
              resolve([response.videoId, response.currentTime])
            } else {
              reject(new Error("Response had no title"))
            }
          }
        )
      )
    })

  windowTitle = (videoTitle) =>
    `${videoTitle.replace(/ - YouTube$/, "")} - ${this.name}`
}
export default Popout
