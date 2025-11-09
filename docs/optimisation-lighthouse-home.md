# Optimisation Lighthouse – Page d’accueil

Ce document synthétise l’analyse de la Home (/) et propose un plan d’actions concret pour améliorer FCP/LCP, basé sur l’état courant du code.

## Baseline mesurée
- First Contentful Paint (FCP) ≈ 2,0 s
- Largest Contentful Paint (LCP) ≈ 3,4 s
- Total Blocking Time (TBT) = 0 ms
- Cumulative Layout Shift (CLS) = 0
- Speed Index ≈ 2,0 s

## LCP/FCP – Constat principal
- Élément LCP candidat: le titre `h1` de la Hero, rendu dans `src/components/home/HeroSection.tsx`.
- Double cascade de lazy loading:
  - La page `/` est chargée en lazy via TanStack Router (`src/router/index.ts`).
  - La `HeroSection` est à nouveau lazy dans `src/pages/HomePage.tsx` et affichée derrière un `Suspense`.
- Conséquence: la LCP attend deux chargements asynchrones (chunk page + chunk Hero) avant d’afficher l’élément principal → LCP dégradée.

## Autres points bloquants
- `index.html` surcharge le démarrage avec de nombreux `modulepreload`/`preload` sur des fichiers `.tsx` et `.module.css`. En build Vite, ces chemins ne correspondent pas aux chunks de production et ajoutent du bruit réseau.
- Polices chargées deux fois (Google Fonts + `@font-face` inline) pour Inter 400/500/600 → connexions et temps réseau doublés au démarrage.
- Header au-dessus de la ligne de flottaison importe plusieurs icônes `@heroicons/react` et effectue un rendu relativement “lourd” avant la Hero.
- Hooks d’optimisation génériques (`useLighthouseOptimization`) exécutés tôt, pouvant ajouter une petite activité post-DOM non critique pour la Home.

## Plan d’actions (priorisé)

### P0 — Impact direct LCP/FCP
1) Eager-load la Hero, lazy-load le reste
- Dans `src/pages/HomePage.tsx`, importer `HeroSection` de manière directe et supprimer le `Suspense` associé. Garder `Features/Testimonials/CTA` en lazy + `Suspense`.

2) Nettoyer `index.html` des preloads non fiables
- Supprimer les `<link rel="modulepreload">` vers `.tsx` et les `<link rel="preload" as="style">` vers `.module.css`. Vite gère déjà les `preload/modulepreload` de production.
- Conserver `index.css` avec `<link rel="stylesheet">` simple (préload optionnel seulement si mesuré gagnant).

3) Simplifier le chargement de la police
- Choisir UNE stratégie: soit Google Fonts (un seul `<link>` avec `display=swap`), soit auto-hébergée (woff2) avec poids strictement nécessaires (ex: 600 pour le H1). Éviter le double: Google + `@font-face` inline.

### P1 — Réduction JS/CSS au-dessus de la ligne de flottaison
4) Alléger le Header initial
- Remplacer les icônes visibles immédiatement par de petits SVG inline (ou différer certaines icônes hors écran). Vérifier que le logo est léger et avec dimensions explicites (OK avec `OptimizedImage`).

5) Charger `web-vitals` et optimisations génériques uniquement en dev
- Conditionner `useLighthouseOptimization` à `process.env.NODE_ENV !== 'production'` ou repousser son exécution après l’interaction.

### P2 — Finitions
6) Vérifier Hero CSS
- Pas d’images de fond lourdes. Garder le dégradé. S’assurer que le `h1` reste lisible avec polices système si Inter arrive après.

## Détails de mise en œuvre

### 1) `src/pages/HomePage.tsx` – Eager Hero
Avant:
```tsx
// Lazy loading des composants
const HeroSection = React.lazy(() => import('../components/home/HeroSection'));
...
<Suspense fallback={<HeroSectionSkeleton />}>
  <HeroSection />
</Suspense>
```
Après:
```tsx
import HeroSection from '../components/home/HeroSection';
...
<HeroSection />

// Garder les autres sections en lazy + Suspense
```

Option complémentaire (si LCP encore haute): charger Home sans lazy dans `src/router/index.ts` uniquement pour `/`.

### 2) `index.html` – Nettoyage des preloads
- Supprimer les `modulepreload` pointant vers `/src/*.tsx` et les `preload as=style` vers les `.module.css`.
- Exemple de head simplifié pour la prod:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/src/index.css">
```
- Retirer les `@font-face` inline qui doublonnent avec Google Fonts (ou inversement, ne garder que les `@font-face` auto-hébergés et supprimer Google Fonts).

### 3) `src/components/modules/Header.tsx` – Alléger au-dessus de la ligne de flottaison
- Remplacer icônes critiques par de petits SVG inline (ex: 16–20px), garder `@heroicons` pour éléments non-immédiats.
- Vérifier que rien ne bloque la Hero (pas d’effets coûteux synchrones dans `useEffect`).

### 4) `src/hooks/useLighthouseOptimization.tsx`
- Désactiver ou reporter en prod:
```ts
if (process.env.NODE_ENV !== 'production') {
  // exécuter les imports web-vitals et observers
}
```

## Checklist de vérification
- LCP element dans Lighthouse = `<h1>` de la Hero.
- LCP ≤ ~1.8 s sur desktop milieu de gamme.
- FCP ≤ ~1.3–1.6 s.
- Aucune requête 404/stack inutile au démarrage (Network).
- Chunks init réduits; absence de `modulepreload` vers sources `.tsx`.
- Polices: une seule stratégie, `display=swap` actif.

## Suivi et mesures
- Tester en mode build (`vite build` puis `vite preview`) pour des résultats réalistes.
- Enregistrer un «before/after» Lighthouse avec traces pour vérifier: LCP time, LCP resource, Main Thread work, Network waterfall.

---
Questions ou ajustements souhaités (ex: garder lazy Home mais «hydrate on idle», ou auto-héberger Inter) — me dire votre préférence et j’adapte le patch.

