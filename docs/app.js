document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.sidebar-link');
  const pages = document.querySelectorAll('.page');
  const categoryLabels = document.querySelectorAll('.sidebar-category-label');

  function navigateTo(pageId) {
    pages.forEach(p => p.classList.remove('active'));
    links.forEach(l => l.classList.remove('active'));

    const target = document.getElementById(pageId);
    if (target) {
      target.classList.add('active');
      document.querySelector('.main-content').scrollTop = 0;
    }

    links.forEach(l => {
      if (l.dataset.page === pageId) l.classList.add('active');
    });

    history.replaceState(null, '', '#' + pageId);
  }

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(link.dataset.page);
    });

    link.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        navigateTo(link.dataset.page);
      }
    });
  });

  categoryLabels.forEach(label => {
    label.addEventListener('click', () => {
      label.closest('.sidebar-category').classList.toggle('collapsed');
    });
    label.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        label.closest('.sidebar-category').classList.toggle('collapsed');
      }
    });
  });

  document.querySelectorAll('.main-content a[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(link.dataset.page);
    });
  });

  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.closest('.code-block').querySelector('code').textContent;
      navigator.clipboard.writeText(code).then(() => {
        btn.textContent = 'Copied';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 1500);
      });
    });
  });

  // --- Carousel ---
  document.querySelectorAll('[data-carousel]').forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const viewport = carousel.querySelector('.carousel-viewport');
    const prevBtn = carousel.querySelector('[data-carousel-prev]');
    const nextBtn = carousel.querySelector('[data-carousel-next]');
    const fill = carousel.querySelector('[data-carousel-fill]');
    if (!track || !viewport || !prevBtn || !nextBtn || !fill) return;

    let index = 0;

    function getItems() {
      return Array.from(track.children);
    }

    function getItemWidth() {
      const items = getItems();
      if (!items.length) return 0;
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      return items[0].offsetWidth + gap;
    }

    function maxIndex() {
      const items = getItems();
      if (!items.length) return 0;
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      const totalWidth = items.reduce((sum, el) => sum + el.offsetWidth, 0) + gap * (items.length - 1);
      const visibleWidth = viewport.offsetWidth;
      if (totalWidth <= visibleWidth) return 0;
      const maxScroll = totalWidth - visibleWidth;
      const itemStep = getItemWidth();
      return itemStep > 0 ? Math.ceil(maxScroll / itemStep) : 0;
    }

    function update() {
      const itemStep = getItemWidth();
      const max = maxIndex();
      index = Math.max(0, Math.min(index, max));
      track.style.transform = 'translateX(' + (-index * itemStep) + 'px)';

      if (index <= 0) {
        prevBtn.classList.add('is-disabled');
        prevBtn.setAttribute('disabled', '');
      } else {
        prevBtn.classList.remove('is-disabled');
        prevBtn.removeAttribute('disabled');
      }

      if (index >= max) {
        nextBtn.classList.add('is-disabled');
        nextBtn.setAttribute('disabled', '');
      } else {
        nextBtn.classList.remove('is-disabled');
        nextBtn.removeAttribute('disabled');
      }

      const items = getItems();
      if (items.length <= 1 || max <= 0) {
        fill.style.left = '0%';
        fill.style.width = '100%';
      } else {
        const pct = index / max;
        const segmentWidth = 100 / items.length;
        fill.style.width = segmentWidth + '%';
        fill.style.left = (pct * (100 - segmentWidth)) + '%';
      }
    }

    prevBtn.addEventListener('click', () => { index--; update(); });
    nextBtn.addEventListener('click', () => { index++; update(); });

    update();
    window.addEventListener('resize', () => update());
  });

  const hash = window.location.hash.slice(1);
  if (hash && document.getElementById(hash)) {
    navigateTo(hash);
  } else {
    navigateTo('introduction');
  }
});
