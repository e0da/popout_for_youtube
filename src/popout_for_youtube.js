;(function () {
  let BUTTON_CLASS
  let Button
  let Extension
  let HIDDEN_CLASS
  let Node
  let POLLING_INTERVAL
  let Video
  let YouTubeVideoPage

  BUTTON_CLASS = "popout-for-youtube__button"

  HIDDEN_CLASS = `${BUTTON_CLASS}--hidden`

  POLLING_INTERVAL = 250

  Extension = class Extension {
    static openPopout(video) {
      return chrome.extension.sendMessage({
        action: "openPopout",
        title: video.title,
        videoId: video.id,
        currentTime: video.currentTime(),
        width: video.width(),
        height: video.height(),
        uniqueId: Extension.uniqueId(),
      })
    }

    static uniqueId() {
      return Math.random() ^ new Date().getTime()
    }

    static notifyVideoViewed() {
      return chrome.extension.sendMessage({
        action: "videoViewed",
      })
    }
  }

  Node = class Node {
    offset() {
      let el
      let left
      let top
      el = this.node
      left = top = 0
      while (true) {
        left += el.offsetLeft
        top += el.offsetTop
        if (!(el = el.offsetParent)) {
          break
        }
      }
      return {
        left,
        top,
      }
    }

    width() {
      return parseInt(this.node.offsetWidth)
    }

    height() {
      return parseInt(this.node.offsetHeight)
    }

    topRightCorner() {
      return {
        x: this.offset().left + this.width(),
        y: this.offset().top,
      }
    }
  }

  Video = function () {
    let selectVideo

    class Video extends Node {
      constructor(id, title) {
        super()
        this.id = id
        this.title = title
        this.waitForVideoNode().then((node) => (this.node = node))
      }

      pause() {
        return this.node.pause()
      }

      play() {
        return this.node.play()
      }

      currentTime() {
        return this.node.currentTime
      }

      seekTo(time) {
        return (this.node.currentTime = time)
      }

      togglePlayback() {
        if (this.node.paused) {
          return this.node.play()
        }
        return this.node.pause()
      }

      waitForVideoNode() {
        return new Promise((resolve) =>
          setInterval(() => {
            let node
            node = selectVideo()
            if (node) {
              return resolve(node)
            }
          }, POLLING_INTERVAL)
        )
      }
    }

    selectVideo = function () {
      return document.querySelector("#player video")
    }

    return Video
  }.call(this)

  Button = class Button extends Node {
    constructor(video1) {
      let button
      let buttonText
      super()
      this.video = video1
      buttonText = chrome.i18n.getMessage("buttonText")
      this.styleInterval = null
      button = document.createElement("button")
      button.title = buttonText
      button.className = `${BUTTON_CLASS} ${HIDDEN_CLASS}`
      this.node = button
      this.setClickBehavior()
      this.maintainStyle()
    }

    setClickBehavior() {
      return this.node.addEventListener("click", (event) => {
        this.video.pause()
        return Extension.openPopout(this.video)
      })
    }

    setBottomLeftCorner(point) {
      this.node.style.top = `${point.y - this.height()}px`
      return (this.node.style.left = `${point.x}px`)
    }

    remove() {
      clearInterval(this.styleInterval)
      return this.node.parentNode.removeChild(this.node)
    }

    maintainStyle() {
      return this.video.waitForVideoNode().then(
        () =>
          (this.styleInterval = setInterval(() => {
            this.setDisplay()
            return this.setBottomLeftCorner(this.video.topRightCorner())
          }, POLLING_INTERVAL))
      )
    }

    setDisplay() {
      if (this.node.style.top === "") {
        return this.node.classList.add(HIDDEN_CLASS)
      }
      return this.node.classList.remove(HIDDEN_CLASS)
    }
  }

  YouTubeVideoPage = class YouTubeVideoPage {
    #onvideo = () => {}

    constructor() {
      this.previousVideoId = null
      this.previousTitle = null
      this.onVideo(() => {
        this.title = document.title
        this.video = new Video(this.newVideoId, this.title)
        this.button = new Button(this.video)
        document.body.appendChild(this.button.node)
        Extension.notifyVideoViewed()
      })
      this.onTitle(() => {
        this.title = document.title
        this.onVideo()
      })
      this.onVideoId(() => {
        try {
          this.button.remove() // Can fail if the button isn't arleady there. Ignore.
        } catch (error) {}
        this.previousVideoId = this.newVideoId
        this.newVideoId = this.getVideoId()
        this.onVideo()
      })
    }

    onVideo(callback) {
      if (callback) this.onvideo = callback
      else this.onvideo()
    }

    onVideoId(callback) {
      return setInterval(() => {
        if (this.videoChanged()) {
          return callback()
        }
      }, POLLING_INTERVAL)
    }

    onTitle(callback) {
      return setInterval(() => {
        if (this.titleChanged()) {
          return callback()
        }
      }, POLLING_INTERVAL)
    }

    videoChanged() {
      return this.getVideoId() !== this.previousVideoId
    }

    titleChanged() {
      return this.getTitle() !== this.previousTitle
    }

    getVideoId() {
      return new URLSearchParams(document.location.search.substring(1)).get("v")
    }

    getTitle() {
      return document.title
    }
  }

  new YouTubeVideoPage()
}.call())
