import { getVideoNode } from "./getVideoNode"
import { NodeComponent } from "./NodeComponent"

export class Video extends NodeComponent {
  constructor(id, title) {
    super()
    this.id = id
    this.title = title
  }

  mount = async () => {
    this.node = await getVideoNode()
  }

  pause = async () => this.node.pause()

  play = async () => this.node.play()

  get currentTime() {
    return this.node.currentTime
  }
}

export default Video
