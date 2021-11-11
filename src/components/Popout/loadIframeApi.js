export const loadIframeApi = () =>
  new Promise((resolve) => {
    const script = document.createElement("script")
    script.src = "https://www.youtube.com/iframe_api"

    const firstScript = document.getElementsByTagName("script")[0]
    firstScript.parentNode.insertBefore(script, firstScript)

    script.addEventListener("load", resolve.bind(script))
  })
export default loadIframeApi
