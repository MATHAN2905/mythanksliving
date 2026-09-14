(function () {
  function getDayOfYear(date = new Date()) {
    const start = new Date(date.getFullYear(), 0, 0);
    return Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }

  function getVerseOfTheDay(verses, date = new Date()) {
    if (!Array.isArray(verses) || verses.length === 0) return null;
    return verses[getDayOfYear(date) % verses.length];
  }

  function formatReference(reference) {
    if (!reference) return '';
    return reference.replace(/\bPs\./gi, 'PSALM').toUpperCase();
  }

  function formatVerseShareText(verse) {
    if (!verse) return '';
    return `${verse.verse} — ${verse.reference}`;
  }

  function formatDisplayDate(date = new Date(), locale = 'en-US') {
    return date.toLocaleDateString(locale, {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }

  let versesCache = null;
  let versesPromise = null;

  async function fetchVerses(url) {
    if (versesCache) return versesCache;
    if (!versesPromise) {
      versesPromise = fetch(url, { credentials: 'same-origin' })
        .then((response) => {
          if (!response.ok) throw new Error(`Failed to load verses.json (${response.status})`);
          return response.json();
        })
        .then((data) => {
          versesCache = data;
          return data;
        })
        .catch((error) => {
          versesPromise = null;
          throw error;
        });
    }
    return versesPromise;
  }

  async function getTodayVerse(url, date = new Date()) {
    const verses = await fetchVerses(url);
    return getVerseOfTheDay(verses, date);
  }

  function bindVerseActions(root, verse, options = {}) {
    const copyBtn = root.querySelector('[data-verse-copy]');
    const shareBtn = root.querySelector('[data-verse-share]');
    const shareText = formatVerseShareText(verse);
    const copyLabel = options.copyLabel || 'Copy scripture';
    const shareLabel = options.shareLabel || 'Share scripture';
    let resetTimer;

    const setButtonFeedback = (button, message, resetMessage, defaultLabel) => {
      if (!button) return;
      button.classList.add('is-copied');
      button.setAttribute('aria-label', message);
      button.setAttribute('title', message);
      const label = button.querySelector('[data-verse-action-label], .landing-benefits__verse-action-label');
      if (label) label.textContent = message;

      if (resetTimer) window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(() => {
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
          setButtonFeedback(copyBtn, 'Copied', copyLabel, 'Copy');
        } catch (error) {
          console.warn('[verse-of-the-day] Copy failed:', error);
        }
      });
    }

    if (shareBtn) {
      shareBtn.addEventListener('click', async () => {
        const shareData = {
          title: options.shareTitle || 'Daily Thanksgiving Scripture',
          text: shareText,
          url: window.location.href
        };

        try {
          if (navigator.share) {
            await navigator.share(shareData);
            return;
          }

          await navigator.clipboard.writeText(shareText);
          setButtonFeedback(shareBtn, 'Copied', shareLabel, 'Share');
        } catch (error) {
          if (error?.name !== 'AbortError') {
            console.warn('[verse-of-the-day] Share failed:', error);
          }
        }
      });
    }
  }

  window.VerseOfTheDay = {
    getDayOfYear,
    getVerseOfTheDay,
    formatReference,
    formatVerseShareText,
    formatDisplayDate,
    fetchVerses,
    getTodayVerse,
    bindVerseActions
  };
})();
