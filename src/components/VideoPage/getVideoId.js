export function getVideoId() {
  return new URLSearchParams(document.location.search.substring(1)).get("v")
}

export default getVideoId
