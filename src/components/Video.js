import { getVideoId } from "./Video/getVideoId"
import { getVideoNode } from "./Video/getVideoNode"
import { VirtualNode } from "./VirtualNode"

export { getVideoId, getVideoNode }

export class Video extends VirtualNode {
  constructor(currentTime, id, title, videoId, width, height) {
    super()
    this.currentTime = currentTime
    this.id = id
    this.title = title
    this.videoId = videoId
    this.width = width
    this.height = height
  }

  mount = async () => {
    this.node = await getVideoNode()
  }

  pause = async () => this.node.pause()

  play = async () => this.node.play()

  get currentTime() {
    return this.node.currentTime
  }

  openWindow() {
    return new Promise((resolve) => {
      const { width, height } = this
      const opts = { type: "popup", url: "build/popout.html", width, height }
      chrome.windows.create(opts, resolve)
    })
  }
}
export default Video
