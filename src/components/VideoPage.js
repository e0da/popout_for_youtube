import { POLLING_INTERVAL } from "./constants"
import { Button } from "./VideoPage/Button"
import { Extension } from "./VideoPage/Extension"
import { Video } from "./VideoPage/Video"

function getVideoId() {
  return new URLSearchParams(document.location.search.substring(1)).get("v")
}

export class VideoPage {
  #onvideo = () => {} // eslint-disable-line class-methods-use-this

  title = document.title

  previousVideoId = null

  previousTitle = null

  mount = () => {
    setInterval(() => {
      if (this.videoChanged() || this.titleChanged()) {
        Extension.notifyVideoViewed()
        try {
          this.button.remove()
        } catch (error) {
          // Can fail if the button isn't arleady there. Ignore.
        }
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

  videoChanged = () => getVideoId() !== this.previousVideoId

  titleChanged = () => document.title !== this.previousTitle
}

export default VideoPage
