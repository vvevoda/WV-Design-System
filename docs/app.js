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

  const hash = window.location.hash.slice(1);
  if (hash && document.getElementById(hash)) {
    navigateTo(hash);
  } else {
    navigateTo('introduction');
  }
});
