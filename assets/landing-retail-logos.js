class LandingRetailLogos extends HTMLElement {
  connectedCallback() {
    this.isSlider = this.dataset.mobileSlider === 'true';
    if (!this.isSlider) {
      return;
    }

    this.track = this.querySelector('[data-track]');
    this.dots = this.querySelectorAll('[data-dot]');

    if (!this.track || this.dots.length === 0) {
      return;
    }

    this.handleScroll = this.handleScroll.bind(this);
    this.track.addEventListener('scroll', this.handleScroll, { passive: true });

    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        const cards = this.querySelectorAll('[data-card]');
        const card = cards[index];
        if (!card) return;
        this.track.scrollTo({ left: card.offsetLeft - this.track.offsetLeft, behavior: 'smooth' });
      });
    });

    this.handleScroll();
  }

  handleScroll() {
    const cards = this.querySelectorAll('[data-card]');
    if (!cards.length) {
      return;
    }

    let active = 0;
    let minDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const distance = Math.abs(card.offsetLeft - this.track.scrollLeft);
      if (distance < minDistance) {
        minDistance = distance;
        active = index;
      }
    });

    this.dots.forEach((dot, index) => {
      dot.setAttribute('aria-current', String(index === active));
    });
  }
}

if (!window.customElements.get('landing-retail-logos')) {
  window.customElements.define('landing-retail-logos', LandingRetailLogos);
}
