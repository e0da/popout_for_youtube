(function () {
  var Background, Extension, Video;

  Extension = class Extension {
    static version() {
      return `v${chrome.runtime.getManifest().version}`;
    }

    static reportVersion() {
      return this.trackEvent("Background", "version", this.version());
    }

    static reportButtonClick() {
      return this.trackEvent("YouTubeVideoPage", "popoutButtonClick");
    }

    static trackEvent(category, action, value) {
      if (value !== void 0) {
        // Make it a string or leave it undefined
        // _gaq.push(['_trackEvent', 'Videos', 'Play', 'Gone With the Wind']);
        // https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide
        value = `${value}`;
      }
      return _gaq.push(["_trackEvent", category, action, value]);
    }

    static reportVideoViewed() {
      return this.trackEvent("YouTubeVideoPage", "videoViewed");
    }
  };

  Video = class Video {
    constructor(videoId, title, currentTime, width, height) {
      this.videoId = videoId;
      this.title = title;
      this.currentTime = currentTime;
      this.width = width;
      this.height = height;
    }

    openWindow(callback) {
      return chrome.windows.create(
        {
          type: "popup",
          url: "popout.html",
          width: this.width,
          height: this.height,
        },
        function (window) {
          return callback(window, this.title);
        }
      );
    }
  };

  Background = function () {
    var LISTENERS;

    class Background {
      constructor() {
        this.openPopout = this.openPopout.bind(this);
        this.getVideoMetadata = this.getVideoMetadata.bind(this);
        this.videoViewed = this.videoViewed.bind(this);
        this.videos = [];
        this.setUpListeners();
        Extension.reportVersion();
      }

      setUpListeners() {
        return chrome.runtime.onMessage.addListener(
          (request, sender, sendResponse) => {
            return LISTENERS.forEach((listener) => {
              if (request.action === listener) {
                return this[listener](request, sender, sendResponse);
              }
            });
          }
        );
      }

      openPopout(request, sender, sendResponse) {
        var video;
        Extension.reportButtonClick();
        video = new Video(
          request.videoId,
          request.title,
          request.currentTime,
          request.width,
          request.height
        );
        return video.openWindow((window) => {
          return (this.videos[window.id] = video);
        });
      }

      getVideoMetadata(request, sender, sendResponse) {
        var video;
        video = this.videos[request.windowId];
        console.log(video);
        return sendResponse({
          videoId: video.videoId,
          currentTime: video.currentTime,
          title: video.title,
        });
      }

      videoViewed(request, sender, sendResponse) {
        return Extension.reportVideoViewed();
      }
    }

    LISTENERS = ["getVideoMetadata", "openPopout", "videoViewed"];

    return Background;
  }.call(this);

  new Background();
}.call());
