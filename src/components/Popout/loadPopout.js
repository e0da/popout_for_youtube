import {
  getVideoMetadata,
  configurePlayer,
  loadIframe,
  loadIframeApi,
} from "./helpers"

export async function loadPopout({ width, height }) {
  const [videoId, seekTime] = await getVideoMetadata()
  const video = { videoId, seekTime, width, height }

  const iframeLoaded = loadIframe(video)
  const playerConfigured = configurePlayer(video)
  const apiLoaded = playerConfigured.then(loadIframeApi)

  return Promise.all([apiLoaded, iframeLoaded])
}

export default loadPopout
