export class Extension {
  static openPopout(video) {
    return chrome.extension.sendMessage({
      action: "openPopout",
      title: video.title,
      videoId: video.id,
      currentTime: video.currentTime(),
      width: video.width(),
      height: video.height(),
      uniqueId: Extension.uniqueId(),
    });
  }

  static uniqueId() {
    return Math.random() ^ new Date().getTime(); // eslint-disable-line no-bitwise
  }

  static notifyVideoViewed() {
    return chrome.extension.sendMessage({
      action: "videoViewed",
    });
  }
}

export default Extension;
