export class VirtualNode {
  quit = false

  box = {
    width: 0,
    height: 0,
  }

  constructor({ width, height } = this.box) {
    this.box = { width, height }
  }

  get offset() {
    let el = this.node
    let left = 0
    let top = 0
    while (!this.quit) {
      left += el.offsetLeft
      top += el.offsetTop
      el = el.offsetParent
      if (!el) break
    }
    return { left, top }
  }

  set width(value) {
    this.box.width = value
  }

  get width() {
    this.width = parseInt(this.node.offsetWidth, 10)
    return this.box.width
  }

  set height(value) {
    this.box.height = value
  }

  get height() {
    this.height = parseInt(this.node.offsetHeight, 10)
    return this.box.height
  }

  get topRightCorner() {
    const {
      offset: { left, top },
      width,
    } = this
    const x = left + width
    const y = top
    return { x, y }
  }
}

export default VirtualNode
