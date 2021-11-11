import { configurePlayer } from "./Popout/configurePlayer"
import { getVideoMetadata } from "./Popout/getVideoMetadata"
import { loadIframe } from "./Popout/loadIframe"
import { loadIframeApi } from "./Popout/loadIframeApi"

async function loadPopout({ width, height }) {
  const [videoId, seekTime] = await getVideoMetadata()
  const video = { videoId, seekTime, width, height }

  const iframeLoaded = loadIframe(video)
  const playerConfigured = configurePlayer(video)
  const apiLoaded = playerConfigured.then(loadIframeApi)

  return Promise.all([apiLoaded, iframeLoaded])
}

export class Popout {
  mount = async () => loadPopout(this)
}
export default Popout
