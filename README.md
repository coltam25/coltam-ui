# Coltam UI

**Une bibliothèque, deux marques en production.** Composants d'interface accessibles, sans dépendance et compatibles avec une politique de sécurité stricte (CSP), utilisés sur [coltam.fr](https://coltam.fr) et [mwanga.partners](https://mwanga.partners).

- **15 composants** : bouton, badge, sur-titre, carte, champ, case à cocher, interrupteur, alerte, chiffres clés, tableau, dépliant, fenêtre modale, onglets, étapes, notification.
- **0 dépendance**, aucune étape de compilation : une feuille de styles, un thème, un script de 6 Ko (2 Ko compressé).
- **Accessibilité WCAG 2.2 AA** vérifiée à chaque test par [axe-core](https://github.com/dequelabs/axe-core), sur les deux thèmes ; navigation clavier testée.
- **CSP stricte** : aucun style ni script en ligne, aucun `eval` (testé sous `script-src 'self'; style-src 'self'`).
- **Natif d'abord** : `<dialog>`, `<details>`, validation des formulaires du navigateur ; Web Components seulement pour les onglets, les étapes et les notifications.

Documentation et démonstration en direct : **https://ui.coltam.fr**

## Installation

```bash
npm install @coltam/ui
```

```html
<link rel="stylesheet" href="/node_modules/@coltam/ui/src/coltam-ui.css">
<link rel="stylesheet" href="/node_modules/@coltam/ui/src/themes/coltam.css">
<script src="/node_modules/@coltam/ui/src/coltam-ui.js" defer></script>

<body class="cui" data-theme="coltam">
  <button class="cui-btn">Demander un devis</button>
</body>
```

Les polices ne sont pas incluses dans le paquet : hébergez-les sur votre site (RGPD), puis déclarez-les avec `@font-face`. Les thèmes attendent Nunito + DM Mono (COLTAM) ou Questrial + Lato (Mwanga Partners) et se rabattent sur les polices système.

## Thèmes

Un thème n'est qu'un jeu de variables CSS (`--cui-*`). Pour créer le vôtre, copiez `src/themes/coltam.css`, changez le sélecteur (`[data-theme="ma-marque"]`) et les valeurs. Chargez les thèmes **après** `coltam-ui.css`.

| Variable | Rôle |
|---|---|
| `--cui-ink`, `--cui-ink-muted` | texte principal et secondaire |
| `--cui-bg`, `--cui-surface`, `--cui-surface-2` | fonds |
| `--cui-primary`, `--cui-primary-hover` | boutons principaux |
| `--cui-accent`, `--cui-accent-soft` | couleur de marque |
| `--cui-success`, `--cui-warning`, `--cui-danger`, `--cui-info` (+ `-soft`) | états |
| `--cui-font-display`, `--cui-font-body`, `--cui-font-mono` | typographies |
| `--cui-radius`, `--cui-btn-case`, `--cui-btn-tracking` | forme et style des boutons |

Toutes les couleurs des deux thèmes respectent un contraste d'au moins 4,5:1 pour le texte.

## Développement

```bash
npm install
npm run docs   # documentation sur http://localhost:8080/docs/ (servie avec la CSP stricte)
npm test       # axe-core sur les deux thèmes, CSP, clavier
```

## Licence

MIT © 2026 COLTAM SASU. Polices de la documentation sous SIL Open Font License (fichiers `docs/fonts/OFL-*.txt`).
