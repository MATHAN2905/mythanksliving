class AiDailyVerse extends HTMLElement {
  connectedCallback() {
    this.setupVerse();
  }

  disconnectedCallback() {
    window.VerseOfTheDay?.stopSpeech?.();
    this.removeSpeechRetry?.();
  }

  removeSpeechRetry() {
    if (!this._speechRetryHandler) return;
    this.removeEventListener('pointerdown', this._speechRetryHandler);
    this.removeEventListener('keydown', this._speechRetryHandler);
    this._speechRetryHandler = null;
  }

  getSpeechOptions() {
    return {
      voicePreset: this.dataset.voicePreset || 'warm',
    };
  }

  bindSpeechRetry(verse) {
    this.removeSpeechRetry();

    this._speechRetryHandler = () => {
      window.VerseOfTheDay?.speakVerse?.(verse, this.getSpeechOptions());
      this.removeSpeechRetry();
    };

    this.addEventListener('pointerdown', this._speechRetryHandler, { passive: true });
    this.addEventListener('keydown', this._speechRetryHandler);
  }

  async speakLoadedVerse(api, verse) {
    if (this.dataset.autoSpeak !== 'true') return;

    await api.speakVerse(verse, this.getSpeechOptions());

    window.setTimeout(() => {
      const synth = window.speechSynthesis;
      if (!synth || synth.speaking || synth.pending) return;
      this.bindSpeechRetry(verse);
    }, 500);
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
      api.bindVerseActions(this, verse, this.getSpeechOptions());
      await this.speakLoadedVerse(api, verse);
    } catch (error) {
      const fallbackText = this.dataset.fallbackText || 'A life of gratitude transforms our hearts every day.';
      textEl.textContent = fallbackText;
      refEl.textContent = '';
      console.warn('[ai-daily-verse] Daily scripture failed:', error);

      if (this.dataset.autoSpeak === 'true') {
        await api.speakVerse?.({ verse: fallbackText, reference: '' }, this.getSpeechOptions());
      }
    }
  }
}

if (!window.customElements.get('ai-daily-verse')) {
  window.customElements.define('ai-daily-verse', AiDailyVerse);
}
