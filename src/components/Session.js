import { Button } from "./Button"
import { POLLING_INTERVAL } from "./constants"
import { notifyVideoViewed } from "./Extension"
import { getVideoId, Video } from "./Video"

export class Session {
  title = document.title

  previousVideoId = null

  previousTitle = null

  mount = () => {
    setInterval(async () => {
      if (this.videoChanged || this.titleChanged) {
        notifyVideoViewed()
        const id = getVideoId()
        const { title } = document

        const video = new Video({ id, title })
        await video.mount()

        const button = new Button({ video })
        await button.mount()

        this.button = button
        this.video = video

        this.previousTitle = this.title
        this.title = title

        this.previousVideoId = this.newVideoId
        this.newVideoId = id
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
