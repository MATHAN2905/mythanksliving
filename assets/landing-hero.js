class LandingHero extends HTMLElement {
  connectedCallback() {
    this.enableReveal = this.dataset.reveal === 'true';
    if (this.enableReveal && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.classList.add('is-ready');
              this.observer.disconnect();
            }
          });
        },
        {
          threshold: 0.28
        }
      );
      this.observer.observe(this);
    } else {
      this.classList.add('is-ready');
    }
  }
}

if (!window.customElements.get('landing-hero')) {
  window.customElements.define('landing-hero', LandingHero);
}
