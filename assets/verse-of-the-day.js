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

  const MALE_VOICE_PATTERN =
    /\b(male|david|mark|guy|ryan|daniel|alex|fred|thomas|james|richard|brian|george|arthur|tom|oliver|liam|aaron|nathan|evan|christopher|paul|matthew|davis|jorge|andrew|benjamin|gordon|lee)\b/i;

  const FEMALE_VOICE_PATTERN =
    /\b(female|samantha|karen|susan|victoria|aria|jenny|zira|hazel|moira|tessa|fiona|kate|serena|martha|sonia|libby|allison|veena|flo|salli|ava|nicky|kendra|kimberly|michelle|joanna|linda|heather|laura)\b/i;

  const VOICE_PRESETS = {
    warm: {
      label: 'Warm',
      rate: 0.92,
      pitch: 1,
      gender: 'female',
      match: (voice) => matchesVoiceLabel(voice, /samantha|karen|susan|victoria|aria|jenny|zira|hazel/i),
    },
    calm: {
      label: 'Calm',
      rate: 0.85,
      pitch: 0.95,
      gender: 'male',
      match: (voice) => matchesVoiceLabel(voice, /daniel|alex|fred|mark|guy|ryan|david|davis/i),
    },
    clear: {
      label: 'Clear',
      rate: 1,
      pitch: 1,
      match: (voice) => matchesVoiceLabel(voice, /google|natural|neural|online|microsoft/i),
    },
    deep: {
      label: 'Deep',
      rate: 0.88,
      pitch: 0.85,
      gender: 'male',
      match: (voice) => matchesVoiceLabel(voice, /david|james|richard|brian|george|thomas|guy|ryan|davis|mark/i),
    },
    serene: {
      label: 'Serene',
      rate: 0.8,
      pitch: 1.02,
      gender: 'female',
      match: (voice) => matchesVoiceLabel(voice, /moira|tessa|samantha|karen|fiona|veena|allison/i),
    },
    reverent: {
      label: 'Reverent',
      rate: 0.82,
      pitch: 0.92,
      gender: 'male',
      match: (voice) => matchesVoiceLabel(voice, /daniel|arthur|tom|oliver|liam|jorge|david|george/i),
    },
    narrator: {
      label: 'Narrator',
      rate: 0.9,
      pitch: 0.98,
      gender: 'male',
      match: (voice) => matchesVoiceLabel(voice, /mark|guy|matthew|christopher|paul|david|ryan|microsoft.*english.*male/i),
    },
    pastoral: {
      label: 'Pastoral',
      rate: 0.86,
      pitch: 0.9,
      gender: 'male',
      match: (voice) => matchesVoiceLabel(voice, /thomas|oliver|liam|aaron|nathan|evan|george|david/i),
    },
    graceful: {
      label: 'Graceful',
      rate: 0.88,
      pitch: 1.05,
      lang: 'en-gb',
      gender: 'female',
      match: (voice) => matchesVoiceLabel(voice, /kate|serena|martha|sonia|libby|hazel/i),
    },
    british: {
      label: 'British',
      rate: 0.9,
      pitch: 1,
      lang: 'en-gb',
      match: (voice) => matchesVoiceLabel(voice, /en-gb|uk english|united kingdom|kate|george|daniel|serena|martha|libby|thomas|oliver/i),
    },
    meditative: {
      label: 'Meditative',
      rate: 0.76,
      pitch: 0.94,
      match: (voice) => matchesVoiceLabel(voice, /samantha|daniel|karen|zira|moira|tessa|google/i),
    },
    uplifting: {
      label: 'Uplifting',
      rate: 1.02,
      pitch: 1.08,
      gender: 'female',
      match: (voice) => matchesVoiceLabel(voice, /aria|jenny|joanna|michelle|salli|ava|nicky/i),
    },
    devotional: {
      label: 'Devotional',
      rate: 0.84,
      pitch: 0.98,
      gender: 'female',
      match: (voice) => matchesVoiceLabel(voice, /flo|salli|ava|nicky|kendra|kimberly|susan/i),
    },
    gentle_male: {
      label: 'Gentle male',
      rate: 0.87,
      pitch: 0.93,
      gender: 'male',
      match: (voice) => isMaleVoice(voice),
    },
    gentle_female: {
      label: 'Gentle female',
      rate: 0.86,
      pitch: 1.03,
      gender: 'female',
      match: (voice) => isFemaleVoice(voice),
    },
    auto: {
      label: 'Automatic',
      rate: 0.92,
      pitch: 1,
      match: null,
    },
  };

  function getVoiceLabel(voice) {
    return `${voice?.name || ''} ${voice?.lang || ''} ${voice?.voiceURI || ''}`.trim();
  }

  function matchesVoiceLabel(voice, pattern) {
    return pattern.test(getVoiceLabel(voice));
  }

  function getVoiceGender(voice) {
    const label = getVoiceLabel(voice).toLowerCase();

    if (/gender:female|gender_female|\+female\b|\bfemale\b|\bwoman\b/.test(label)) return 'female';
    if (/gender:male|gender_male|\+male\b|\bmale\b|\bman\b/.test(label)) return 'male';
    if (FEMALE_VOICE_PATTERN.test(label) && !/\bmale\b/.test(label)) return 'female';
    if (MALE_VOICE_PATTERN.test(label)) return 'male';

    return 'unknown';
  }

  function isMaleVoice(voice) {
    return getVoiceGender(voice) === 'male';
  }

  function isFemaleVoice(voice) {
    return getVoiceGender(voice) === 'female';
  }

  function getEnglishVoices(voices) {
    if (!Array.isArray(voices)) return [];
    return voices.filter((voice) => voice.lang?.toLowerCase().startsWith('en'));
  }

  function rankVoiceQuality(voice) {
    const label = getVoiceLabel(voice).toLowerCase();
    let score = 0;

    if (/google|microsoft|natural|neural|online/.test(label)) score += 4;
    if (voice.localService) score += 2;
    if (voice.default) score += 1;

    return score;
  }

  function pickBestFromPool(voicePool) {
    if (!voicePool.length) return null;

    return [...voicePool].sort((a, b) => rankVoiceQuality(b) - rankVoiceQuality(a))[0];
  }

  function pickVoiceByGender(voices, gender) {
    const pool = getEnglishVoices(voices);
    if (!pool.length) return null;

    const matching = pool.filter((voice) => getVoiceGender(voice) === gender);
    return pickBestFromPool(matching);
  }

  function pickEnglishVoice(voices) {
    const englishVoices = getEnglishVoices(voices);
    if (englishVoices.length === 0) return voices[0] || null;

    return pickBestFromPool(englishVoices);
  }

  function resolveVoiceForPreset(voices, presetId) {
    const preset = VOICE_PRESETS[presetId] || VOICE_PRESETS.warm;
    const allEnglishVoices = getEnglishVoices(voices);
    let voicePool = allEnglishVoices.length ? allEnglishVoices : voices;

    if (preset.lang) {
      const langPool = voicePool.filter((voice) => voice.lang?.toLowerCase().startsWith(preset.lang.toLowerCase()));
      if (langPool.length) voicePool = langPool;
    }

    let matched = preset.match ? voicePool.find(preset.match) : null;

    if (!matched && preset.gender) {
      matched = pickVoiceByGender(voicePool, preset.gender);
    }

    if (!matched && preset.gender) {
      matched = pickVoiceByGender(allEnglishVoices.length ? allEnglishVoices : voices, preset.gender);
    }

    if (!matched && !preset.match) {
      matched = pickEnglishVoice(voicePool);
    }

    if (!matched && preset.gender) {
      matched = pickVoiceByGender(voices, preset.gender);
    }

    if (!matched && !preset.gender) {
      matched = pickEnglishVoice(voicePool.length ? voicePool : voices);
    }

    return {
      voice: matched,
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

    if (synth.paused) synth.resume();

    const voices = await waitForVoices();
    const freshVoices = synth.getVoices();
    const voiceList = freshVoices.length ? freshVoices : voices;
    const utterance = new SpeechSynthesisUtterance(text);
    const presetId = options.voicePreset || 'warm';
    const resolved = resolveVoiceForPreset(voiceList, presetId);

    utterance.lang = resolved.voice?.lang || options.lang || 'en-US';
    utterance.rate = options.rate ?? resolved.rate;
    utterance.pitch = options.pitch ?? resolved.pitch;

    if (resolved.voice) {
      const liveVoice =
        voiceList.find((voice) => voice.voiceURI === resolved.voice.voiceURI) ||
        voiceList.find((voice) => voice.name === resolved.voice.name) ||
        resolved.voice;
      utterance.voice = liveVoice;
    }

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
