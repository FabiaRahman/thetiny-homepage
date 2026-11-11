/* ===== thetiny.site homepage — interactions ===== */

/* ---------- 1. Mobile menu ---------- */
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const iconOpen = document.getElementById('iconOpen');
const iconClose = document.getElementById('iconClose');

function toggleMenu(forceClose = false) {
  const isOpen = !mobileMenu.classList.contains('hidden');
  const shouldClose = forceClose || isOpen;
  mobileMenu.classList.toggle('hidden', shouldClose);
  iconOpen.classList.toggle('hidden', !shouldClose);
  iconClose.classList.toggle('hidden', shouldClose);
  menuBtn.setAttribute('aria-expanded', String(!shouldClose));
}
menuBtn.addEventListener('click', () => toggleMenu());
document.querySelectorAll('.mobile-link').forEach(link =>
  link.addEventListener('click', () => toggleMenu(true))
);

/* ---------- 2. Back-to-top (header stays shadow-free) ---------- */
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => {
  toTop.classList.toggle('show', window.scrollY > 500);
}, { passive: true });
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ---------- 3. Count-up animation for stats ---------- */
function runCounter(el) {
  const target = parseFloat(el.dataset.target);
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1500;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = (target * eased).toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ---------- 4. Trigger counters + dashboard bars on view ---------- */
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    if (entry.target.classList.contains('stats')) {
      entry.target.querySelectorAll('.counter').forEach(runCounter);
    }
    if (entry.target.id === 'premium') {
      entry.target.querySelectorAll('.bar-fill')
        .forEach(bar => { bar.style.width = bar.dataset.width; });
    }
    animObserver.unobserve(entry.target);
  });
}, { threshold: 0.2 });

document.querySelectorAll('.stats, #premium').forEach(el => animObserver.observe(el));

/* ---------- 5. Copy-to-clipboard with feedback ---------- */
const toast = document.getElementById('toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  }
}

document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    const ok = await copyText(btn.dataset.copy);
    showToast(ok ? 'Link copied to clipboard!' : 'Copy failed — please copy manually.');
    if (ok) {
      const original = btn.textContent;
      btn.textContent = 'Copied!';
      btn.classList.add('text-emerald-600');
      setTimeout(() => { btn.textContent = original; btn.classList.remove('text-emerald-600'); }, 1600);
    }
  });
});

/* ---------- 6. QR code modal ---------- */
const qrModal = document.getElementById('qrModal');
const qrImg = document.getElementById('qrImg');
const qrUrl = document.getElementById('qrUrl');
const qrDownload = document.getElementById('qrDownload');
const qrClose = document.getElementById('qrClose');

function openQr(url) {
  const src = 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=' + encodeURIComponent(url);
  qrImg.src = src;
  qrUrl.textContent = url;
  qrDownload.href = src + '&download=1';
  qrModal.classList.remove('hidden');
  qrModal.classList.add('flex');
  document.body.style.overflow = 'hidden';
  qrClose.focus();
}

function closeQr() {
  qrModal.classList.add('hidden');
  qrModal.classList.remove('flex');
  document.body.style.overflow = '';
}

document.querySelectorAll('.qr-btn').forEach(btn =>
  btn.addEventListener('click', () => openQr(btn.dataset.qr))
);
qrClose.addEventListener('click', closeQr);
document.getElementById('qrBackdrop').addEventListener('click', closeQr);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeQr(); });

/* ---------- 7. Scrollspy ---------- */
const navLinks = document.querySelectorAll('.nav-link');
const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link =>
      link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id)
    );
  });
}, { rootMargin: '-40% 0px -55% 0px' });

['popular', 'pricing', 'testimonials', 'features'].forEach(id => {
  const section = document.getElementById(id);
  if (section) spyObserver.observe(section);
});

/* ---------- Auto year in footer ---------- */
document.getElementById('year').textContent = new Date().getFullYear();