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

  let activeUtterance = null;

  function stopSpeech() {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    activeUtterance = null;
  }

  function formatVerseSpeechText(verse) {
    if (!verse) return '';
    const body = String(verse.verse || '').replace(/^["']|["']$/g, '').trim();
    const reference = formatReference(verse.reference || '').trim();
    if (!body) return reference;
    return reference ? `${body}. ${reference}.` : `${body}.`;
  }

  const VOICE_PRESETS = {
    warm: {
      label: 'Warm',
      rate: 0.92,
      pitch: 1,
      match: (voice) => /samantha|karen|susan|victoria|aria|jenny|zira|hazel/i.test(voice.name),
    },
    calm: {
      label: 'Calm',
      rate: 0.85,
      pitch: 0.95,
      match: (voice) => /daniel|alex|fred|mark|guy|ryan/i.test(voice.name),
    },
    clear: {
      label: 'Clear',
      rate: 1,
      pitch: 1,
      match: (voice) => /google|natural|neural|online|microsoft|zira|david/i.test(voice.name),
    },
    deep: {
      label: 'Deep',
      rate: 0.88,
      pitch: 0.85,
      match: (voice) => /david|james|richard|brian|george|thomas|guy|ryan/i.test(voice.name),
    },
    serene: {
      label: 'Serene',
      rate: 0.8,
      pitch: 1.02,
      match: (voice) => /moira|tessa|samantha|karen|fiona|veena|allison/i.test(voice.name),
    },
    reverent: {
      label: 'Reverent',
      rate: 0.82,
      pitch: 0.92,
      match: (voice) => /daniel|arthur|tom|oliver|liam|jorge/i.test(voice.name),
    },
    narrator: {
      label: 'Narrator',
      rate: 0.9,
      pitch: 0.98,
      match: (voice) => /mark|guy|matthew|christopher|paul|google us english/i.test(voice.name),
    },
    pastoral: {
      label: 'Pastoral',
      rate: 0.86,
      pitch: 0.9,
      match: (voice) => /thomas|oliver|liam|aaron|nathan|evan/i.test(voice.name),
    },
    graceful: {
      label: 'Graceful',
      rate: 0.88,
      pitch: 1.05,
      lang: 'en-gb',
      match: (voice) => /kate|serena|martha|sonia|libby|hazel/i.test(voice.name),
    },
    british: {
      label: 'British',
      rate: 0.9,
      pitch: 1,
      lang: 'en-gb',
      match: (voice) => /uk|kate|george|daniel|serena|martha|libby|thomas|oliver/i.test(`${voice.name} ${voice.lang}`),
    },
    meditative: {
      label: 'Meditative',
      rate: 0.76,
      pitch: 0.94,
      match: (voice) => /samantha|daniel|karen|zira|moira|tessa|google/i.test(voice.name),
    },
    uplifting: {
      label: 'Uplifting',
      rate: 1.02,
      pitch: 1.08,
      match: (voice) => /aria|jenny|joanna|michelle|salli|ava|nicky/i.test(voice.name),
    },
    devotional: {
      label: 'Devotional',
      rate: 0.84,
      pitch: 0.98,
      match: (voice) => /flo|salli|ava|nicky|kendra|kimberly|susan/i.test(voice.name),
    },
    gentle_male: {
      label: 'Gentle male',
      rate: 0.87,
      pitch: 0.93,
      match: (voice) => /daniel|alex|tom|aaron|evan|liam|oliver/i.test(voice.name),
    },
    gentle_female: {
      label: 'Gentle female',
      rate: 0.86,
      pitch: 1.03,
      match: (voice) => /samantha|karen|susan|victoria|allison|moira|tessa/i.test(voice.name),
    },
    auto: {
      label: 'Automatic',
      rate: 0.92,
      pitch: 1,
      match: null,
    },
  };

  function getEnglishVoices(voices) {
    if (!Array.isArray(voices)) return [];
    return voices.filter((voice) => voice.lang?.toLowerCase().startsWith('en'));
  }

  function pickEnglishVoice(voices) {
    const englishVoices = getEnglishVoices(voices);
    if (englishVoices.length === 0) return voices[0] || null;

    const preferred = englishVoices.find((voice) => /google|natural|samantha|daniel|karen|zira|aria/i.test(voice.name));
    if (preferred) return preferred;

    const localEnglish = englishVoices.find((voice) => voice.localService);
    if (localEnglish) return localEnglish;

    return englishVoices[0] || voices[0] || null;
  }

  function resolveVoiceForPreset(voices, presetId) {
    const preset = VOICE_PRESETS[presetId] || VOICE_PRESETS.warm;
    let voicePool = getEnglishVoices(voices);

    if (preset.lang) {
      const langPool = voicePool.filter((voice) => voice.lang?.toLowerCase().startsWith(preset.lang.toLowerCase()));
      if (langPool.length) voicePool = langPool;
    }

    if (!preset.match) {
      return {
        voice: pickEnglishVoice(voicePool.length ? voicePool : voices),
        rate: preset.rate,
        pitch: preset.pitch,
      };
    }

    const matched = voicePool.find(preset.match);
    return {
      voice: matched || pickEnglishVoice(voicePool.length ? voicePool : voices),
      rate: preset.rate,
      pitch: preset.pitch,
    };
  }

  function waitForVoices(timeout = 2500) {
    return new Promise((resolve) => {
      const synth = window.speechSynthesis;
      if (!synth) {
        resolve([]);
        return;
      }

      const voices = synth.getVoices();
      if (voices.length) {
        resolve(voices);
        return;
      }

      const finish = () => {
        synth.removeEventListener('voiceschanged', onVoicesChanged);
        window.clearTimeout(timer);
        resolve(synth.getVoices());
      };

      const onVoicesChanged = () => {
        if (synth.getVoices().length) finish();
      };

      const timer = window.setTimeout(finish, timeout);
      synth.addEventListener('voiceschanged', onVoicesChanged);
    });
  }

  async function speakVerse(verse, options = {}) {
    const synth = window.speechSynthesis;
    if (!synth || typeof SpeechSynthesisUtterance === 'undefined') return false;

    const text = options.text || formatVerseSpeechText(verse);
    if (!text.trim()) return false;

    stopSpeech();

    const voices = await waitForVoices();
    const utterance = new SpeechSynthesisUtterance(text);
    const presetId = options.voicePreset || 'warm';
    const resolved = resolveVoiceForPreset(voices, presetId);

    utterance.lang = options.lang || 'en-US';
    utterance.rate = options.rate ?? resolved.rate;
    utterance.pitch = options.pitch ?? resolved.pitch;

    if (resolved.voice) utterance.voice = resolved.voice;

    utterance.onstart = () => options.onStart?.();
    utterance.onend = () => {
      if (activeUtterance === utterance) activeUtterance = null;
      options.onEnd?.();
    };
    utterance.onerror = () => {
      if (activeUtterance === utterance) activeUtterance = null;
      options.onError?.();
    };

    activeUtterance = utterance;
    synth.speak(utterance);
    return true;
  }

  function bindVerseActions(root, verse, options = {}) {
    const listenBtn = root.querySelector('[data-verse-listen]');
    const copyBtn = root.querySelector('[data-verse-copy]');
    const shareBtn = root.querySelector('[data-verse-share]');
    const shareText = formatVerseShareText(verse);
    const copyLabel = options.copyLabel || 'Copy scripture';
    const shareLabel = options.shareLabel || 'Share scripture';
    const listenLabel = options.listenLabel || 'Listen to scripture';
    let resetTimer;
    let isListening = false;

    const setListenState = (active) => {
      if (!listenBtn) return;
      isListening = active;
      listenBtn.classList.toggle('is-speaking', active);
      listenBtn.setAttribute('aria-pressed', active ? 'true' : 'false');
      listenBtn.setAttribute('aria-label', active ? 'Stop reading scripture' : listenLabel);
      listenBtn.setAttribute('title', active ? 'Stop' : 'Listen');
      const label = listenBtn.querySelector('[data-verse-action-label]');
      if (label) label.textContent = active ? 'Playing' : 'Listen';
    };

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

    if (listenBtn) {
      listenBtn.addEventListener('click', async () => {
        if (isListening) {
          stopSpeech();
          setListenState(false);
          return;
        }

        await speakVerse(verse, {
          voicePreset: options.voicePreset,
          onStart: () => setListenState(true),
          onEnd: () => setListenState(false),
          onError: () => setListenState(false),
        });
      });
    }

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
    formatVerseSpeechText,
    formatDisplayDate,
    fetchVerses,
    getTodayVerse,
    speakVerse,
    stopSpeech,
    resolveVoiceForPreset,
    VOICE_PRESETS,
    bindVerseActions
  };
})();
