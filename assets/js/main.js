/* ==========================================================================
   I-80 Card Show — site behavior
   Plain JavaScript, no dependencies. Every feature degrades gracefully:
   with JS off the pages still read and the form still submits to its action.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- Nav ---- */

  function initNav() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('primary-nav');
    if (!toggle || !nav) return;

    function close() {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    // Close after tapping a link on mobile.
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });

    // Reset state if the viewport grows back to desktop width.
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) close();
    });
  }

  /* ---------------------------------------------------------- Countdown ---- */

  // Reads the <time datetime="..."> element in the hero, so the show date lives
  // in exactly one place in the HTML.
  function initCountdown() {
    var box = document.getElementById('countdown');
    var timeEl = document.getElementById('next-show-date');
    if (!box || !timeEl) return;

    var target = new Date(timeEl.getAttribute('datetime'));
    if (isNaN(target.getTime())) return;

    var units = {
      days: box.querySelector('[data-unit="days"]'),
      hours: box.querySelector('[data-unit="hours"]'),
      minutes: box.querySelector('[data-unit="minutes"]'),
      seconds: box.querySelector('[data-unit="seconds"]')
    };

    function pad(n) { return n < 10 ? '0' + n : String(n); }

    function tick() {
      var diff = target.getTime() - Date.now();

      if (diff <= 0) {
        box.innerHTML = '<p style="grid-column:1/-1;text-align:center;font-weight:700;margin:0">' +
          'Show day is here — doors open at 9:00 AM. See you there.</p>';
        clearInterval(timer);
        return;
      }

      var totalSeconds = Math.floor(diff / 1000);
      units.days.textContent = Math.floor(totalSeconds / 86400);
      units.hours.textContent = pad(Math.floor(totalSeconds / 3600) % 24);
      units.minutes.textContent = pad(Math.floor(totalSeconds / 60) % 60);
      units.seconds.textContent = pad(totalSeconds % 60);
    }

    tick();
    var timer = setInterval(tick, 1000);
  }

  /* --------------------------------------------------------------- Year ---- */

  function initYear() {
    var els = document.querySelectorAll('#year');
    for (var i = 0; i < els.length; i++) {
      els[i].textContent = new Date().getFullYear();
    }
  }

  /* --------------------------------------------------------------- Form ---- */

  var MESSAGES = {
    name: 'Please tell us your name.',
    email: 'Please enter an email address we can reply to.',
    emailFormat: 'That email address doesn’t look right.',
    phone: 'Please enter a phone number.',
    city: 'Please tell us what city and state you’re coming from.',
    'show-date': 'Please choose which show you\u2019re signing up for.',
    tables: 'Please choose how many tables you need.',
    sells: 'Please tell us what you sell \u2014 it helps us lay out the room.',
    agree: 'Please confirm you’ve read the vendor rules.'
  };

  function setError(field, message) {
    var slot = document.querySelector('[data-error-for="' + field.name + '"]');
    if (message) {
      field.setAttribute('aria-invalid', 'true');
      if (slot) slot.textContent = message;
    } else {
      field.removeAttribute('aria-invalid');
      if (slot) slot.textContent = '';
    }
  }

  function validateField(field) {
    var value = (field.value || '').trim();

    if (field.type === 'checkbox') {
      if (field.required && !field.checked) return MESSAGES[field.name] || 'This box needs to be checked.';
      return '';
    }
    if (field.required && !value) return MESSAGES[field.name] || 'This field is required.';
    if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return MESSAGES.emailFormat;
    if (field.type === 'tel' && value && value.replace(/\D/g, '').length < 10) return 'Please include the area code.';
    return '';
  }

  function showStatus(el, message, ok) {
    el.textContent = message;
    el.className = 'form-status is-visible ' + (ok ? 'form-status--ok' : 'form-status--err');
  }

  function initForm() {
    var form = document.getElementById('vendor-form');
    if (!form) return;

    var status = document.getElementById('form-status');
    var submit = form.querySelector('button[type="submit"]');
    var fields = Array.prototype.slice.call(
      form.querySelectorAll('input[name], select[name], textarea[name]')
    ).filter(function (f) {
      return f.type !== 'hidden' && f.name !== 'company-website';
    });

    // Clear a field's error as soon as the visitor fixes it.
    fields.forEach(function (field) {
      var evt = (field.tagName === 'SELECT' || field.type === 'checkbox') ? 'change' : 'blur';
      field.addEventListener(evt, function () {
        setError(field, validateField(field));
      });
      field.addEventListener('input', function () {
        if (field.getAttribute('aria-invalid') === 'true') setError(field, validateField(field));
      });
    });

    form.addEventListener('submit', function (e) {
      var firstBad = null;

      fields.forEach(function (field) {
        var message = validateField(field);
        setError(field, message);
        if (message && !firstBad) firstBad = field;
      });

      if (firstBad) {
        e.preventDefault();
        showStatus(status, 'Please fix the highlighted fields and send again.', false);
        firstBad.focus();
        return;
      }

      // No endpoint wired up yet: don't let the request vanish into a reload.
      // See the TODO(setup) comment above the form in vendors.html.
      var action = form.getAttribute('action');
      if (!action) {
        e.preventDefault();
        showStatus(
          status,
          'Online sign-ups aren’t switched on yet. Please email info@i80cardshow.com ' +
          'with your name, phone number, how many tables you need and what you sell, ' +
          'and we’ll get you on the vendor list.',
          false
        );
        return;
      }

      // Submit to Formspree (or any JSON-friendly endpoint) without leaving the page.
      if (window.fetch && /formspree\.io/.test(action)) {
        e.preventDefault();
        if (submit) { submit.disabled = true; submit.textContent = 'Sending…'; }

        fetch(action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        }).then(function (res) {
          if (!res.ok) throw new Error('Request failed');
          form.reset();
          showStatus(
            status,
            'Thanks — you’re on the vendor list. We’ll confirm your table and send payment details within two business days.',
            true
          );
        }).catch(function () {
          showStatus(
            status,
            'Something went wrong sending that. Please email info@i80cardshow.com and we’ll take care of it.',
            false
          );
        }).then(function () {
          if (submit) { submit.disabled = false; submit.textContent = 'Send my sign-up'; }
        });
        return;
      }

      // Anything else (e.g. Netlify Forms) posts normally.
      if (submit) { submit.disabled = true; submit.textContent = 'Sending…'; }
    });
  }

  /* --------------------------------------------------------------- Boot ---- */

  function init() {
    initNav();
    initCountdown();
    initYear();
    initForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
