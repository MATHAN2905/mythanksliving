class LandingBookFeatures extends HTMLElement {
  connectedCallback() {
    this.setupReveal();
  }

  disconnectedCallback() {
    this.observer?.disconnect();
    if (this.readyTimer) window.clearTimeout(this.readyTimer);
  }

  markReady() {
    if (this.classList.contains('is-ready')) return;
    this.classList.add('is-ready');
    this.observer?.disconnect();
    if (this.readyTimer) window.clearTimeout(this.readyTimer);
  }

  setupReveal() {
    if (this.dataset.animate !== 'true') {
      this.markReady();
      return;
    }

    // Always reveal eventually — never leave content invisible
    this.readyTimer = window.setTimeout(() => this.markReady(), 1200);

    if (!('IntersectionObserver' in window)) {
      this.markReady();
      return;
    }

    const root = document.querySelector('.page-wrapper') || null;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) this.markReady();
        });
      },
      { root, threshold: 0.12, rootMargin: '0px 0px -4% 0px' }
    );

    this.observer.observe(this);
  }
}

if (!window.customElements.get('landing-book-features')) {
  window.customElements.define('landing-book-features', LandingBookFeatures);
}
