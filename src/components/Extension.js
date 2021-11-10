export function notifyVideoViewed() {
  chrome.extension.sendMessage({ action: "videoViewed" })
}

export function uniqueId() {
  return Math.random() ^ new Date().getTime() // eslint-disable-line no-bitwise
}

export function openPopout(video) {
  return chrome.extension.sendMessage({
    action: "openPopout",
    title: video.title,
    videoId: video.id,
    currentTime: video.currentTime,
    width: video.width,
    height: video.height,
    uniqueId: uniqueId(),
  })
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
  trackEvent("VideoPage", "popoutButtonClick")
}

export function reportVersion() {
  trackEvent("Background", "version", version())
}

export function reportVideoViewed() {
  trackEvent("VideoPage", "videoViewed")
}

export const Extension = {
  notifyVideoViewed,
  openPopout,
  reportButtonClick,
  reportVersion,
  reportVideoViewed,
  trackEvent,
  uniqueId,
  version,
}

export default Extension
