import { createRouter, createRootRoute, createRoute, lazyRouteComponent } from '@tanstack/react-router'
import App from '../App'

// Création de la route racine
const rootRoute = createRootRoute({
  component: App,
})

// Création de la route d'accueil
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: lazyRouteComponent(() => import('../pages/HomePage'), 'default'),
})

// Création de la route du convertisseur
const converterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/converter',
  component: lazyRouteComponent(() => import('../components/ProMarkdownToPDF'), 'default'),
})

// Création de la route pour les templates
const templatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/templates',
  component: lazyRouteComponent(() => import('../pages/TemplatesPage'), 'TemplatesPage'),
})

// Création de la route pour un template spécifique
const templateDetailRoute = createRoute({
  getParentRoute: () => templatesRoute,
  path: '/$templateId',
  component: lazyRouteComponent(() => import('../pages/TemplateDetailPage'), 'TemplateDetailPage'),
})

// Création de la route pour les exports
const exportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/exports',
  component: lazyRouteComponent(() => import('../pages/ExportsPage'), 'ExportsPage'),
})

// Création de la route pour les paramètres
const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: lazyRouteComponent(() => import('../pages/SettingsPage'), 'SettingsPage'),
})

// Création de la route FAQ
const faqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/faq',
  component: lazyRouteComponent(() => import('../pages/FAQPage'), 'default'),
})

// Création de la route 404
const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '*',
  component: lazyRouteComponent(() => import('../pages/NotFoundPage'), 'default'),
})

// Assemblage du routeur
const router = createRouter({
  routeTree: rootRoute.addChildren([
    homeRoute,
    converterRoute,
    templatesRoute.addChildren([templateDetailRoute]),
    exportsRoute,
    settingsRoute,
    faqRoute,
    notFoundRoute,
  ]),
  defaultPreload: 'intent',
})

// Déclaration pour TypeScript
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export default router
