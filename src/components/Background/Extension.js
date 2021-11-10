export class Extension {
  static version() {
    return `v${chrome.runtime.getManifest().version}`;
  }

  static reportVersion() {
    this.trackEvent("Background", "version", this.version());
  }

  static reportButtonClick() {
    this.trackEvent("YouTubeVideoPage", "popoutButtonClick");
  }

  static trackEvent(category, action, value) {
    // https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide
    const val = value === undefined ? undefined : `${value}`;
    window._gaq.push(["_trackEvent", category, action, val]); // eslint-disable-line no-underscore-dangle
  }

  static reportVideoViewed() {
    this.trackEvent("YouTubeVideoPage", "videoViewed");
  }
}
export default Extension;
