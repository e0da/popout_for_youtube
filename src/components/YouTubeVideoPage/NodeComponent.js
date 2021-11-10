// Don't want to collide with glogal window.Node, so call it NodeComponent
export class NodeComponent {
  quit = false;

  offset() {
    let el = this.node;
    let left = 0;
    let top = 0;
    while (!this.quit) {
      left += el.offsetLeft;
      top += el.offsetTop;
      el = el.offsetParent;
      if (!el) break;
    }
    return { left, top };
  }

  width() {
    return parseInt(this.node.offsetWidth, 10);
  }

  height() {
    return parseInt(this.node.offsetHeight, 10);
  }

  topRightCorner() {
    return {
      x: this.offset().left + this.width(),
      y: this.offset().top,
    };
  }
}

export default NodeComponent;
