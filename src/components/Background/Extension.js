export class Extension {
  static version() {
    return `v${chrome.runtime.getManifest().version}`
  }

  static reportVersion() {
    return this.trackEvent("Background", "version", this.version())
  }

  static reportButtonClick() {
    return this.trackEvent("YouTubeVideoPage", "popoutButtonClick")
  }

  static trackEvent(category, action, value) {
    // https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide
    const val = value === undefined ? undefined : `${value}`
    return _gaq.push(["_trackEvent", category, action, val])
  }

  static reportVideoViewed() {
    return this.trackEvent("YouTubeVideoPage", "videoViewed")
  }
}
export default Extension
