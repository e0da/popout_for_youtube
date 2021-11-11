export const loadIframe = async ({ videoId }) => {
  const iframe = document.createElement("iframe")
  iframe.id = "player"
  iframe.title = "Video Player"
  iframe.width = "100%"
  iframe.height = "100%"
  iframe.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1`
  iframe.setAttribute("frameborder", "0")
  iframe.setAttribute("allowfullscreen", "")
  document.body.appendChild(iframe)
  return iframe
}
export default loadIframe
