class LandingVideoSection extends HTMLElement {
  connectedCallback() {
    this.poster = this.querySelector('[data-poster]');
    this.iframe = this.querySelector('iframe[data-embed-src]');
    this.video = this.querySelector('.landing-video-section__video, .landing-video-section__media video');
    this.autoplay = this.dataset.autoplay === 'true';
    this.mute = this.dataset.mute === 'true';

    if (this.autoplay) {
      this.startPlayback(true);
      this.classList.add('is-playing');
    }

    if (this.poster) {
      this.poster.addEventListener('click', () => {
        this.startPlayback(true);
        this.classList.add('is-playing');
        this.poster.setAttribute('aria-hidden', 'true');
      });
    }

    if (this.dataset.animate === 'true') {
      this.handleReveal();
    }
  }

  startPlayback(shouldAutoplay = false) {
    if (this.video) {
      this.playNativeVideo(shouldAutoplay);
      return;
    }

    this.loadEmbedVideo(shouldAutoplay);
  }

  loadEmbedVideo(shouldAutoplay = false) {
    if (!this.iframe) {
      return;
    }

    const baseSrc = this.iframe.dataset.embedSrc || '';
    if (!baseSrc) {
      return;
    }

    const nextSrc = shouldAutoplay ? this.getAutoplaySrc(baseSrc) : baseSrc;
    const currentSrc = this.iframe.getAttribute('src') || '';

    if (currentSrc !== nextSrc) {
      this.iframe.setAttribute('src', nextSrc);
    }
  }

  playNativeVideo(shouldAutoplay = false) {
    if (!this.video) {
      return;
    }

    this.video.controls = true;

    if (!this.mute && shouldAutoplay) {
      this.video.muted = false;
    } else if (this.mute) {
      this.video.muted = true;
    }

    if (this.video.readyState === 0) {
      this.video.load();
    }

    if (shouldAutoplay) {
      const playPromise = this.video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
      }
    }
  }

  getAutoplaySrc(src) {
    try {
      const url = new URL(src);
      url.searchParams.set('autoplay', '1');
      return url.toString();
    } catch (error) {
      if (/autoplay=[01]/.test(src)) {
        return src.replace(/autoplay=[01]/, 'autoplay=1');
      }

      return `${src}${src.includes('?') ? '&' : '?'}autoplay=1`;
    }
  }

  handleReveal() {
    if (!('IntersectionObserver' in window)) {
      this.classList.add('is-ready');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.classList.add('is-ready');
            this.observer.disconnect();
          }
        });
      },
      { threshold: 0.22 }
    );

    this.observer.observe(this);
  }
}

if (!window.customElements.get('landing-video-section')) {
  window.customElements.define('landing-video-section', LandingVideoSection);
}
