import { Button } from "./Button"
import { POLLING_INTERVAL } from "./constants"
import { notifyVideoViewed } from "./Extension"
import { getVideoId, Video } from "./Video"

export class Session {
  title = document.title

  previousVideoId = null

  previousTitle = null

  mount = () => {
    setInterval(() => {
      if (this.videoChanged || this.titleChanged) {
        notifyVideoViewed()
        if (this.button) this.button.remove()
        this.previousTitle = this.title
        this.title = document.title
        this.video = new Video(this.newVideoId, this.title)
        this.button = new Button(this.video)
        this.previousVideoId = this.newVideoId
        this.newVideoId = getVideoId()
        document.body.appendChild(this.button.node)
      }
    }, POLLING_INTERVAL)
  }

  get videoChanged() {
    return getVideoId() !== this.previousVideoId
  }

  get titleChanged() {
    return document.title !== this.previousTitle
  }
}

export default Session
