// ===============================
// SAVIOUR RESCUEVATOR WEBSITE JS
// ===============================

// -------------------- Helper functions --------------------
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// -------------------- Mobile Navigation Toggle --------------------
(() => {
   const navToggle = document.querySelector('.nav-toggle');
  const primaryNav = document.querySelector('.primary-nav');

  // Show menu on hover
  navToggle.addEventListener('mouseenter', () => {
    primaryNav.classList.add('open');
  });

  // Hide when mouse leaves toggle or menu
  navToggle.addEventListener('mouseleave', () => {
    setTimeout(() => {
      if (!primaryNav.matches(':hover')) {
        primaryNav.classList.remove('open');
      }
    }, 100);
  });

  primaryNav.addEventListener('mouseleave', () => {
    primaryNav.classList.remove('open');
  });
})();

// -------------------- Tabs System --------------------
(() => {
  const tabsRoot = $('[data-tabs]');
  if (!tabsRoot) return;

  const tabs = $$('.tab', tabsRoot);
  const panels = $$('.tab-panel', tabsRoot);

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // deactivate all tabs
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach(p => p.classList.remove('active'));

      // activate clicked tab + its panel
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const panel = $('#' + tab.getAttribute('aria-controls'));
      if (panel) panel.classList.add('active');
    });
  });
})();

// -------------------- Carousel (Auto + Manual) --------------------
(() => {
  const carousel = $('[data-carousel]');
  if (!carousel) return;

  const slides = $$('.slide', carousel);
  const prev = $('[data-prev]', carousel);
  const next = $('[data-next]', carousel);
  if (!slides.length) return;

  let index = 0;
  let timer;

  const show = i => {
    slides.forEach(s => s.classList.remove('active'));
    slides[i].classList.add('active');
    index = i;
  };

  const move = dir => {
    const i = (index + dir + slides.length) % slides.length;
    show(i);
  };

  const auto = () => (timer = setInterval(() => move(1), 6000));
  const resetAuto = () => {
    clearInterval(timer);
    auto();
  };

  if (prev) prev.addEventListener('click', () => { move(-1); resetAuto(); });
  if (next) next.addEventListener('click', () => { move(1); resetAuto(); });

  show(0);
  auto();
})();

// -------------------- Specification Table Export --------------------
(() => {
  const body = $('#specs-body');
  const btnCsv = $('[data-export="csv"]');
  const btnPdf = $('[data-export="pdf"]');
  if (!body || !btnCsv || !btnPdf) return;

  const getData = () =>
    Array.from(body.querySelectorAll('tr')).map(tr =>
      Array.from(tr.children).map(td => td.textContent.trim())
    );

  const download = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  btnCsv.addEventListener('click', () => {
    const rows = getData();
    const csv = ['Specification,Range / Detail']
      .concat(rows.map(r => r.join(',')))
      .join('\n');
    download(new Blob([csv], { type: 'text/csv' }), 'saviour-specs.csv');
  });

  btnPdf.addEventListener('click', () => {
    const rows = getData()
      .map(r => `• ${r[0]}: ${r[1]}`)
      .join('\n');
    const content = `SAVIOUR RESCUEVATOR SPECIFICATIONS\n\n${rows}\n`;
    download(new Blob([content], { type: 'application/pdf' }), 'saviour-specs.pdf');
  });
})();

// -------------------- Modal Handling --------------------
(() => {
  const modal = $('#modal-generic');
  const title = $('#modal-title');
  const body = $('#modal-body');
  if (!modal || !title || !body) return;

  const openModal = (t, b) => {
    title.textContent = t;
    body.textContent = b;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  };

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  };

  $$('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const type = btn.dataset.openModal;
      const messages = {
        audit: 'Audit request received',
        'maintenance-audit': 'Maintenance audit request received',
        drawings: 'Technical drawings requested',
        walkthrough: 'Technical walkthrough requested',
        similar: 'Similar solution request received',
        quote: 'Quote request received'
      };
      const titleText = messages[type] || 'Request received';
      openModal(titleText, 'Thank you. Our team will reach out within 48 hours.');
    });
  });

  $$('[data-close-modal]').forEach(btn => btn.addEventListener('click', closeModal));
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
})();

// -------------------- Case Study Downloads (Placeholder Files) --------------------
(() => {
  $$('[data-download]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.download;
      const files = {
        'case-metro': ['metro-46-stop.pdf', 'Metro City 46-Stop Tower — Case Study PDF placeholder'],
        'case-hospital': ['hospital-icu-wing.pdf', 'Critical-Care Hospital Wing — Case Study PDF placeholder'],
        'case-resi': ['premium-residential.pdf', 'Premium Residential Complex — Case Study PDF placeholder'],
        'pack-pdf': ['saviour-compliance-pack.pdf', 'Compliance Pack PDF placeholder'],
        'cad-zip': ['saviour-cad-drawings.zip', 'CAD Drawings ZIP placeholder'],
        'tender-doc': ['tender-wording.docx', 'Sample Tender Wording DOCX placeholder'],
        'struct-notes': ['structural-guidance.pdf', 'Structural Guidance Notes PDF placeholder']
      };

      const [name, content] = files[id] || ['download.txt', 'Download placeholder'];
      const blob = new Blob([content], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  });
})();

// -------------------- Subscribe Form --------------------
(() => {
  const form = $('#subscribe-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = $('#email')?.value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) return alert('Please enter a valid email address.');

    alert('✅ Subscribed! You will receive compliance alerts and whitepapers.');
    form.reset();
  });
})();

(() => {
  const form = $('#audit-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const fields = ['name', 'org', 'email2', 'category'];
    for (const id of fields) {
      const el = $('#' + id);
      if (!el || !el.value.trim()) {
        alert('Please complete all required fields.');
        el?.focus();
        return;
      }
    }
    alert('✅ Audit request submitted. We will contact you within 48 hours.');
    form.reset();
  });
})();

// -------------------- Footer Year Auto-Update --------------------
(() => {
  const y = $('#year');
  if (y) y.textContent = new Date().getFullYear();
})();
