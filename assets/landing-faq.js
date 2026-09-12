class LandingFaq extends HTMLElement {
  connectedCallback() {
    this.enableAnimation = this.dataset.animate === 'true';
    this.singleOpen = this.dataset.singleOpen !== 'false';
    this.items = Array.from(this.querySelectorAll('details.landing-faq__item'));

    if (this.enableAnimation) {
      this.setupReveal();
    }

    if (this.singleOpen) {
      this.setupSingleOpen();
    }
  }

  setupSingleOpen() {
    this.items.forEach((item) => {
      const summary = item.querySelector('.landing-faq__summary');
      if (!summary) {
        return;
      }

      summary.addEventListener('click', (event) => {
        event.preventDefault();

        const shouldOpen = !item.open;

        this.items.forEach((other) => {
          other.open = false;
        });

        item.open = shouldOpen;
      });
    });
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

if (!window.customElements.get('landing-faq')) {
  window.customElements.define('landing-faq', LandingFaq);
}
