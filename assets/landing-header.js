import { getScrollContainer, getScrollTop, getScrollEventTarget } from '@theme/scroll-container';
import { scrollIntoView } from '@theme/scrolling';

class LandingHeader extends HTMLElement {
  connectedCallback() {
    this.drawer =
      this.nextElementSibling?.matches?.('[data-landing-header-drawer]')
        ? this.nextElementSibling
        : this.querySelector('[data-drawer]');
    this.openButton = this.querySelector('[data-open-drawer]');
    this.closeButtons = this.drawer?.querySelectorAll('[data-close-drawer]') || [];
    this.stickyEnabled = this.dataset.sticky === 'true';

    this.syncHeaderOffset();
    this.onResize = () => this.syncHeaderOffset();
    window.addEventListener('resize', this.onResize, { passive: true });

    if (this.openButton && this.drawer) {
      this.openButton.addEventListener('click', () => this.openDrawer());
    }

    if (this.closeButtons.length && this.drawer) {
      this.closeButtons.forEach((button) => {
        button.addEventListener('click', () => this.closeDrawer());
      });
    }

    this.navLinks = [
      ...this.querySelectorAll('.landing-header__nav-link'),
      ...(this.drawer?.querySelectorAll('.landing-header__drawer-link') || []),
    ];
    if (this.navLinks.length) {
      this.navLinks.forEach((link) => {
        link.addEventListener('click', (event) => this.handleAnchorClick(event, link));
      });
    }

    this.onKeydown = (event) => {
      if (event.key === 'Escape' && this.drawer?.hasAttribute('open')) {
        this.closeDrawer();
      }
    };
    document.addEventListener('keydown', this.onKeydown);

    if (this.stickyEnabled) {
      this.syncStickyState();
      this.onScroll = () => this.syncStickyState();
      this.scrollTarget = getScrollEventTarget();
      this.scrollTarget.addEventListener('scroll', this.onScroll, { passive: true });
    }

    this.initHashScroll();
  }

  initHashScroll() {
    const scroll = () => this.scrollToCurrentHash({ behavior: 'instant' });

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', scroll, { once: true });
    } else {
      requestAnimationFrame(scroll);
    }
  }

  normalizePath(pathname) {
    return pathname.replace(/\/+$/, '') || '';
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('keydown', this.onKeydown);
    if (this.onScroll && this.scrollTarget) {
      this.scrollTarget.removeEventListener('scroll', this.onScroll);
    }
  }

  getScrollElement() {
    return getScrollContainer();
  }

  isHomePage() {
    const rootPath = this.normalizePath(this.dataset.rootPath || '/');
    const path = this.normalizePath(window.location.pathname);
    return path === rootPath;
  }

  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  scrollToHash(hash, { behavior = 'smooth' } = {}) {
    const id = hash.replace(/^#/, '');
    if (!id) return false;

    const target = document.getElementById(id);
    if (!target) return false;

    const container = this.getScrollElement();
    const ancestor =
      container instanceof Element && container !== document.documentElement && container !== document.body
        ? container
        : undefined;

    scrollIntoView(target, {
      ancestor,
      behavior: this.prefersReducedMotion() ? 'instant' : behavior,
      block: 'start',
    });

    return true;
  }

  scrollToCurrentHash({ behavior = 'smooth' } = {}) {
    if (!this.isHomePage() || !window.location.hash) return;

    requestAnimationFrame(() => {
      this.scrollToHash(window.location.hash, { behavior });
    });
  }

  handleAnchorClick(event, link) {
    const href = link.getAttribute('href');
    if (!href || !href.includes('#')) return;

    let url;

    try {
      url = new URL(href, window.location.origin);
    } catch (error) {
      return;
    }

    const hash = url.hash;
    if (!hash) return;

    const rootPath = this.normalizePath(this.dataset.rootPath || '/');
    const linkPath = this.normalizePath(url.pathname);
    const isSameHomeAnchor = this.isHomePage() && linkPath === rootPath;

    if (isSameHomeAnchor && this.scrollToHash(hash)) {
      event.preventDefault();
      history.replaceState(null, '', hash);
      this.closeDrawer();
    } else if (link.classList.contains('landing-header__drawer-link')) {
      this.closeDrawer();
    }
  }

  syncHeaderOffset() {
    const headerHeight = `${this.offsetHeight}px`;
    document.documentElement.style.setProperty('--landing-header-offset', headerHeight);
    document.body.style.setProperty('--landing-header-offset', headerHeight);
  }

  syncStickyState() {
    const threshold = Number(this.dataset.scrollThreshold || 8);
    const scrollTop = getScrollTop();

    if (scrollTop > threshold) {
      this.classList.add('is-scrolled');
    } else {
      this.classList.remove('is-scrolled');
    }
  }

  openDrawer() {
    if (!this.drawer) {
      return;
    }

    this.drawer.setAttribute('open', 'open');
    this.classList.add('is-drawer-open');
    document.documentElement.setAttribute('scroll-lock', '');
    this.openButton?.setAttribute('aria-expanded', 'true');
  }

  closeDrawer() {
    if (!this.drawer) {
      return;
    }

    this.drawer.removeAttribute('open');
    this.classList.remove('is-drawer-open');
    document.documentElement.removeAttribute('scroll-lock');
    this.openButton?.setAttribute('aria-expanded', 'false');
  }
}

if (!window.customElements.get('landing-header')) {
  window.customElements.define('landing-header', LandingHeader);
}
