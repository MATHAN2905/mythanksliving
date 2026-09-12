class LandingTestimonials extends HTMLElement {
  connectedCallback() {
    this.viewport = this.querySelector('.landing-testimonials__viewport');
    this.track = this.querySelector('[data-track]');
    this.cards = Array.from(this.querySelectorAll('[data-slide]'));
    this.prevButton = this.querySelector('[data-prev]');
    this.nextButton = this.querySelector('[data-next]');
    this.dots = Array.from(this.querySelectorAll('[data-dot]'));

    this.enableAnimation = this.dataset.animate === 'true';
    this.autoplay = this.dataset.autoplay === 'true';
    this.intervalMs = parseInt(this.dataset.interval || '5000', 10);

    this.index = 0;
    this.perView = this.resolvePerView();
    this.pages = this.resolvePages();
    this.isDragging = false;

    if (this.enableAnimation) {
      this.setupReveal();
    } else {
      this.classList.add('is-ready');
    }

    this.bindEvents();
    this.bindSwipe();
    this.update();

    if (this.autoplay && this.pages > 1) {
      this.startAutoplay();
    }
  }

  disconnectedCallback() {
    this.stopAutoplay();
    window.removeEventListener('resize', this.onResize);
  }

  bindEvents() {
    if (this.prevButton) {
      this.prevButton.addEventListener('click', () => this.goTo(this.index - 1));
    }

    if (this.nextButton) {
      this.nextButton.addEventListener('click', () => this.goTo(this.index + 1));
    }

    this.dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const target = parseInt(dot.dataset.dot || '0', 10);
        this.goTo(target);
      });
    });

    this.onResize = () => {
      const nextPerView = this.resolvePerView();
      const perViewChanged = nextPerView !== this.perView;

      if (perViewChanged) {
        this.perView = nextPerView;
        this.pages = this.resolvePages();
        this.index = Math.min(this.index, this.pages - 1);
      }

      this.update();
    };

    window.addEventListener('resize', this.onResize);
  }

  bindSwipe() {
    if (!this.viewport || !this.track || this.cards.length < 2) {
      return;
    }

    let startX = 0;
    let startY = 0;
    let isHorizontal = null;
    let activePointerId = null;

    const getPageWidth = () => this.viewport.clientWidth || 1;

    const getSwipeThreshold = () => Math.min(72, getPageWidth() * 0.14);

    const onStart = (clientX, clientY, pointerId = null) => {
      if (this.pages < 2) {
        return;
      }

      this.stopAutoplay();
      this.isDragging = true;
      startX = clientX;
      startY = clientY;
      isHorizontal = null;
      activePointerId = pointerId;
      this.viewport.classList.add('is-dragging');
      this.track.style.transition = 'none';
    };

    const onMove = (clientX, clientY, event) => {
      if (!this.isDragging) {
        return;
      }

      const deltaX = clientX - startX;
      const deltaY = clientY - startY;

      if (isHorizontal === null && (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8)) {
        isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);
      }

      if (!isHorizontal) {
        return;
      }

      if (event?.cancelable) {
        event.preventDefault();
      }

      const pageWidth = getPageWidth();
      const minOffset = -pageWidth * (this.pages - 1);
      let nextOffset = -pageWidth * this.index + deltaX;

      if (nextOffset > 0) {
        nextOffset *= 0.35;
      } else if (nextOffset < minOffset) {
        nextOffset = minOffset + (nextOffset - minOffset) * 0.35;
      }

      this.track.style.transform = `translate3d(${nextOffset}px, 0, 0)`;
    };

    const onEnd = (clientX) => {
      if (!this.isDragging) {
        return;
      }

      this.isDragging = false;
      activePointerId = null;
      this.viewport.classList.remove('is-dragging');
      this.track.style.transition = '';

      const deltaX = clientX - startX;
      const threshold = getSwipeThreshold();

      if (isHorizontal && deltaX <= -threshold) {
        this.goTo(this.index + 1, { restartAutoplay: true });
      } else if (isHorizontal && deltaX >= threshold) {
        this.goTo(this.index - 1, { restartAutoplay: true });
      } else {
        this.update();
        if (this.autoplay && this.pages > 1) {
          this.startAutoplay();
        }
      }
    };

    this.viewport.addEventListener(
      'touchstart',
      (event) => {
        if (event.touches.length !== 1) {
          return;
        }
        onStart(event.touches[0].clientX, event.touches[0].clientY);
      },
      { passive: true }
    );

    this.viewport.addEventListener(
      'touchmove',
      (event) => {
        if (event.touches.length !== 1) {
          return;
        }
        onMove(event.touches[0].clientX, event.touches[0].clientY, event);
      },
      { passive: false }
    );

    this.viewport.addEventListener('touchend', (event) => {
      if (!event.changedTouches.length) {
        return;
      }
      onEnd(event.changedTouches[0].clientX);
    });

    this.viewport.addEventListener('touchcancel', (event) => {
      if (!event.changedTouches.length) {
        return;
      }
      onEnd(event.changedTouches[0].clientX);
    });

    this.viewport.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) {
        return;
      }
      onStart(event.clientX, event.clientY, event.pointerId);
      if (this.isDragging && this.viewport.setPointerCapture) {
        this.viewport.setPointerCapture(event.pointerId);
      }
    });

    this.viewport.addEventListener('pointermove', (event) => {
      if (activePointerId !== null && event.pointerId !== activePointerId) {
        return;
      }
      onMove(event.clientX, event.clientY, event);
    });

    this.viewport.addEventListener('pointerup', (event) => {
      if (activePointerId !== null && event.pointerId !== activePointerId) {
        return;
      }
      if (this.viewport.hasPointerCapture?.(event.pointerId)) {
        this.viewport.releasePointerCapture(event.pointerId);
      }
      onEnd(event.clientX);
    });

    this.viewport.addEventListener('pointercancel', (event) => {
      if (activePointerId !== null && event.pointerId !== activePointerId) {
        return;
      }
      onEnd(event.clientX);
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

  resolvePerView() {
    const mobile = parseInt(this.dataset.mobileCols || '1', 10);
    const tablet = parseInt(this.dataset.tabletCols || '2', 10);
    const desktop = parseInt(this.dataset.desktopCols || '3', 10);

    if (window.matchMedia('(max-width: 749px)').matches) {
      return mobile;
    }

    if (window.matchMedia('(max-width: 989px)').matches) {
      return tablet;
    }

    return desktop;
  }

  resolvePages() {
    if (!this.cards.length || this.perView < 1) {
      return 1;
    }

    return Math.max(1, Math.ceil(this.cards.length / this.perView));
  }

  getPageWidth() {
    return this.viewport?.clientWidth || this.track?.clientWidth || 0;
  }

  goTo(target, options = {}) {
    const { restartAutoplay = false } = options;

    if (this.pages < 2) {
      this.index = 0;
      this.update();
      return;
    }

    this.index = Math.max(0, Math.min(target, this.pages - 1));
    this.update();

    if (restartAutoplay && this.autoplay) {
      this.startAutoplay();
    }
  }

  update() {
    if (!this.track) {
      return;
    }

    const pageWidth = this.getPageWidth();
    const offset = pageWidth * this.index;
    this.track.style.transform = `translate3d(-${offset}px, 0, 0)`;

    this.dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === this.index);
      dot.setAttribute('aria-current', i === this.index ? 'true' : 'false');
    });

    if (this.prevButton) {
      this.prevButton.disabled = this.index <= 0;
    }

    if (this.nextButton) {
      this.nextButton.disabled = this.index >= this.pages - 1;
    }
  }

  startAutoplay() {
    this.stopAutoplay();

    this.timer = window.setInterval(() => {
      if (this.pages < 2 || this.isDragging) {
        return;
      }

      const next = this.index >= this.pages - 1 ? 0 : this.index + 1;
      this.index = next;
      this.update();
    }, Math.max(2000, this.intervalMs));
  }

  stopAutoplay() {
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  }
}

if (!window.customElements.get('landing-testimonials')) {
  window.customElements.define('landing-testimonials', LandingTestimonials);
}
