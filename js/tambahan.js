document.addEventListener('DOMContentLoaded', () => {

    // ─── 1. FILTER PROYEK (otomatis membaca label kategori di tiap kartu) ───
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card');
    const groups = {
      'Machine Learning': 'ml',
      'Unsupervised Learning': 'ml',
      'Web Development': 'web',
      'AIOT': 'infra',
      'Synology Data Back-up': 'infra'
    };
    cards.forEach(c => {
      const badge = c.querySelector('.project-cat-badge');
      c.dataset.group = badge ? (groups[badge.textContent.trim()] || 'other') : 'other';
    });
    filterBtns.forEach(btn => btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.toggle('active', b === btn));
      const f = btn.dataset.filter;
      cards.forEach(c => c.classList.toggle('is-hidden', f !== 'all' && c.dataset.group !== f));
    }));
  
    // ─── 2. NAVIGASI GALERI PROYEK (panah, penghitung, tombol keyboard) ───
    const modal = document.getElementById('projectModal');
    const gallery = document.getElementById('projectGallery');
    const prev = document.getElementById('galleryPrev');
    const next = document.getElementById('galleryNext');
    const counter = document.getElementById('galleryCounter');
  
    if (modal && gallery && prev && next && counter) {
      const step = () => gallery.clientWidth * 0.8;
  
      const update = () => {
        const list = gallery.querySelectorAll('img');
        const multi = list.length > 1;
        prev.style.display = multi ? '' : 'none';
        next.style.display = multi ? '' : 'none';
        if (!list.length) { counter.textContent = ''; return; }
        const mid = gallery.scrollLeft + gallery.clientWidth / 2;
        let idx = 0, best = Infinity;
        list.forEach((im, i) => {
          const d = Math.abs(im.offsetLeft + im.offsetWidth / 2 - mid);
          if (d < best) { best = d; idx = i; }
        });
        counter.textContent = (idx + 1) + ' / ' + list.length;
      };
  
      prev.addEventListener('click', () => gallery.scrollBy({ left: -step(), behavior: 'smooth' }));
      next.addEventListener('click', () => gallery.scrollBy({ left: step(), behavior: 'smooth' }));
      gallery.addEventListener('scroll', update, { passive: true });
      gallery.addEventListener('load', update, true);
      new MutationObserver(() => { if (modal.classList.contains('show')) setTimeout(update, 60); })
        .observe(modal, { attributes: true, attributeFilter: ['class'] });
  
      document.addEventListener('keydown', e => {
        if (!modal.classList.contains('show')) return;
        if (e.key === 'ArrowRight') next.click();
        if (e.key === 'ArrowLeft') prev.click();
      });
    }
  
    // ─── 3. TOMBOL KEMBALI KE ATAS ───
    const toTop = document.getElementById('toTop');
    if (toTop) {
      window.addEventListener('scroll', () => toTop.classList.toggle('show', window.scrollY > 600), { passive: true });
      toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
  
    // ─── 4. LAZY LOADING GAMBAR (halaman lebih ringan; foto hero tetap langsung dimuat) ───
    document.querySelectorAll('img').forEach(img => {
      if (!img.closest('#hero')) img.loading = 'lazy';
    });
  });