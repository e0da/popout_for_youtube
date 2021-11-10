(function () {
  var BUTTON_CLASS,
    Button,
    Extension,
    HIDDEN_CLASS,
    Node,
    POLLING_INTERVAL,
    Video,
    YouTubeVideoPage;

  BUTTON_CLASS = "popout-for-youtube__button";

  HIDDEN_CLASS = `${BUTTON_CLASS}--hidden`;

  POLLING_INTERVAL = 250;

  Extension = class Extension {
    static openPopout(video) {
      return chrome.extension.sendMessage({
        action: "openPopout",
        title: video.title,
        videoId: video.id,
        currentTime: video.currentTime(),
        width: video.width(),
        height: video.height(),
        uniqueId: Extension.uniqueId(),
      });
    }

    static uniqueId() {
      return Math.random() ^ new Date().getTime();
    }

    static notifyVideoViewed() {
      return chrome.extension.sendMessage({
        action: "videoViewed",
      });
    }
  };

  Node = class Node {
    offset() {
      var el, left, top;
      el = this.node;
      left = top = 0;
      while (true) {
        left += el.offsetLeft;
        top += el.offsetTop;
        if (!(el = el.offsetParent)) {
          break;
        }
      }
      return {
        left: left,
        top: top,
      };
    }

    width() {
      return parseInt(this.node.offsetWidth);
    }

    height() {
      return parseInt(this.node.offsetHeight);
    }

    topRightCorner() {
      return {
        x: this.offset().left + this.width(),
        y: this.offset().top,
      };
    }
  };

  Video = function () {
    var selectVideo;

    class Video extends Node {
      constructor(id, title) {
        super();
        this.id = id;
        this.title = title;
        this.waitForVideoNode().then((node) => {
          return (this.node = node);
        });
      }

      pause() {
        return this.node.pause();
      }

      play() {
        return this.node.play();
      }

      currentTime() {
        return this.node.currentTime;
      }

      seekTo(time) {
        return (this.node.currentTime = time);
      }

      togglePlayback() {
        if (this.node.paused) {
          return this.node.play();
        } else {
          return this.node.pause();
        }
      }

      waitForVideoNode() {
        return new Promise((resolve) => {
          return setInterval(() => {
            var node;
            node = selectVideo();
            if (node) {
              return resolve(node);
            }
          }, POLLING_INTERVAL);
        });
      }
    }

    selectVideo = function () {
      return document.querySelector("#player video");
    };

    return Video;
  }.call(this);

  Button = class Button extends Node {
    constructor(video1) {
      var button, buttonText;
      super();
      this.video = video1;
      buttonText = chrome.i18n.getMessage("buttonText");
      this.styleInterval = null;
      button = document.createElement("button");
      button.title = buttonText;
      button.className = `${BUTTON_CLASS} ${HIDDEN_CLASS}`;
      this.node = button;
      this.setClickBehavior();
      this.maintainStyle();
    }

    setClickBehavior() {
      return this.node.addEventListener("click", (event) => {
        this.video.pause();
        return Extension.openPopout(this.video);
      });
    }

    setBottomLeftCorner(point) {
      this.node.style.top = `${point.y - this.height()}px`;
      return (this.node.style.left = `${point.x}px`);
    }

    remove() {
      clearInterval(this.styleInterval);
      return this.node.parentNode.removeChild(this.node);
    }

    maintainStyle() {
      return this.video.waitForVideoNode().then(() => {
        return (this.styleInterval = setInterval(() => {
          this.setDisplay();
          return this.setBottomLeftCorner(this.video.topRightCorner());
        }, POLLING_INTERVAL));
      });
    }

    setDisplay() {
      if (this.node.style.top === "") {
        return this.node.classList.add(HIDDEN_CLASS);
      } else {
        return this.node.classList.remove(HIDDEN_CLASS);
      }
    }
  };

  YouTubeVideoPage = class YouTubeVideoPage {
    constructor() {
      this.previousVideoId = null;
      this.title = document.title;
      this.whenVideoChanges(() => {
        try {
          this.button.remove(); // Can fail if the button isn't arleady there. Ignore.
        } catch (error) {}
        this.previousVideoId = this.newVideoId;
        this.newVideoId = this.getVideoId();
        this.title = document.title;
        this.video = new Video(this.newVideoId, this.title);
        this.button = new Button(this.video);
        document.body.appendChild(this.button.node);
        return Extension.notifyVideoViewed();
      });
    }

    whenVideoChanges(callback) {
      return setInterval(() => {
        if (this.videoChanged()) {
          return callback();
        }
      }, POLLING_INTERVAL);
    }

    videoChanged() {
      return this.getVideoId() !== this.previousVideoId;
    }

    getVideoId() {
      return new URLSearchParams(document.location.search.substring(1)).get(
        "v"
      );
    }
  };

  new YouTubeVideoPage();
}.call());
