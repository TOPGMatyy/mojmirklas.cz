/* mojmirklas.cz — interactive layer */
(function () {
  'use strict';

  /* ── HAMBURGER ─────────────────────────────────────────────── */
  const hbg = document.getElementById('hamburger');
  const mm  = document.getElementById('mobileMenu');
  if (hbg && mm) {
    hbg.addEventListener('click', () => {
      const open = mm.classList.toggle('open');
      const s = hbg.querySelectorAll('span');
      s[0].style.transform = open ? 'rotate(45deg) translate(5px,6px)' : '';
      s[1].style.opacity   = open ? '0' : '1';
      s[2].style.transform = open ? 'rotate(-45deg) translate(5px,-6px)' : '';
      hbg.setAttribute('aria-expanded', open);
    });
    // Close on outside click
    document.addEventListener('click', e => {
      if (!hbg.contains(e.target) && !mm.contains(e.target)) {
        mm.classList.remove('open');
        const s = hbg.querySelectorAll('span');
        s[0].style.transform = s[2].style.transform = '';
        s[1].style.opacity = '1';
      }
    });
  }

  /* ── FAQ ACCORDION ─────────────────────────────────────────── */
  function initFAQ() {
    const items = document.querySelectorAll('.item.question');
    if (!items.length) return;

    items.forEach(item => {
      const title = item.querySelector('.title');
      if (!title) return;

      // Wrap the +/– icon inside the title if not already present
      if (!title.querySelector('.faq-icon')) {
        const icon = document.createElement('span');
        icon.className = 'faq-icon';
        title.appendChild(icon);
      }

      // Hide answer by default
      const answer = item.querySelector('.answerBlock');
      if (answer) answer.style.display = 'none';

      title.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close all
        items.forEach(i => {
          i.classList.remove('open');
          const a = i.querySelector('.answerBlock');
          if (a) a.style.display = 'none';
        });
        // Open clicked (if it was closed)
        if (!isOpen) {
          item.classList.add('open');
          if (answer) answer.style.display = 'block';
        }
      });
    });
  }
  initFAQ();

  /* ── SCROLL PROGRESS BAR ───────────────────────────────────── */
  const bar = document.getElementById('progress-bar');
  if (bar) {
    const onScroll = () => {
      const h = document.documentElement;
      const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      bar.style.width = Math.min(pct, 100) + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── BACK TO TOP ───────────────────────────────────────────── */
  const btt = document.getElementById('back-to-top');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── SCROLL REVEAL ─────────────────────────────────────────── */
  function initReveal() {
    const targets = document.querySelectorAll(
      '.page-content, .product, .article, .item.question, .sidebar-card, .photo118 a, .contact-form-info, .contact-form'
    );
    if (!('IntersectionObserver' in window) || !targets.length) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -32px 0px' });

    targets.forEach((el, i) => {
      el.classList.add('reveal');
      // Stagger cards
      if (el.matches('.product, .article, .item.question')) {
        const siblings = Array.from(el.parentElement.children);
        const idx = siblings.indexOf(el) % 4;
        if (idx > 0) el.classList.add('reveal-delay-' + idx);
      }
      obs.observe(el);
    });
  }
  initReveal();

  /* ── NAVBAR SHRINK ON SCROLL ───────────────────────────────── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          navbar.style.boxShadow = window.scrollY > 10
            ? '0 2px 30px rgba(0,0,0,.38)'
            : '0 1px 0 rgba(255,255,255,.06), 0 4px 24px rgba(0,0,0,.28)';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── FORM HANDLER ──────────────────────────────────────────── */
  window.handleForm = function (e) {
    e.preventDefault();
    const btn = e.target.querySelector('.form-submit');
    const success = document.getElementById('formSuccess');
    if (btn) { btn.textContent = 'Odesílám…'; btn.disabled = true; }
    setTimeout(() => {
      if (success) { success.style.display = 'flex'; }
      if (btn) { btn.textContent = 'Odeslat zprávu'; btn.disabled = false; }
      e.target.reset();
    }, 800);
  };

  /* ── PHOTO LIGHTBOX (minimal) ──────────────────────────────── */
  function initLightbox() {
    const photos = document.querySelectorAll('.photo118 a.photo');
    if (!photos.length) return;

    // Build overlay
    const overlay = document.createElement('div');
    overlay.id = 'lb-overlay';
    overlay.style.cssText = 'display:none;position:fixed;inset:0;z-index:9999;background:rgba(5,12,24,.92);' +
      'display:none;align-items:center;justify-content:center;cursor:zoom-out;backdrop-filter:blur(4px)';
    const img = document.createElement('img');
    img.style.cssText = 'max-width:90vw;max-height:88vh;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,.6);object-fit:contain';
    const close = document.createElement('button');
    close.textContent = '✕';
    close.style.cssText = 'position:absolute;top:20px;right:24px;background:none;border:none;color:#fff;font-size:1.6rem;cursor:pointer;line-height:1;padding:4px 8px;';
    overlay.appendChild(img);
    overlay.appendChild(close);
    document.body.appendChild(overlay);

    const open = (src, alt) => {
      img.src = src; img.alt = alt || '';
      overlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    };
    const closeLB = () => {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    };
    overlay.addEventListener('click', e => { if (e.target === overlay) closeLB(); });
    close.addEventListener('click', closeLB);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLB(); });

    photos.forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        const thumbImg = a.querySelector('img');
        if (thumbImg) {
          // Try to get a larger version by replacing thumb URL
          const src = thumbImg.src;
          open(src, thumbImg.alt);
        }
      });
    });
  }
  initLightbox();

  /* ── VYHLEDÁVÁNÍ – Google site search ─────────────────────── */
  const searchForms = document.querySelectorAll('#fulltextSearch, .search-form');
  searchForms.forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input[name="text"], .search-input');
      const q = input ? input.value.trim() : '';
      if (!q) return;
      window.open('https://www.google.com/search?q=site:mojmirklas.cz+' + encodeURIComponent(q), '_blank');
    });
  });

  /* ── COPY TO CLIPBOARD on contact links ────────────────────── */
  document.querySelectorAll('.contact-info-sb a[href^="mailto:"], .contact-info-sb a[href^="tel:"]').forEach(a => {
    a.title = 'Kliknutím zkopírujete';
    a.addEventListener('click', e => {
      const text = a.textContent.trim();
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          const orig = a.textContent;
          a.textContent = '✓ Zkopírováno';
          setTimeout(() => { a.textContent = orig; }, 1800);
        }).catch(() => {});
      }
    });
  });

})();
