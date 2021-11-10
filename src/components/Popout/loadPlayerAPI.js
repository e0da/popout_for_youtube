export function loadPlayerAPI() {
  return new Promise((resolve) => {
    const script = document.createElement("script")
    script.src = "https://www.youtube.com/iframe_api"
    script.addEventListener("load", resolve)
    const firstScript = document.getElementsByTagName("script")[0]
    firstScript.parentNode.insertBefore(script, firstScript)
  })
}

export default loadPlayerAPI
