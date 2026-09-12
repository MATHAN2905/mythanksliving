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

    this.drawerLinks = this.drawer?.querySelectorAll('.landing-header__drawer-link') || [];
    if (this.drawerLinks.length) {
      this.drawerLinks.forEach((link) => {
        link.addEventListener('click', () => this.closeDrawer());
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
      window.addEventListener('scroll', () => this.syncStickyState(), { passive: true });
    }
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('keydown', this.onKeydown);
  }

  syncHeaderOffset() {
    const headerHeight = `${this.offsetHeight}px`;
    document.documentElement.style.setProperty('--landing-header-offset', headerHeight);
    document.body.style.setProperty('--landing-header-offset', headerHeight);
  }

  syncStickyState() {
    const threshold = Number(this.dataset.scrollThreshold || 8);
    if (window.scrollY > threshold) {
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
