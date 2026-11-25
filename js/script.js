/* =================================================================
   Equilibra Mente Espaço — Psicologia
   JavaScript puro (Vanilla JS) — mesma organização do site de referência
   ================================================================= */

/* Número do WhatsApp usado no formulário (somente dígitos, com 55 + DDD) */
var WHATSAPP_NUMBER = '5500000000000';

document.addEventListener('DOMContentLoaded', function () {

  /* ---------------------------------------------------------------
     1. HEADER — fundo e compactação ao rolar
     --------------------------------------------------------------- */
  var header = document.getElementById('header');

  function updateHeaderOnScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  }
  updateHeaderOnScroll();
  window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });


  /* ---------------------------------------------------------------
     2. MENU MOBILE
     --------------------------------------------------------------- */
  var menuToggle = document.getElementById('menuToggle');
  var mobileMenu = document.getElementById('mobileMenu');
  var mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
  var mobileMenuLinks = document.querySelectorAll('.mobile-menu__link, .mobile-menu__cta');

  function openMobileMenu() {
    mobileMenu.classList.add('is-open');
    mobileMenuOverlay.classList.add('is-open');
    menuToggle.classList.add('is-active');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Fechar menu');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('is-open');
    mobileMenuOverlay.classList.remove('is-open');
    menuToggle.classList.remove('is-active');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
  }

  menuToggle.addEventListener('click', function () {
    mobileMenu.classList.contains('is-open') ? closeMobileMenu() : openMobileMenu();
  });
  mobileMenuOverlay.addEventListener('click', closeMobileMenu);
  mobileMenuLinks.forEach(function (link) { link.addEventListener('click', closeMobileMenu); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) closeMobileMenu();
  });


  /* ---------------------------------------------------------------
     3. SCROLL SUAVE (compensa a altura do header fixo)
     --------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = link.getAttribute('href');
      if (targetId.length > 1) {
        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          var offset = targetId === '#inicio' ? 0 : header.offsetHeight - 1;
          var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      }
    });
  });


  /* ---------------------------------------------------------------
     4. LINK ATIVO NO MENU CONFORME A SEÇÃO VISÍVEL
     --------------------------------------------------------------- */
  var navLinks = document.querySelectorAll('.nav__link');
  var sections = Array.prototype.map.call(navLinks, function (l) {
    return document.querySelector(l.getAttribute('href'));
  });

  function updateActiveLink() {
    var pos = window.scrollY + window.innerHeight * 0.35;
    var current = 0;
    sections.forEach(function (sec, i) { if (sec && sec.offsetTop <= pos) current = i; });
    navLinks.forEach(function (l, i) { l.classList.toggle('is-active', i === current); });
  }
  updateActiveLink();
  window.addEventListener('scroll', updateActiveLink, { passive: true });


  /* ---------------------------------------------------------------
     5. ANIMAÇÕES DE ENTRADA (IntersectionObserver)
     --------------------------------------------------------------- */
  var animatedEls = document.querySelectorAll('[data-animate]');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, index) {
        if (entry.isIntersecting) {
          var el = entry.target;
          setTimeout(function () { el.classList.add('is-visible'); }, (index % 3) * 80);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    animatedEls.forEach(function (el) { observer.observe(el); });
  } else {
    animatedEls.forEach(function (el) { el.classList.add('is-visible'); });
  }


  /* ---------------------------------------------------------------
     6. PERGUNTAS FREQUENTES (acordeão — abre uma por vez)
     --------------------------------------------------------------- */
  var faqItems = document.querySelectorAll('.faq__item');
  faqItems.forEach(function (item) {
    var btn = item.querySelector('.faq__question');
    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');
      faqItems.forEach(function (other) {
        other.classList.remove('is-open');
        other.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });


  /* ---------------------------------------------------------------
     7. FORMULÁRIO — valida e envia a mensagem pelo WhatsApp
     --------------------------------------------------------------- */
  var form = document.getElementById('contactForm');

  if (form) {
    var fields = {
      name: { input: document.getElementById('name'), error: document.getElementById('nameError') },
      email: { input: document.getElementById('email'), error: document.getElementById('emailError') },
      phone: { input: document.getElementById('phone'), error: document.getElementById('phoneError') },
      message: { input: document.getElementById('message'), error: document.getElementById('messageError') }
    };
    var feedback = document.getElementById('formFeedback');

    function showError(field, message) {
      fields[field].input.classList.add('is-invalid');
      fields[field].error.textContent = message;
    }
    function clearError(field) {
      fields[field].input.classList.remove('is-invalid');
      fields[field].error.textContent = '';
    }
    function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
    function isValidPhone(v) { var d = v.replace(/\D/g, ''); return d.length >= 10 && d.length <= 11; }

    function validateField(field) {
      var value = fields[field].input.value.trim();
      if (field === 'name' && value.length < 3) { showError('name', 'Digite seu nome completo.'); return false; }
      if (field === 'email' && !isValidEmail(value)) { showError('email', 'Digite um e-mail válido.'); return false; }
      if (field === 'phone' && !isValidPhone(value)) { showError('phone', 'Digite um telefone válido com DDD.'); return false; }
      if (field === 'message' && value.length < 10) { showError('message', 'Escreva uma mensagem com pelo menos 10 caracteres.'); return false; }
      clearError(field);
      return true;
    }

    // Máscara simples de telefone: (00) 00000-0000
    fields.phone.input.addEventListener('input', function () {
      var d = this.value.replace(/\D/g, '').slice(0, 11);
      if (d.length > 6) this.value = '(' + d.slice(0, 2) + ') ' + d.slice(2, d.length - 4) + '-' + d.slice(-4);
      else if (d.length > 2) this.value = '(' + d.slice(0, 2) + ') ' + d.slice(2);
      else this.value = d;
    });

    Object.keys(fields).forEach(function (field) {
      fields[field].input.addEventListener('blur', function () { validateField(field); });
      fields[field].input.addEventListener('input', function () {
        if (fields[field].input.classList.contains('is-invalid')) validateField(field);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      feedback.className = 'form-feedback';
      feedback.textContent = '';

      var ok = ['name', 'email', 'phone', 'message'].map(validateField).every(Boolean);

      if (ok) {
        var text =
          'Olá! Gostaria de agendar uma sessão no Equilibra Mente.\n\n' +
          '*Nome:* ' + fields.name.input.value.trim() + '\n' +
          '*E-mail:* ' + fields.email.input.value.trim() + '\n' +
          '*Telefone:* ' + fields.phone.input.value.trim() + '\n' +
          '*Mensagem:* ' + fields.message.input.value.trim();
        window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
        feedback.textContent = 'Tudo certo! Abrimos o WhatsApp com sua mensagem — é só tocar em enviar.';
        feedback.classList.add('is-success');
        form.reset();
      } else {
        feedback.textContent = 'Verifique os campos destacados antes de enviar.';
        feedback.classList.add('is-error');
      }
    });
  }

});
