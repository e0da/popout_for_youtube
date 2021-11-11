import { loadPopout } from "./Popout/loadPlayer"

export class Popout {
  name = chrome.i18n.getMessage("name")

  mount = async () => loadPopout(this)
}
export default Popout
