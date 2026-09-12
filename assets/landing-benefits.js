const ICON_SVG = {
  bible:
    '<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M24 5v3M24 40v3M9 11l2.6 2.6M36.4 34.4 39 37M5.5 24h3M39.5 24h3M9 37l2.6-2.6M36.4 13.6 39 11" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" opacity="0.4"/><path d="M24 37V14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M24 14C16.5 14 10.5 16.5 8.5 20.5V35c3-2.2 8.2-3.5 15.5-3.5S36.5 32.8 39.5 35V20.5C37.5 16.5 31.5 14 24 14Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M24 14c7.5 0 13.5 2.5 15.5 6.5V35c-3-2.2-8.2-3.5-15.5-3.5S11.5 32.8 8.5 35V20.5C10.5 16.5 16.5 14 24 14Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M24 17.5v8M20.5 21.5h7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M13.5 25h6M13.5 28.5h5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity="0.45"/><path d="M28.5 25H34.5M29.5 28.5h5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity="0.45"/></svg>',
  'hand-heart':
    '<svg viewBox="0 0 24 24" fill="none"><path d="M8.5 11.5c-1.8-1.7-4.6-1.2-5.6.9-.8 1.6-.1 3.5 1.4 4.3L12 20l7.7-3.3c1.5-.8 2.2-2.7 1.4-4.3-1-2.1-3.8-2.6-5.6-.9L12 14.2 8.5 11.5Z" fill="currentColor"/><path d="M7 8.5c0-2 1.6-3.5 3.5-3.5 1.1 0 2.1.5 2.5 1.3.4-.8 1.4-1.3 2.5-1.3 1.9 0 3.5 1.5 3.5 3.5 0 .4-.1.8-.2 1.1" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  music:
    '<svg viewBox="0 0 24 24" fill="none"><path d="M9 18a3 3 0 1 1-2-2.83V6.5L19 4v8.67A3 3 0 1 1 17 15.5V8.2L9 9.7V18Z" fill="currentColor"/></svg>',
  cross:
    '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3v18M7 9h10" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
  'praying-hands':
    '<svg viewBox="0 0 24 24" fill="none"><path d="M10 20c-1.5-2-2.5-4.2-2.5-6.5V7.5A2.5 2.5 0 0 1 10 5c.8 0 1.5.4 2 1 .5-.6 1.2-1 2-1a2.5 2.5 0 0 1 2.5 2.5v6c0 2.3-1 4.5-2.5 6.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 6v5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  dove: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 14c2.2-1.2 4-1.5 6-1 1.2-2.8 3.8-4.8 7.2-5.2.4 1.7-.1 3.4-1.2 4.6 2.1.3 3.8 1.2 5 2.6-2.4.2-4.5-.2-6.2-1.2-1.5 1.8-3.6 3-6.2 3.4L4 14Z" fill="currentColor"/></svg>',
  heart:
    '<svg viewBox="0 0 24 24" fill="none"><path d="M12 20.2s-6.5-4.3-8.7-8a5 5 0 0 1 8.1-5.6l.6.7.6-.7a5 5 0 0 1 8.1 5.6c-2.2 3.7-8.7 8-8.7 8Z" fill="currentColor"/></svg>',
  'olive-branch':
    '<svg viewBox="0 0 24 24" fill="none"><path d="M4 18c5-1 9-4 12-8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M10 8c1.2-1.8 3-3 5.2-3.5-.2 2.2-1.3 4-3 5.2M14 12c1.1-1.5 2.6-2.6 4.4-3.1-.1 1.9-1 3.4-2.4 4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  sunrise:
    '<svg viewBox="0 0 24 24" fill="none"><path d="M4 16h16M6.5 16a5.5 5.5 0 0 1 11 0M12 5v3M5.5 9.5l2 2M18.5 9.5l-2 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  church:
    '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3v3M10.5 4.5h3M8 10l4-3 4 3v10H8V10Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M11 20v-4h2v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  crown:
    '<svg viewBox="0 0 24 24" fill="none"><path d="M4 16 6.5 8l3.5 4L12 6l2 6 3.5-4L20 16H4Z" fill="currentColor"/><path d="M5 18h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
};

