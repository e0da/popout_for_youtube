import { configurePlayer } from "./Popout/configurePlayer"
import { loadIframe } from "./Popout/loadIframe"
import { loadIframeApi } from "./Popout/loadIframeApi"

async function loadPopout(popout) {
  const iframeLoaded = loadIframe(popout)
  const playerConfigured = configurePlayer(popout)
  const apiLoaded = playerConfigured.then(loadIframeApi)
  return Promise.all([apiLoaded, iframeLoaded])
}

export class Popout {
  constructor() {
    const params = new URLSearchParams(document.location.search.substring(1))
    this.id = params.get("id")
    this.currentTime = parseFloat(params.get("currentTime"))
    this.width = parseInt(params.get("width"), 10)
    this.height = parseInt(params.get("height"), 10)
  }

  mount = async () => {
    await loadPopout(this)
  }
}
export default Popout
