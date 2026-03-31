/* ===== main.js – Al Rehmat Container Terminal ===== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Navbar scroll effect ---------- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile hamburger menu ---------- */
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      hamburger.classList.toggle('is-open', isOpen);
    });

    /* Close on nav link click */
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Active nav link ---------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ---------- Smooth scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar ? navbar.offsetHeight + 16 : 80;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      }
    });
  });

  /* ---------- Quote / Contact form ---------- */
  const form = document.getElementById('quoteForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      /* Basic custom validation */
      const required = form.querySelectorAll('[required]');
      let valid = true;
      required.forEach(field => {
        field.style.borderColor = '';
        if (!field.value.trim()) {
          field.style.borderColor = '#dc3545';
          valid = false;
        }
      });
      if (!valid) return;

      const btn  = form.querySelector('button[type="submit"]');
      const succ = document.getElementById('formSuccess');
      const orig = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Sending…';

      /* Build a WhatsApp message from form data and redirect */
      const name    = (form.querySelector('#name')    || {}).value || '';
      const phone   = (form.querySelector('#phone')   || {}).value || '';
      const city    = (form.querySelector('#city')    || {}).value || '';
      const service = (form.querySelector('#service') || {}).value || '';
      const message = (form.querySelector('#message') || {}).value || '';
      const waText  = encodeURIComponent(
        `Hello Al Rehmat Container Terminal!\n\nName: ${name}\nPhone: ${phone}\nCity: ${city}\nService: ${service}\n\n${message}`
      );

      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = orig;
        if (succ) {
          succ.style.display = 'block';
          setTimeout(() => { succ.style.display = 'none'; }, 6000);
        }
        /* Open WhatsApp with pre-filled message */
        window.open(`https://wa.me/923008494431?text=${waText}`, '_blank', 'noopener');
        form.reset();
      }, 800);
    });
  }

  /* ---------- Scroll reveal animation ---------- */
  const revealEls = document.querySelectorAll('.service-card, .feature-card, .solution-card, .testimonial-card, .gallery-item, .team-card');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(el => {
      el.classList.add('reveal-pending');
      io.observe(el);
    });
  }

  /* ---------- Counter animation (hero stats) ---------- */
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (counters.length && 'IntersectionObserver' in window) {
    const counterIO = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        let current  = 0;
        const step   = Math.ceil(target / 60);
        const timer  = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = current + suffix;
        }, 25);
        counterIO.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterIO.observe(c));
  }

  /* ---------- Gallery lightbox (placeholder: open in new tab) ---------- */
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') item.click();
    });
  });

});
