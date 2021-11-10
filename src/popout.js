(function () {
  var Popout;

  Popout = class Popout {
    constructor() {
      this.name = chrome.i18n.getMessage("name");
      this.getVideoMetadata(() => {
        return this.setUpPlayer(() => {
          return this.loadVideo(() => {
            return this.loadAPI();
          });
        });
      });
    }

    loadVideo(callback) {
      var iframe;
      iframe = document.createElement("iframe");
      iframe.id = "player";
      iframe.title = "YouTube video player iframe";
      iframe.width = "100%";
      iframe.height = "100%";
      iframe.src = `https://www.youtube.com/embed/${this.videoId}?enablejsapi=1`;
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute("allowfullscreen", "");
      document.body.appendChild(iframe);
      return callback();
    }

    loadAPI() {
      var firstScript, script;
      script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      firstScript = document.getElementsByTagName("script")[0];
      return firstScript.parentNode.insertBefore(script, firstScript);
    }

    setUpPlayer(callback) {
      window.onYouTubeIframeAPIReady = () => {
        this.player = new YT.Player("player", {
          height: this.height,
          width: this.width,
          videoId: this.videoId,
          playerVars: {
            enablejsapi: 1,
          },
          events: {
            onReady: () => {
              this.player.seekTo(this.currentTime - 1);
              return this.player.playVideo();
            },
          },
        });
        return (window.player = this.player);
      };
      return callback();
    }

    getVideoMetadata(callback) {
      return chrome.windows.getCurrent((window) => {
        return chrome.extension.sendMessage(
          {
            action: "getVideoMetadata",
            windowId: window.id,
          },
          (response) => {
            this.videoId = response.videoId;
            this.currentTime = response.currentTime;
            document.title = this.windowTitle(response.title);
            return callback();
          }
        );
      });
    }

    windowTitle(videoTitle) {
      return videoTitle.replace(/ - YouTube$/, "") + ` - ${this.name}`;
    }
  };

  new Popout();
}.call());
