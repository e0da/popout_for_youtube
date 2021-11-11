import { getVideoId } from "./Video/getVideoId"
import { getVideoNode } from "./Video/getVideoNode"
import { VirtualNode } from "./VirtualNode"

export { getVideoId, getVideoNode }

export class Video extends VirtualNode {
  constructor({ title, id, width, height }) {
    super({ width, height })
    this.id = id
    this.title = title
    this.width = width
    this.height = height
  }

  mount = async () => {
    this.node = await getVideoNode()
  }

  pause = () => this.node.pause()

  play = () => this.node.play()
}
export default Video
