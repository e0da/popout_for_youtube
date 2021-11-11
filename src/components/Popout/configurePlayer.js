const readyHandler =
  ({ id, currentTime, width, height }) =>
  () => {
    const player = new YT.Player("player", {
      height,
      width,
      id,
      playerVars: { enablejsapi: 1 },
      events: {
        onReady: () => {
          player.seekTo(currentTime - 1)
          player.playVideo()
        },
      },
    })
  }

export function configurePlayer(video) {
  const onReady = readyHandler(video)
  window.onYouTubeIframeAPIReady = onReady
  return onReady
}

export default configurePlayer
