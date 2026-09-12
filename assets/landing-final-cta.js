class LandingFinalCta extends HTMLElement {
  connectedCallback() {
    this.enableAnimation = this.dataset.animate === 'true';

    if (this.enableAnimation) {
      this.setupReveal();
    }
  }

  setupReveal() {
    if (!('IntersectionObserver' in window)) {
      this.classList.add('is-ready');
      return;
    }

    this.revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.classList.add('is-ready');
            this.revealObserver.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    this.revealObserver.observe(this);
  }
}

if (!window.customElements.get('landing-final-cta')) {
  window.customElements.define('landing-final-cta', LandingFinalCta);
}
