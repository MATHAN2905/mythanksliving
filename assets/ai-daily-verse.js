class AiDailyVerse extends HTMLElement {
  connectedCallback() {
    this.setupVerse();
  }

  async setupVerse() {
    const api = window.VerseOfTheDay;
    if (!api) return;

    const url = this.dataset.versesUrl;
    const textEl = this.querySelector('[data-verse-text]');
    const refEl = this.querySelector('[data-verse-reference]');
    const dateEl = this.querySelector('[data-verse-date-text]');
    const root = this.querySelector('[data-verse-root]');

    if (!url || !textEl || !refEl || !root) return;

    if (dateEl) {
      dateEl.textContent = api.formatDisplayDate();
    }

    try {
      const verse = await api.getTodayVerse(url);
      if (!verse) throw new Error('No verses available');

      textEl.textContent = `"${verse.verse}"`;
      refEl.textContent = api.formatReference(verse.reference);
      root.classList.add('is-loaded');
      api.bindVerseActions(this, verse);
    } catch (error) {
      textEl.textContent = this.dataset.fallbackText || 'A life of gratitude transforms our hearts every day.';
      refEl.textContent = '';
      console.warn('[ai-daily-verse] Daily scripture failed:', error);
    }
  }
}

if (!window.customElements.get('ai-daily-verse')) {
  window.customElements.define('ai-daily-verse', AiDailyVerse);
}
