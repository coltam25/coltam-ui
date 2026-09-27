// Tests : accessibilité (axe-core, WCAG 2.2 AA) sur les deux thèmes, absence de violation CSP, comportement clavier.
import { chromium } from 'playwright'; import fs from 'node:fs'; import { createRequire } from 'node:module';
import { serve } from './serve.mjs';
const axe = fs.readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8');
const srv = await serve(); const base = `http://localhost:${srv.address().port}/docs/`;
const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
let fails = 0; const ok = (c, m) => { console.log(`${c ? '✓' : '✗'} ${m}`); if (!c) fails++; };

async function page(theme) {
  const p = await browser.newPage();
  const csp = []; p.on('console', (m) => { if (/Content Security Policy/i.test(m.text())) csp.push(m.text()); });
  p.on('pageerror', (e) => csp.push('pageerror: ' + e.message));
  await p.goto(base); await p.click(`[data-set-theme="${theme}"]`);
  return { p, csp };
}

for (const theme of ['coltam', 'mwanga']) {
  const { p, csp } = await page(theme);
  ok(await p.evaluate(() => document.documentElement.dataset.theme) === theme, `[${theme}] thème appliqué`);
  await p.evaluate(axe); // injection via le protocole du navigateur : n'enfreint pas la CSP de la page
  const res = await p.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } }))
    .violations.map((v) => `${v.id} (${v.nodes.length}) : ${v.help} -> ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(', ')}`));
  ok(res.length === 0, `[${theme}] axe-core WCAG 2.2 AA : ${res.length} violation(s)${res.length ? '\n    ' + res.join('\n    ') : ''}`);
  ok(csp.length === 0, `[${theme}] aucune violation CSP ni erreur JS${csp.length ? ' : ' + csp.join(' | ') : ''}`);
  await p.close();
}

// Comportements
const { p, csp } = await page('coltam');
const tab = p.locator('cui-tabs [role=tab]');
await tab.first().focus(); await p.keyboard.press('ArrowRight');
ok(await tab.nth(1).getAttribute('aria-selected') === 'true', 'Onglets : flèche droite sélectionne l’onglet suivant');
ok(await p.locator('cui-tabs [role=tabpanel]').nth(0).isHidden(), 'Onglets : le panneau précédent est masqué');
await p.keyboard.press('End'); ok(await tab.nth(2).getAttribute('aria-selected') === 'true', 'Onglets : Fin va au dernier onglet');

const step = p.locator('cui-stepper');
await step.locator('[data-cui-next]').first().click();
ok(await step.locator('.cui-steps li').first().getAttribute('aria-current') === 'step', 'Étapes : bloque tant que le champ obligatoire est vide');
await p.fill('#s-nom', 'Thomas'); await step.locator('[data-cui-next]').first().click();
ok(await step.locator('.cui-steps li').nth(1).getAttribute('aria-current') === 'step', 'Étapes : passe à l’étape 2 une fois le champ rempli');

const opener = p.locator('[data-cui-open="dlg-demo"]');
await opener.click(); ok(await p.locator('#dlg-demo').evaluate((d) => d.open), 'Modale : s’ouvre');
await p.keyboard.press('Escape'); ok(!(await p.locator('#dlg-demo').evaluate((d) => d.open)), 'Modale : Échap la ferme');
ok(await opener.evaluate((b) => b === document.activeElement), 'Modale : le focus revient au bouton d’ouverture');

await p.click('#demo-toast');
const t = p.locator('cui-toast'); ok(await t.getAttribute('role') === 'status' && /DEV-2026-014/.test(await t.textContent()), 'Notification : annoncée (role=status)');
ok(csp.length === 0, 'Comportements : aucune violation CSP ni erreur JS');

await browser.close(); srv.close();
console.log(fails ? `\n${fails} échec(s)` : '\nTous les tests sont au vert.'); process.exit(fails ? 1 : 0);
