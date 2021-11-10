import { POLLING_INTERVAL } from "./constants"
import { Extension } from "./Extension"
import { NodeComponent } from "./NodeComponent"

const BUTTON_CLASS = "popout-for-youtube__button"

const HIDDEN_CLASS = `${BUTTON_CLASS}--hidden`

export class Button extends NodeComponent {
  constructor(video1) {
    super()
    this.video = video1
    const buttonText = chrome.i18n.getMessage("buttonText")
    this.styleInterval = null
    const button = document.createElement("button")
    button.title = buttonText
    button.className = `${BUTTON_CLASS} ${HIDDEN_CLASS}`
    this.node = button
    this.setClickBehavior()
    this.maintainStyle()
  }

  setClickBehavior() {
    return this.node.addEventListener("click", () => {
      this.video.pause()
      return Extension.openPopout(this.video)
    })
  }

  setBottomLeftCorner(point) {
    this.node.style.top = `${point.y - this.height()}px`
    this.node.style.left = `${point.x}px`
  }

  remove() {
    clearInterval(this.styleInterval)
    return this.node.parentNode.removeChild(this.node)
  }

  maintainStyle() {
    return this.video.waitForVideoNode().then(() => {
      this.styleInterval = setInterval(() => {
        this.setDisplay()
        this.setBottomLeftCorner(this.video.topRightCorner())
      }, POLLING_INTERVAL)
    })
  }

  setDisplay() {
    if (this.node.style.top === "") {
      return this.node.classList.add(HIDDEN_CLASS)
    }
    return this.node.classList.remove(HIDDEN_CLASS)
  }
}

export default Button
