export function loadYouTubeAPI() {
  const script = document.createElement("script");
  script.src = "https://www.youtube.com/iframe_api";
  const firstScript = document.getElementsByTagName("script")[0];
  return firstScript.parentNode.insertBefore(script, firstScript);
}

export default loadYouTubeAPI;
