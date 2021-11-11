import { BUTTON_TEXT, POLLING_INTERVAL } from "./constants"
import { VirtualNode } from "./VirtualNode"

const BUTTON_CLASS = "popout__button"

const HIDDEN_CLASS = `${BUTTON_CLASS}--hidden`
const setClickBehavior = ({ button, node }) => {
  node.addEventListener("click", () => button.click())
}

const deleteOldButtons = () => {
  const oldButtons = document.querySelectorAll(`.${BUTTON_CLASS}`)
  ;[].forEach.bind(oldButtons)((oldButton) => oldButton.remove())
}

const insertButton = (node) => {
  document.body.appendChild(node)
}

const urlParams = (args) =>
  Object.entries(args)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&")

export class Button extends VirtualNode {
  styleInterval = null

  constructor({ video }) {
    super()
    this.video = video
  }

  mount = () => {
    const { video } = this
    const node = document.createElement("button")
    node.title = BUTTON_TEXT
    node.className = `${BUTTON_CLASS} ${HIDDEN_CLASS}`
    this.node = node

    deleteOldButtons()
    insertButton(node)
    setClickBehavior({ node, button: this })

    this.maintainStyle({ video })
  }

  setBottomLeftCorner = (point) => {
    this.node.style.top = `${point.y - this.height}px`
    this.node.style.left = `${point.x}px`
  }

  remove = () => {
    clearInterval(this.styleInterval)
    this.node.parentNode.removeChild(this.node)
  }

  maintainStyle = ({ video }) => {
    this.styleInterval = setInterval(() => {
      this.setDisplay()
      this.setBottomLeftCorner(video.topRightCorner)
    }, POLLING_INTERVAL)
  }

  setDisplay = () => {
    if (this.node.style.top === "") {
      this.node.classList.add(HIDDEN_CLASS)
    } else {
      this.node.classList.remove(HIDDEN_CLASS)
    }
  }

  click = () => {
    const {
      id,
      width,
      height,
      node: { currentTime },
    } = this.video
    return new Promise((resolve) => {
      const params = urlParams({ id, width, height, currentTime })
      const opts = { type: "popup", url: `build/popout.html?${params}` }
      chrome.windows.create(opts, resolve)
    })
  }
}

export default Button
