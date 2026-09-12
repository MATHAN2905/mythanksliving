class LandingAboutBook extends HTMLElement {
  connectedCallback() {
    if (this.dataset.animate !== 'true') {
      return;
    }

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
      { threshold: 0.24 }
    );

    this.observer.observe(this);
  }
}

if (!window.customElements.get('landing-about-book')) {
  window.customElements.define('landing-about-book', LandingAboutBook);
}
