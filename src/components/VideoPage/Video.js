import { POLLING_INTERVAL } from "./constants"
import { NodeComponent } from "./NodeComponent"

function selectVideo() {
  return document.querySelector("#player video")
}

export class Video extends NodeComponent {
  constructor(id, title) {
    super()
    this.id = id
    this.title = title
    this.waitForVideoNode().then((node) => {
      this.node = node
    })
  }

  pause() {
    this.node.pause()
  }

  play() {
    this.node.play()
  }

  currentTime() {
    return this.node.currentTime
  }

  seekTo(time) {
    this.node.currentTime = time
  }

  togglePlayback() {
    if (this.node.paused) {
      this.node.play()
    } else {
      this.node.pause()
    }
  }

  waitForVideoNode() {
    return new Promise((resolve, reject) => {
      setInterval(() => {
        const node = selectVideo()
        if (node) {
          resolve(node, this)
        } else {
          reject(new Error("Video node not found"))
        }
      }, POLLING_INTERVAL)
    })
  }
}

export default Video
