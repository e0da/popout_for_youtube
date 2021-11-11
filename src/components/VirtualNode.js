export class VirtualNode {
  quit = false

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

  get width() {
    return parseInt(this.node.offsetWidth, 10)
  }

  get height() {
    return parseInt(this.node.offsetHeight, 10)
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
