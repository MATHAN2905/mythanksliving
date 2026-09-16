import { bindLandingAnchorLinks } from '@theme/landing-anchor';

class LandingFooter extends HTMLElement {
  connectedCallback() {
    this.enableAnimation = this.dataset.animate === 'true';

    if (this.enableAnimation) {
      this.setupReveal();
    }

    this.syncYear();
    bindLandingAnchorLinks(this, {
      rootPath: this.dataset.rootPath,
      selector: '.landing-footer__link',
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

  syncYear() {
    const nowYear = String(new Date().getFullYear());
    this.querySelectorAll('[data-current-year]').forEach((el) => {
      el.textContent = nowYear;
    });
  }
}

if (!window.customElements.get('landing-footer')) {
  window.customElements.define('landing-footer', LandingFooter);
}
