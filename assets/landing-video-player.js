class LandingVideoPlayer {
  constructor(root) {
    this.root = root;
    this.video = root.querySelector('.landing-video-player__video, .landing-video-player__media video');
    if (!this.video) {
      return;
    }

    if (this.video.autoplay) {
      const playPromise = this.video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.landing-video-player').forEach((root) => {
    new LandingVideoPlayer(root);
  });
});
