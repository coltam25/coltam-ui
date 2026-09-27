/*! Coltam UI 0.1.0 — MIT — COLTAM SASU
   Composants interactifs. Aucun eval, aucun style en ligne, aucun gestionnaire en attribut :
   compatible avec « script-src 'self' » et « style-src 'self' ». */
(() => {
  let uid = 0;
  const id = (p) => `${p}-${++uid}`;

  /* <cui-tabs> : enfants [data-tab="Libellé"] ; motif ARIA « Tabs » (flèches, Début, Fin). */
  class CuiTabs extends HTMLElement {
    connectedCallback() {
      if (this._ready) return; this._ready = true;
      const panels = [...this.querySelectorAll(':scope > [data-tab]')];
      const list = document.createElement('div');
      list.className = 'cui-tablist'; list.setAttribute('role', 'tablist');
      if (this.getAttribute('label')) list.setAttribute('aria-label', this.getAttribute('label'));
      this._tabs = panels.map((panel, i) => {
        const tab = document.createElement('button');
        tab.type = 'button'; tab.className = 'cui-tab'; tab.id = id('cui-tab');
        tab.setAttribute('role', 'tab'); tab.textContent = panel.dataset.tab;
        panel.id ||= id('cui-panel');
        panel.classList.add('cui-tabpanel'); panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', tab.id); panel.tabIndex = 0;
        tab.setAttribute('aria-controls', panel.id);
        tab.addEventListener('click', () => this.select(i));
        list.append(tab); return tab;
      });
      this._panels = panels;
      list.addEventListener('keydown', (e) => {
        const n = this._tabs.length, cur = this._tabs.indexOf(document.activeElement);
        const next = { ArrowRight: cur + 1, ArrowLeft: cur - 1, Home: 0, End: n - 1 }[e.key];
        if (next === undefined || cur < 0) return;
        e.preventDefault(); this.select((next + n) % n, true);
      });
      this.prepend(list);
      this.select(Math.max(0, panels.findIndex((p) => p.hasAttribute('data-selected'))));
    }
    select(i, focus) {
      this._tabs.forEach((t, k) => {
        const on = k === i;
        t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1;
        this._panels[k].hidden = !on;
      });
      if (focus) this._tabs[i].focus();
      this.dispatchEvent(new CustomEvent('cui-change', { detail: { index: i } }));
    }
  }

  /* <cui-stepper> : enfants [data-step="Libellé"] ; boutons [data-cui-next] / [data-cui-prev].
     Un pas ne se valide que si ses champs sont valides (validation native du navigateur). */
  class CuiStepper extends HTMLElement {
    connectedCallback() {
      if (this._ready) return; this._ready = true;
      this._steps = [...this.querySelectorAll(':scope > [data-step]')];
      const ol = document.createElement('ol'); ol.className = 'cui-steps';
      ol.setAttribute('aria-label', this.getAttribute('label') || 'Étapes');
      this._items = this._steps.map((s, i) => {
        const li = document.createElement('li'); li.textContent = `${String(i + 1).padStart(2, '0')} · ${s.dataset.step}`;
        ol.append(li); return li;
      });
      this.prepend(ol);
      this.addEventListener('click', (e) => {
        if (e.target.closest('[data-cui-next]')) { e.preventDefault(); this.go(this._i + 1); }
        if (e.target.closest('[data-cui-prev]')) { e.preventDefault(); this.go(this._i - 1, true); }
      });
      this._i = 0; this.go(0, true);
    }
    go(i, force) {
      if (i < 0 || i >= this._steps.length) return;
      if (!force && i > this._i) {
        const bad = [...this._steps[this._i].querySelectorAll('input,select,textarea')].find((f) => !f.checkValidity());
        if (bad) { bad.reportValidity(); return; }
      }
      const moved = i !== this._i; this._i = i;
      this._steps.forEach((s, k) => { s.hidden = k !== i; });
      this._items.forEach((li, k) => {
        li.classList.toggle('is-done', k < i);
        if (k === i) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
      });
      if (moved) { const h = this._steps[i].querySelector('h1,h2,h3,h4,[tabindex]'); if (h) { h.tabIndex = -1; h.focus(); } }
      this.dispatchEvent(new CustomEvent('cui-step', { detail: { index: i } }));
    }
  }

  /* <cui-toast> : un seul par page ; ColtamUI.toast('Message', { tone: 'success' }). Annoncé aux lecteurs d'écran. */
  class CuiToast extends HTMLElement {
    connectedCallback() { this.setAttribute('role', 'status'); this.setAttribute('aria-live', 'polite'); }
    show(msg, { tone = '', duration = 4000 } = {}) {
      this.textContent = msg;
      if (tone) this.dataset.tone = tone; else delete this.dataset.tone;
      this.classList.add('is-visible');
      clearTimeout(this._t); this._t = setTimeout(() => this.classList.remove('is-visible'), duration);
    }
  }

  customElements.define('cui-tabs', CuiTabs);
  customElements.define('cui-stepper', CuiStepper);
  customElements.define('cui-toast', CuiToast);

  /* Modales : <dialog class="cui-dialog"> natif ; ouverture [data-cui-open="id"], fermeture [data-cui-close]
     ou clic sur le fond. Le navigateur gère le focus et la touche Échap. */
  document.addEventListener('click', (e) => {
    const open = e.target.closest('[data-cui-open]');
    if (open) { document.getElementById(open.dataset.cuiOpen)?.showModal(); return; }
    const close = e.target.closest('[data-cui-close]');
    if (close) { close.closest('dialog')?.close(); return; }
    if (e.target instanceof HTMLDialogElement && e.target.classList.contains('cui-dialog')) e.target.close();
  });

  window.ColtamUI = {
    version: '0.1.0',
    toast(msg, opts) {
      let t = document.querySelector('cui-toast');
      if (!t) { t = document.createElement('cui-toast'); document.body.append(t); }
      t.show(msg, opts);
    },
  };
})();
