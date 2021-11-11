export function notifyVideoViewed() {
  chrome.extension.sendMessage({ action: "videoViewed" })
}

export function version() {
  return `v${chrome.runtime.getManifest().version}`
}

export function trackEvent(category, action, value) {
  // https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide
  const val = value === undefined ? undefined : `${value}`
  window._gaq.push(["_trackEvent", category, action, val]) // eslint-disable-line no-underscore-dangle
}

export function reportButtonClick() {
  trackEvent("Session", "popoutButtonClick")
}

export function reportVersion() {
  trackEvent("Background", "version", version())
}

export function reportVideoViewed() {
  trackEvent("Session", "videoViewed")
}

export const Extension = {
  notifyVideoViewed,
  reportButtonClick,
  reportVersion,
  reportVideoViewed,
  trackEvent,
  version,
}

export default Extension
