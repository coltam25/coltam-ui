// Documentation : code affiché = HTML réel de chaque démo (capturé avant l'initialisation des composants).
document.querySelectorAll('[data-demo]').forEach((demo) => {
  const lines = demo.innerHTML.replace(/^\n+|\s+$/g, '').split('\n');
  const indent = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length));
  const pre = document.createElement('pre'); pre.className = 'd-code'; pre.tabIndex = 0; pre.setAttribute('aria-label', 'Code HTML de l’exemple');
  const code = document.createElement('code'); code.textContent = lines.map((l) => l.slice(indent)).join('\n');
  pre.append(code); demo.after(pre);
});
// Choix du thème : bascule en direct, mémorisé sur ce navigateur si possible.
const btns = document.querySelectorAll('[data-set-theme]');
const apply = (t) => {
  document.documentElement.dataset.theme = t;
  btns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.setTheme === t)));
  try { localStorage.setItem('cui-theme', t); } catch (e) { /* stockage indisponible */ }
};
btns.forEach((b) => b.addEventListener('click', () => apply(b.dataset.setTheme)));
let saved = null; try { saved = localStorage.getItem('cui-theme'); } catch (e) { /* stockage indisponible */ }
apply(saved === 'mwanga' ? 'mwanga' : 'coltam');
// Démos
document.getElementById('demo-toast')?.addEventListener('click', () => ColtamUI.toast('Devis DEV-2026-014 envoyé au client.', { tone: 'success' }));
document.getElementById('demo-form')?.addEventListener('submit', (e) => { e.preventDefault(); ColtamUI.toast('Demande envoyée (démonstration).'); });
