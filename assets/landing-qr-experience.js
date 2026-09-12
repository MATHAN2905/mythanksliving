class LandingQrExperience extends HTMLElement {
  connectedCallback() {
    this.enableAnimation = this.dataset.animate === 'true';
    this.enablePulse = this.dataset.pulse === 'true';

    if (this.enableAnimation || this.enablePulse) {
      this.setupReveal();
    }

    this.copyButton = this.querySelector('[data-copy-qr-link]');
    this.copyStatus = this.querySelector('[data-copy-status]');
    this.qrUrl = this.dataset.qrUrl || '';

    if (this.copyButton) {
      this.copyButton.addEventListener('click', () => this.copyLink());
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
      { threshold: 0.22 }
    );

    this.revealObserver.observe(this);
  }

  async copyLink() {
    if (!this.qrUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(this.qrUrl);
      this.setCopyState('Copied', true);
    } catch (error) {
      this.setCopyState('Copy failed', false);
    }
  }

  setCopyState(text, success) {
    if (!this.copyButton) {
      return;
    }

    this.copyButton.textContent = text;
    this.copyButton.setAttribute('aria-pressed', success ? 'true' : 'false');

    if (this.copyStatus) {
      this.copyStatus.textContent = text;
    }

    window.setTimeout(() => {
      if (!this.copyButton) {
        return;
      }
      this.copyButton.textContent = this.copyButton.dataset.defaultText || 'Copy link';
      this.copyButton.setAttribute('aria-pressed', 'false');
      if (this.copyStatus) {
        this.copyStatus.textContent = '';
      }
    }, 1800);
  }
}

if (!window.customElements.get('landing-qr-experience')) {
  window.customElements.define('landing-qr-experience', LandingQrExperience);
}
