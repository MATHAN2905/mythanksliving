class LandingAuthorSection extends HTMLElement {
  connectedCallback() {
    this.enableAnimation = this.dataset.animate === 'true';
    this.enableFloat = this.dataset.float === 'true';

    if (this.enableAnimation) {
      this.setupReveal();
    }

    if (this.enableFloat) {
      this.setupFloatEffect();
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

  setupFloatEffect() {
    const media = this.querySelector('.landing-author-section__media');
    const portrait = this.querySelector('.landing-author-section__portrait-wrap');

    if (!media || !portrait || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    media.addEventListener('mousemove', (event) => {
      const rect = media.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      portrait.style.transform = `translateY(-3px) rotateX(${(y * -1.8).toFixed(2)}deg) rotateY(${(x * 1.8).toFixed(2)}deg)`;
    });

    media.addEventListener('mouseleave', () => {
      portrait.style.transform = '';
    });
  }
}

if (!window.customElements.get('landing-author-section')) {
  window.customElements.define('landing-author-section', LandingAuthorSection);
}
