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
})();
