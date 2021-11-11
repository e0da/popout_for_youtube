import {
  reportButtonClick,
  reportVersion,
  reportVideoViewed,
} from "./Extension"
import { Video } from "./Video"

const LISTENERS = ["getVideoMetadata", "buttonClicked", "videoViewed"]

const openWindow = ({ width, height }) =>
  new Promise((resolve) => {
    const opts = { type: "popup", url: "build/popout.html", width, height }
    chrome.windows.create(opts, resolve)
  })

const setUpListeners = (node) => {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) =>
    LISTENERS.forEach((listener) => {
      if (request.action === listener) {
        node[listener](request, sender, sendResponse)
      }
    })
  )
}

export class Background {
  videoViewed = reportVideoViewed

  constructor() {
    this.videos = []
  }

  mount = () => {
    reportVersion()
    setUpListeners(this)
  }

  buttonClicked = async (request) => {
    reportButtonClick()
    const { id, title, currentTime, width, height } = request
    const video = new Video({ id, title, currentTime, width, height })
    const window = openWindow({ width, height })
    this.videos[(await window).id] = video
  }

  getVideoMetadata = (request, sender, sendResponse) => {
    const video = this.videos[request.windowId]
    sendResponse({
      id: video.id,
      currentTime: video.currentTime,
      title: video.title,
    })
  }
}

export default Background
