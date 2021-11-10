export function setUpPlayer({ videoId, seekTime, height, width }) {
  window.onYouTubeIframeAPIReady = () => {
    const player = new YT.Player("player", {
      height,
      width,
      videoId,
      playerVars: {
        enablejsapi: 1,
      },
      events: {
        onReady: () => {
          player.seekTo(seekTime - 1)
          player.playVideo()
        },
      },
    })
  }
}

export default setUpPlayer
