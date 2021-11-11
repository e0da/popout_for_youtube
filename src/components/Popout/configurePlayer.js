const readyHandler =
  ({ videoId, seekTime, width, height }) =>
  () => {
    const player = new YT.Player("player", {
      height,
      width,
      videoId,
      playerVars: { enablejsapi: 1 },
      events: {
        onReady: () => {
          player.seekTo(seekTime - 1)
          player.playVideo()
        },
      },
    })
  }

export const configurePlayer = async (video) => {
  const onReady = readyHandler(video)
  window.onYouTubeIframeAPIReady = onReady
  return onReady
}
export default configurePlayer
