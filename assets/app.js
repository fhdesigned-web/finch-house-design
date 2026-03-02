(function () {
  const burger = document.querySelector('[data-burger]');
  const menu = document.querySelector('[data-menu]');
  if (burger && menu) {
    burger.addEventListener('click', () => menu.classList.toggle('open'));
  }

  // Active menu item
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.menu a[data-page]').forEach(a => {
    if ((a.getAttribute('href') || '').toLowerCase() === path) a.classList.add('active');
  });

  // Language apply
  const btnEN = document.querySelector('[data-lang-en]');
  const btnRU = document.querySelector('[data-lang-ru]');

  // Helper: decide whether to render HTML or plain text
  function setTranslatedContent(el, value) {
    if (value === null || value === undefined) return;

    const tag = (el.tagName || '').toUpperCase();

    // Never inject HTML into form controls
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'OPTION') {
      el.textContent = value;
      return;
    }

    // If translation contains markup, render it as HTML
    // (covers <strong>, <b>, <br>, etc.)
    if (/[<][a-zA-Z/][^>]*[>]/.test(value)) {
      el.innerHTML = value;
    } else {
      el.textContent = value;
    }
  }

  function apply(lang) {
    localStorage.setItem('fhd_lang', lang);

    // toggle UI
    if (btnEN && btnRU) {
      btnEN.classList.toggle('active', lang === 'en');
      btnRU.classList.toggle('active', lang === 'ru');
    }

    // text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const v = el.getAttribute('data-' + lang);
      if (v !== null) setTranslatedContent(el, v);
    });

    // placeholders
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const v = el.getAttribute('data-' + lang);
      if (v !== null) el.setAttribute('placeholder', v);
    });
  }

  apply(localStorage.getItem('fhd_lang') || 'en');

  if (btnEN) btnEN.addEventListener('click', () => apply('en'));
  if (btnRU) btnRU.addEventListener('click', () => apply('ru'));

  // Mailto form helper
  const form = document.querySelector('form[data-mailto]');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const to = form.getAttribute('data-mailto');
      const d = new FormData(form);

      const subject = encodeURIComponent(`Finch House Design enquiry — ${d.get('service') || 'Project'}`);
      const body = encodeURIComponent(
`Name: ${d.get('name') || ''}
Phone/WhatsApp: ${d.get('phone') || ''}
City: ${d.get('city') || ''}
Service: ${d.get('service') || ''}
Budget: ${d.get('budget') || ''}
Timeline: ${d.get('timeline') || ''}

Message:
${d.get('message') || ''}

Telegram: @Anastasyafinch
WhatsApp: +79268476631
Instagram: @finch.house.design`
      );

      location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    });
  }
})();
