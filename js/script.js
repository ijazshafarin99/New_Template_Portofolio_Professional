// ─── NAV ───
const navbar = document.getElementById('navbar');
const navLinks = document.getElementById('navLinks');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 10), { passive: true });
document.getElementById('navToggle').addEventListener('click', () => navLinks.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// Menu aktif sesuai bagian yang sedang dilihat
const links = document.querySelectorAll('.nav-links a[href^="#"]');
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
links.forEach(a => { const s = document.querySelector(a.getAttribute('href')); if (s) spy.observe(s); });

// ─── REVEAL ───
const reveal = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); reveal.unobserve(e.target); } });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => reveal.observe(el));

// ─── SKILL BAR ───
const bars = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-bar-fill').forEach(b => b.style.width = b.dataset.width + '%');
      bars.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.skill-card').forEach(c => bars.observe(c));

// ─── CONTACT FORM (Netlify Forms) ───
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const note = document.getElementById('formNote');
  const btn = document.getElementById('formBtn');
  const label = btn.querySelector('span');
  const setNote = (msg, type) => { note.textContent = msg; note.className = 'form-note ' + type; };

  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) { setNote('Mohon isi semua field sebelum mengirim.', 'err'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setNote('Format email belum benar.', 'err'); return; }

    btn.disabled = true; label.textContent = 'Mengirim...'; setNote('', '');
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(contactForm)).toString()
      });
      if (!res.ok) throw new Error('gagal');
      contactForm.reset();
      setNote('Terima kasih! Pesan Anda sudah terkirim ke email saya. Saya akan segera membalas.', 'ok');
    } catch (err) {
      setNote('Pesan gagal terkirim. Silakan coba lagi atau hubungi langsung lewat ijaz.shafarin03@gmail.com.', 'err');
    } finally {
      btn.disabled = false; label.textContent = 'Send Message';
    }
  });
}

// ─── MODAL SERTIFIKAT ───
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('certModal');
  const modalImg = document.getElementById('modalImg');
  const closeBtn = document.getElementById('closeModalBtn');

  const close = () => {
    modal.classList.remove('show');
    document.body.style.overflow = '';
    setTimeout(() => { modalImg.src = ''; }, 250);
  };
  document.querySelectorAll('.cert-card').forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('.cert-img img');
      if (!img) return;
      modalImg.src = img.src; modalImg.alt = img.alt;
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    });
  });
  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });

  // ─── MODAL GALERI PROYEK ───
  const pModal = document.getElementById('projectModal');
  const gallery = document.getElementById('projectGallery');
  const pClose = document.getElementById('closeProjectModal');

  const closeP = () => {
    pModal.classList.remove('show');
    document.body.style.overflow = '';
    setTimeout(() => { gallery.innerHTML = ''; }, 250);
  };
  document.querySelectorAll('.project-img-trigger').forEach(t => {
    t.addEventListener('click', () => {
      const data = t.getAttribute('data-gallery');
      if (!data) return;
      gallery.innerHTML = '';
      data.split(',').forEach(src => {
        const img = document.createElement('img');
        img.src = src.trim(); img.alt = 'Project Detail'; img.loading = 'lazy';
        gallery.appendChild(img);
      });
      pModal.classList.add('show');
      document.body.style.overflow = 'hidden';
    });
  });
  pClose.addEventListener('click', closeP);
  pModal.addEventListener('click', e => { if (e.target === pModal) closeP(); });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (modal.classList.contains('show')) close();
    if (pModal.classList.contains('show')) closeP();
  });
});