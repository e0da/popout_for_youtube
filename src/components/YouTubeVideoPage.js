import { Extension } from "./YouTubeVideoPage/Extension";
import { Video } from "./YouTubeVideoPage/Video";
import { Button } from "./YouTubeVideoPage/Button";
import { POLLING_INTERVAL } from "./constants";

function getVideoId() {
  return new URLSearchParams(document.location.search.substring(1)).get("v");
}

function getTitle() {
  return document.title;
}

export class YouTubeVideoPage {
  #onvideo = () => {}; // eslint-disable-line class-methods-use-this

  constructor() {
    this.previousVideoId = null;
    this.previousTitle = null;
  }

  mount() {
    this.onVideo(() => {
      this.title = document.title;
      this.video = new Video(this.newVideoId, this.title);
      this.button = new Button(this.video);
      document.body.appendChild(this.button.node);
      Extension.notifyVideoViewed();
    });
    this.onTitle(() => {
      this.title = document.title;
      this.onVideo();
    });
    this.onVideoId(() => {
      try {
        this.button.remove();
      } catch (error) {
        // Can fail if the button isn't arleady there. Ignore.
      }
      this.previousVideoId = this.newVideoId;
      this.newVideoId = getVideoId();
      this.onVideo();
    });
  }

  onVideo(callback) {
    if (callback) this.onvideo = callback;
    else this.onvideo();
  }

  onVideoId(callback) {
    setInterval(() => {
      if (this.videoChanged()) {
        callback();
      }
    }, POLLING_INTERVAL);
  }

  onTitle(callback) {
    setInterval(() => {
      if (this.titleChanged()) {
        callback();
      }
    }, POLLING_INTERVAL);
  }

  videoChanged() {
    return getVideoId() !== this.previousVideoId;
  }

  titleChanged() {
    return getTitle() !== this.previousTitle;
  }
}

export default YouTubeVideoPage;
