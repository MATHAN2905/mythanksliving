const ICON_SVG = {
  bible:
    '<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M24 5v3M24 40v3M9 11l2.6 2.6M36.4 34.4 39 37M5.5 24h3M39.5 24h3M9 37l2.6-2.6M36.4 13.6 39 11" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" opacity="0.4"/><path d="M24 37V14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M24 14C16.5 14 10.5 16.5 8.5 20.5V35c3-2.2 8.2-3.5 15.5-3.5S36.5 32.8 39.5 35V20.5C37.5 16.5 31.5 14 24 14Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M24 14c7.5 0 13.5 2.5 15.5 6.5V35c-3-2.2-8.2-3.5-15.5-3.5S11.5 32.8 8.5 35V20.5C10.5 16.5 16.5 14 24 14Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M24 17.5v8M20.5 21.5h7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M13.5 25h6M13.5 28.5h5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity="0.45"/><path d="M28.5 25H34.5M29.5 28.5h5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity="0.45"/></svg>'
};

class LandingBenefits extends HTMLElement {
  connectedCallback() {
    this.setupReveal();
    this.setupVerseOfTheDay();
  }

  disconnectedCallback() {
    this.observer?.disconnect();
  }

  setupReveal() {
    const shouldAnimate = this.dataset.animate === 'true';
    if (!shouldAnimate) {
      this.classList.add('is-ready');
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
      { threshold: 0.2 }
    );

    this.observer.observe(this);
  }

  async setupVerseOfTheDay() {
    if (this.dataset.verseOfDay !== 'true') return;

    const api = window.VerseOfTheDay;
    if (!api) return;

    const root = this.querySelector('[data-verse-root]');
    const textEl = this.querySelector('[data-verse-text]');
    const refEl = this.querySelector('[data-verse-reference]');
    const categoryEl = this.querySelector('[data-verse-category]');
    const iconEl = this.querySelector('[data-verse-icon]');
    const url = this.dataset.versesUrl;

    if (!root || !textEl || !refEl || !categoryEl || !iconEl || !url) return;

    try {
      const verse = await api.getTodayVerse(url);
      if (!verse) throw new Error('No verses available');

      textEl.textContent = `"${verse.verse}"`;
      refEl.textContent = api.formatReference(verse.reference);
      categoryEl.textContent = verse.category;
      categoryEl.hidden = true;
      iconEl.innerHTML = ICON_SVG.bible;
      root.dataset.category = verse.category;
      root.classList.add('is-loaded');
      api.bindVerseActions(this, verse);
    } catch (error) {
      textEl.textContent = 'A life of gratitude transforms our hearts every day.';
      refEl.textContent = '';
      categoryEl.hidden = true;
      console.warn('[landing-benefits] Daily scripture failed:', error);
    }
  }
}

if (!window.customElements.get('landing-benefits')) {
  window.customElements.define('landing-benefits', LandingBenefits);
}
