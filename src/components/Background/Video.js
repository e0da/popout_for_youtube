export class Video {
  constructor(videoId, title, currentTime, width, height) {
    this.videoId = videoId
    this.title = title
    this.currentTime = currentTime
    this.width = width
    this.height = height
  }

  openWindow() {
    return new Promise((resolve) => {
      const { width, height } = this
      const opts = { type: "popup", url: "build/popout.html", width, height }
      chrome.windows.create(opts, resolve)
    })
  }
}
export default Video
