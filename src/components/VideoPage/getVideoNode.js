import { POLLING_INTERVAL, TIMEOUT } from "./constants"

export function getVideoNode() {
  return new Promise((resolve, reject) => {
    let interval

    const timeout = setTimeout(() => {
      clearInterval(interval)
      reject(new Error("Video node not found"))
    }, TIMEOUT)

    interval = setInterval(() => {
      const node = document.querySelector("#player video")
      if (node) {
        resolve(node)
        clearTimeout(timeout)
        clearInterval(interval)
      }
    }, POLLING_INTERVAL)
  })
}

export default getVideoNode
