import { getScrollContainer } from '@theme/scroll-container';
import { scrollIntoView } from '@theme/scrolling';

function normalizePath(pathname) {
  return pathname.replace(/\/+$/, '') || '';
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isHomePage(rootPath = '/') {
  const root = normalizePath(rootPath);
  const path = normalizePath(window.location.pathname);
  return path === root;
}

function scrollToHash(hash, { behavior = 'smooth' } = {}) {
  const id = hash.replace(/^#/, '');
  if (!id) return false;

  const target = document.getElementById(id);
  if (!target) return false;

  const container = getScrollContainer();
  const ancestor =
    container instanceof Element && container !== document.documentElement && container !== document.body
      ? container
      : undefined;

  scrollIntoView(target, {
    ancestor,
    behavior: prefersReducedMotion() ? 'instant' : behavior,
    block: 'start',
  });

  return true;
}

function handleLandingAnchorClick(event, link, rootPath = '/') {
  const href = link.getAttribute('href');
  if (!href || !href.includes('#')) return false;

  let url;

  try {
    url = new URL(href, window.location.origin);
  } catch (error) {
    return false;
  }

  const hash = url.hash;
  if (!hash) return false;

  const root = normalizePath(rootPath || '/');
  const linkPath = normalizePath(url.pathname);
  const isSameHomeAnchor = isHomePage(rootPath) && linkPath === root;

  if (isSameHomeAnchor && scrollToHash(hash)) {
    event.preventDefault();
    history.replaceState(null, '', hash);
    return true;
  }

  return false;
}

function initLandingHashScroll(rootPath = '/') {
  if (!isHomePage(rootPath) || !window.location.hash) return;

  const scroll = () => scrollToHash(window.location.hash, { behavior: 'instant' });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scroll, { once: true });
  } else {
    requestAnimationFrame(scroll);
  }
}

function bindLandingAnchorLinks(container, { rootPath = '/', selector = 'a[href*="#"]' } = {}) {
  const links = container.querySelectorAll(selector);

  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      handleLandingAnchorClick(event, link, rootPath);
    });
  });

  return links;
}

export {
  bindLandingAnchorLinks,
  handleLandingAnchorClick,
  initLandingHashScroll,
  isHomePage,
  normalizePath,
  scrollToHash,
};
