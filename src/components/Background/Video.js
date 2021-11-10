export class Video {
  constructor(videoId, title, currentTime, width, height) {
    this.videoId = videoId;
    this.title = title;
    this.currentTime = currentTime;
    this.width = width;
    this.height = height;
  }

  openWindow(callback) {
    const { width, height, title } = this;
    const opts = { type: "popup", url: "build/popout.html", width, height };
    return chrome.windows.create(opts, (window) => callback(window, title));
  }
}
export default Video;
