export function loadPlayerAPI(callback) {
  const script = document.createElement("script")
  script.src = "https://www.youtube.com/iframe_api"
  const firstScript = document.getElementsByTagName("script")[0]
  script.addEventListener("load", () => {
    callback()
  })
  return firstScript.parentNode.insertBefore(script, firstScript)
}

export default loadPlayerAPI
