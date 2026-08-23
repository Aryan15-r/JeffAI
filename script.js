function onNavClick() {}

function T(id) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('open');
}

// Progress + BTT
window.addEventListener('scroll', () => {
  const fill = document.getElementById('progress-fill');
  const btt = document.getElementById('btt');
  const s = window.scrollY;
  const h = document.documentElement.scrollHeight - window.innerHeight;
  if (fill && h > 0) fill.style.width = (s / h * 100) + '%';
  if (btt) btt.classList.toggle('visible', s > 400);
}, { passive: true });

// Active nav
const secs = document.querySelectorAll('.section[id]');
const links = document.querySelectorAll('.nav-link');
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const id = e.target.id;
      links.forEach(a => {
        const active = a.getAttribute('href') === '#' + id;
        a.classList.toggle('active', active);
        if (active) a.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      });
    }
  });
}, { threshold: 0.12, rootMargin: '-104px 0px -50% 0px' });
secs.forEach(s => obs.observe(s));

// Smooth scroll with header offset
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const h = this.getAttribute('href');
    if (h === '#') { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const t = document.querySelector(h);
    if (t) { e.preventDefault(); window.scrollTo({ top: t.offsetTop - 104, behavior: 'smooth' }); }
  });
});

window.addEventListener('beforeprint', () => {
  document.querySelectorAll('.topic').forEach(t => t.classList.add('open'));
});

// ── Scroll reveal observer (fixed) ──
const revealEls = document.querySelectorAll('.topic, .pyq, .hots, .tip, .mnem, .formula, .kp');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('revealed');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.01, rootMargin: '0px 0px 0px 0px' });
revealEls.forEach(el => {
  revealObs.observe(el);
});


// ── Bottom nav active on scroll ──
const btmBtns = document.querySelectorAll('.btm-nav-btn[href]');
const tnavLinks = document.querySelectorAll('.tnav-link[href]');

const btmObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const id = '#' + e.target.id;
      btmBtns.forEach(b => b.classList.toggle('bn-active', b.getAttribute('href') === id));
      tnavLinks.forEach(a => {
        const active = a.getAttribute('href') === id;
        a.classList.toggle('tnav-active', active);
        if (active) {
          // scroll topnav so active link is visible
          const tn = document.getElementById('topnav');
          if (tn) {
            const rect = a.getBoundingClientRect();
            const tnRect = tn.getBoundingClientRect();
            if (rect.left < tnRect.left + 20 || rect.right > tnRect.right - 20) {
              a.scrollIntoView({ inline: 'nearest', behavior: 'smooth', block: 'nearest' });
            }
          }
        }
      });
    }
  });
}, { threshold: 0.15, rootMargin: '-104px 0px -50% 0px' });

document.querySelectorAll('.section[id]').forEach(s => btmObs.observe(s));

// smooth scroll on bottom nav taps
[...btmBtns, ...tnavLinks].forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href && href.startsWith('#')) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 104; // header (60px) + topnav (44px)
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      }
    }
  });
});

// ── Section in-view tracker ──
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    e.target.classList.toggle('in-view', e.isIntersecting);
  });
}, { threshold: 0.1 });
document.querySelectorAll('.section').forEach(s => sectionObserver.observe(s));

// ── Click-to-select code blocks ──
document.querySelectorAll('pre').forEach(pre => {
  pre.addEventListener('click', () => {
    const sel = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(pre);
    sel.removeAllRanges();
    sel.addRange(range);
  });
});

// ── Reading time estimator ──
(function() {
  const words = document.body.innerText.split(/\s+/).length;
  const mins = Math.ceil(words / 200);
  const sub = document.querySelector('.hdr-sub');
  if (sub) {
    sub.title = 'Estimated reading time: ' + mins + ' min';
  }
})();

// ── Topnav scroll arrow buttons ──
(function() {
  const nav = document.getElementById('topnav');
  const leftBtn = document.getElementById('tnav-left');
  const rightBtn = document.getElementById('tnav-right');
  if (!nav || !leftBtn || !rightBtn) return;

  const STEP = 180;

  function updateArrows() {
    const atStart = nav.scrollLeft <= 4;
    const atEnd = nav.scrollLeft >= nav.scrollWidth - nav.clientWidth - 4;
    leftBtn.classList.toggle('tnav-arrow-hidden', atStart);
    rightBtn.classList.toggle('tnav-arrow-hidden', atEnd);
  }

  leftBtn.addEventListener('click', () => {
    nav.scrollBy({ left: -STEP, behavior: 'smooth' });
  });
  rightBtn.addEventListener('click', () => {
    nav.scrollBy({ left: STEP, behavior: 'smooth' });
  });

  nav.addEventListener('scroll', updateArrows, { passive: true });
  window.addEventListener('resize', updateArrows);
  updateArrows();
})();