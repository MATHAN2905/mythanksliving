class LandingAnnouncementBar extends HTMLElement {
  connectedCallback() {
    this.track = this.querySelector('[data-track]');
    this.items = this.querySelectorAll('[data-item]');
    this.dots = this.querySelectorAll('[data-dot]');
    this.dismissButton = this.querySelector('[data-dismiss]');
    this.content = this.querySelector('[data-content]');

    if (this.dismissButton) {
      this.dismissButton.addEventListener('click', () => {
        if (this.content) {
          this.content.dataset.dismissed = 'true';
        }
      });
    }

    if (this.items.length < 2) {
      return;
    }

    this.autoplay = this.dataset.autoplay === 'true';
    this.interval = Number(this.dataset.interval || 5) * 1000;
    this.currentIndex = 0;

    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        this.goTo(index);
        this.stop();
      });
    });

    this.addEventListener('mouseenter', () => this.stop());
    this.addEventListener('mouseleave', () => this.start());

    this.start();
  }

  start() {
    if (!this.autoplay) {
      return;
    }

    this.stop();
    this.timer = window.setInterval(() => {
      this.goTo((this.currentIndex + 1) % this.items.length);
    }, this.interval);
  }

  stop() {
    if (!this.timer) {
      return;
    }

    window.clearInterval(this.timer);
    this.timer = null;
  }

  goTo(index) {
    this.currentIndex = index;

    this.items.forEach((item, itemIndex) => {
      const isActive = itemIndex === index;
      item.setAttribute('aria-hidden', String(!isActive));
    });

    this.dots.forEach((dot, dotIndex) => {
      dot.setAttribute('aria-current', String(dotIndex === index));
      dot.setAttribute('aria-label', `Show message ${dotIndex + 1}`);
    });
  }
}

if (!window.customElements.get('landing-announcement-bar')) {
  window.customElements.define('landing-announcement-bar', LandingAnnouncementBar);
}
