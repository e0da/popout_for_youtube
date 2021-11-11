import {
  reportButtonClick,
  reportVersion,
  reportVideoViewed,
} from "./Extension"
import { Video } from "./Background/Video"

const LISTENERS = ["getVideoMetadata", "openPopout", "videoViewed"]

export class Background {
  constructor() {
    this.videos = []
  }

  mount() {
    this.setUpListeners()
    reportVersion()
  }

  videoViewed() {
    reportVideoViewed(this.videos)
  }

  setUpListeners() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) =>
      LISTENERS.forEach((listener) => {
        if (request.action === listener) {
          this[listener](request, sender, sendResponse)
        }
      })
    )
  }

  async openPopout(request) {
    reportButtonClick()
    const video = new Video(
      request.videoId,
      request.title,
      request.currentTime,
      request.width,
      request.height
    )
    const window = video.openWindow()
    this.videos[(await window).id] = video
  }

  getVideoMetadata(request, sender, sendResponse) {
    const video = this.videos[request.windowId]
    sendResponse({
      videoId: video.videoId,
      currentTime: video.currentTime,
      title: video.title,
    })
  }
}

export default Background
