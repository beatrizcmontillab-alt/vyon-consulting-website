/* =========================================
   VYON CONSULTING — main.js
   Vanilla JS — no dependencies
   ========================================= */

(function () {
  'use strict';

  /* ---- NAV: scroll shadow + mobile toggle ---- */
  const nav = document.getElementById('nav');
  const burger = document.querySelector('.nav__burger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const open = !mobileMenu.hidden;
      mobileMenu.hidden = open;
      burger.setAttribute('aria-expanded', String(!open));
      // Animate burger to X
      burger.classList.toggle('open', !open);
    });
    // Close on nav link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.hidden = true;
        burger.setAttribute('aria-expanded', 'false');
        burger.classList.remove('open');
      });
    });
  }

  /* ---- SECTOR TABS active state on scroll ---- */
  const sectorTabs = document.querySelectorAll('.sector-tab');
  if (sectorTabs.length) {
    const setActiveTab = () => {
      const scrollY = window.scrollY + window.innerHeight / 2;
      sectorTabs.forEach(tab => {
        const targetId = tab.getAttribute('href').replace('#', '');
        const target = document.getElementById(targetId);
        if (!target) return;
        const top = target.offsetTop;
        const bottom = top + target.offsetHeight;
        if (scrollY >= top && scrollY < bottom) {
          sectorTabs.forEach(t => { t.classList.remove('sector-tab--active'); t.removeAttribute('aria-selected'); });
          tab.classList.add('sector-tab--active');
          tab.setAttribute('aria-selected', 'true');
        }
      });
    };
    window.addEventListener('scroll', setActiveTab, { passive: true });
    setActiveTab();
  }

  /* ---- FILE DRAG & DROP ---- */
  const fileDrop = document.getElementById('file-drop');
  const fileInput = document.getElementById('file-input');
  const fileList = document.getElementById('file-list');

  if (fileDrop && fileInput && fileList) {
    const renderFiles = (files) => {
      fileList.innerHTML = '';
      Array.from(files).forEach(f => {
        const span = document.createElement('span');
        span.className = 'file-item';
        span.textContent = f.name;
        fileList.appendChild(span);
      });
    };

    fileInput.addEventListener('change', () => renderFiles(fileInput.files));

    fileDrop.addEventListener('dragover', e => {
      e.preventDefault();
      fileDrop.classList.add('dragover');
    });
    fileDrop.addEventListener('dragleave', () => fileDrop.classList.remove('dragover'));
    fileDrop.addEventListener('drop', e => {
      e.preventDefault();
      fileDrop.classList.remove('dragover');
      const dt = e.dataTransfer;
      if (dt && dt.files.length) {
        fileInput.files = dt.files; // works in most browsers
        renderFiles(dt.files);
      }
    });
  }

  /* ---- CONTACT FORM (static demo — no backend) ---- */
  const form = document.getElementById('assessment-form');
  const formSuccess = document.getElementById('form-success');

  if (form && formSuccess) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      // Basic validation
      const requiredFields = form.querySelectorAll('[required]');
      let valid = true;
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = '#ff4444';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });
      if (!valid) return;

      // Simulate submission
      const submitBtn = form.querySelector('[type="submit"]');
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      fetch(form.action, {
  method: 'POST',
  body: new FormData(form),
  headers: { 'Accept': 'application/json' }
})
.then(res => {
  if (res.ok) {
    form.reset();
    if (document.getElementById('file-list')) document.getElementById('file-list').innerHTML = '';
    formSuccess.hidden = false;
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
})
.finally(() => {
  submitBtn.textContent = 'Request Technical Assessment';
  submitBtn.disabled = false;
});
    });

    // Clear error colour on input
    form.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('input', () => { field.style.borderColor = ''; });
    });
  }

  /* ---- INTERSECTION OBSERVER: fade-in on scroll ---- */
  if ('IntersectionObserver' in window) {
    const fadeEls = document.querySelectorAll('.card, .service-card, .sector-card, .office, .tenet, .ta-feature, .faq__item');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transition = `opacity .5s ease ${i * 0.06}s, transform .5s ease ${i * 0.06}s`;
      io.observe(el);
    });
  }

  /* ---- SIMULATION STATUS: live latency ticker ---- */
  const latencyEl = document.querySelector('.hero__status .mono:last-child');
  if (latencyEl && latencyEl.textContent.includes('LATENCY')) {
    setInterval(() => {
      const ms = (Math.random() * 6 + 9).toFixed(0);
      latencyEl.textContent = `LATENCY: ${ms}MS`;
    }, 3000);
  }

})();