function getDayOfYear(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getVerseOfTheDay(verses, date = new Date()) {
  if (!Array.isArray(verses) || verses.length === 0) return null;
  return verses[getDayOfYear(date) % verses.length];
}

function formatVerseShareText(verse) {
  if (!verse) return '';
  return `${verse.verse} — ${verse.reference}`;
}

class LandingBenefits extends HTMLElement {
  connectedCallback() {
    this.setupReveal();
    this.setupVerseOfTheDay();
  }

  disconnectedCallback() {
    this.observer?.disconnect();
    this.copyResetTimer && window.clearTimeout(this.copyResetTimer);
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

  setupVerseActions(verse) {
    const copyBtn = this.querySelector('[data-verse-copy]');
    const shareBtn = this.querySelector('[data-verse-share]');
    const shareText = formatVerseShareText(verse);

    const setButtonFeedback = (button, message, resetMessage, defaultLabel = 'Copy') => {
      if (!button) return;
      button.classList.add('is-copied');
      button.setAttribute('aria-label', message);
      button.setAttribute('title', message);
      const label = button.querySelector('.landing-benefits__verse-action-label');
      if (label) label.textContent = message;

      this.copyResetTimer && window.clearTimeout(this.copyResetTimer);
      this.copyResetTimer = window.setTimeout(() => {
        button.classList.remove('is-copied');
        button.setAttribute('aria-label', resetMessage);
        button.setAttribute('title', resetMessage);
        if (label) label.textContent = defaultLabel;
      }, 1800);
    };

    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(shareText);
          setButtonFeedback(copyBtn, 'Copied', 'Copy scripture', 'Copy');
        } catch (error) {
          console.warn('[landing-benefits] Copy failed:', error);
        }
      });
    }

    if (shareBtn) {
      shareBtn.addEventListener('click', async () => {
        const shareData = {
          title: 'Daily Thanksgiving Scripture',
          text: shareText,
          url: window.location.href
        };

        try {
          if (navigator.share) {
            await navigator.share(shareData);
            return;
          }

          await navigator.clipboard.writeText(shareText);
          setButtonFeedback(shareBtn, 'Copied', 'Share scripture', 'Share');
        } catch (error) {
          if (error?.name !== 'AbortError') {
            console.warn('[landing-benefits] Share failed:', error);
          }
        }
      });
    }
  }

  formatReference(reference) {
    if (!reference) return '';
    return reference.replace(/\bPs\./gi, 'PSALM').toUpperCase();
  }

  async setupVerseOfTheDay() {
    if (this.dataset.verseOfDay !== 'true') return;

    const root = this.querySelector('[data-verse-root]');
    const textEl = this.querySelector('[data-verse-text]');
    const refEl = this.querySelector('[data-verse-reference]');
    const categoryEl = this.querySelector('[data-verse-category]');
    const iconEl = this.querySelector('[data-verse-icon]');
    const url = this.dataset.versesUrl;

    if (!root || !textEl || !refEl || !categoryEl || !iconEl || !url) return;

    try {
      const response = await fetch(url, { credentials: 'same-origin' });
      if (!response.ok) throw new Error(`Failed to load verses.json (${response.status})`);
      const verses = await response.json();
      const verse = getVerseOfTheDay(verses);

      if (!verse) throw new Error('No verses available');

      textEl.textContent = `"${verse.verse}"`;
      refEl.textContent = this.formatReference(verse.reference);
      categoryEl.textContent = verse.category;
      categoryEl.hidden = true;
      iconEl.innerHTML = ICON_SVG.bible;
      root.dataset.category = verse.category;
      root.classList.add('is-loaded');
      this.setupVerseActions(verse);
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
