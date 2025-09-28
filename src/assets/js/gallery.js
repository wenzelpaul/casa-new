(function () {
  const gallery = document.querySelector('[data-gallery]');
  const overlay = document.getElementById('lightbox');
  if (!gallery || !overlay) return;

  const imgs = Array.from(gallery.querySelectorAll('a.thumb'));
  const imgEl = overlay.querySelector('.lb-image');
  const capEl = overlay.querySelector('.lb-caption');
  const btnPrev = overlay.querySelector('.lb-prev');
  const btnNext = overlay.querySelector('.lb-next');
  const btnClose = overlay.querySelector('.lb-close');

  let index = 0;

  function show(i) {
    index = (i + imgs.length) % imgs.length;
    const a = imgs[index];
    const src = a.getAttribute('href');
    const caption = a.dataset.caption || '';
    imgEl.src = src;
    imgEl.alt = a.querySelector('img')?.alt || '';
    capEl.textContent = caption;
  }

  function open(i) {
    show(i);
    overlay.setAttribute('aria-hidden', 'false');
    document.addEventListener('keydown', onKey);
  }

  function close() {
    overlay.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', onKey);
  }

  function next() { show(index + 1); }
  function prev() { show(index - 1); }

  function onKey(e) {
    if (e.key === 'Escape') return close();
    if (e.key === 'ArrowRight') return next();
    if (e.key === 'ArrowLeft') return prev();
  }

  imgs.forEach((a, i) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      open(i);
    });
  });

  btnClose.addEventListener('click', close);
  btnNext.addEventListener('click', next);
  btnPrev.addEventListener('click', prev);

  // Close when clicking the backdrop (not the figure)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  // Touch/Swipe gesture support for mobile
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  const minSwipeDistance = 50; // Minimum distance for a swipe
  const maxVerticalSwipe = 100; // Maximum vertical movement to consider as horizontal swipe

  function onTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }

  function onTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Check if it's a horizontal swipe and not too much vertical movement
    if (absDeltaX > minSwipeDistance && absDeltaY < maxVerticalSwipe) {
      if (deltaX > 0) {
        // Swipe right - go to previous image
        prev();
      } else {
        // Swipe left - go to next image
        next();
      }
    }
  }

  // Add touch event listeners to the lightbox
  overlay.addEventListener('touchstart', onTouchStart);
  overlay.addEventListener('touchend', onTouchEnd);

  // Prevent default touch behavior to avoid conflicts
  overlay.addEventListener('touchmove', (e) => {
    e.preventDefault();
  }, { passive: false });
})();

// Mobile Navigation Scroll Indicator
(function() {
  const mobileNav = document.querySelector('.nav-mobile');
  const desktopNav = document.querySelector('.nav-desktop');

  if (!mobileNav || !desktopNav) return;

  function updateScrollIndicator() {
    const navWidth = mobileNav.clientWidth;
    const contentWidth = mobileNav.scrollWidth;

    if (contentWidth > navWidth) {
      // Show scrollbar when content is wider than container
      mobileNav.style.overflowX = 'auto';
      mobileNav.classList.add('nav-scrollable');
    } else {
      // Hide scrollbar when all content fits
      mobileNav.style.overflowX = 'hidden';
      mobileNav.classList.remove('nav-scrollable');
      mobileNav.scrollLeft = 0; // Reset to start position
    }
  }

  function createScrollIndicator() {
    // Show subtle scrollbar instead of dots
    mobileNav.style.scrollbarWidth = 'thin';
    mobileNav.style.scrollbarColor = 'var(--text-secondary) transparent';

    // Add custom scrollbar styles
    const style = document.createElement('style');
    style.textContent = `
      .nav-mobile::-webkit-scrollbar {
        height: 3px;
        display: block;
      }
      .nav-mobile::-webkit-scrollbar-track {
        background: transparent;
      }
      .nav-mobile::-webkit-scrollbar-thumb {
        background: var(--text-secondary);
        border-radius: 2px;
      }
      .nav-mobile::-webkit-scrollbar-thumb:hover {
        background: var(--text-primary);
      }
    `;
    document.head.appendChild(style);

    return { element: null, style }; // Return empty indicator since we're using scrollbar
  }

  // Remove auto-scroll functionality as requested

  // Check on load and resize
  updateScrollIndicator();
  window.addEventListener('resize', updateScrollIndicator);

  // Also check when navigation becomes visible (for responsive changes)
  const observer = new MutationObserver(updateScrollIndicator);
  observer.observe(desktopNav, { attributes: true, attributeFilter: ['style'] });

  // No auto-scroll functionality needed
})();
