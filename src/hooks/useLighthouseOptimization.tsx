import { useEffect, useCallback, useRef } from 'react';

/**
 * Hook pour optimiser les métriques Lighthouse
 */
export const useLighthouseOptimization = () => {
  const hasOptimized = useRef(false);

  // Optimiser le Largest Contentful Paint (LCP)
  const optimizeLCP = useCallback(() => {
    // Précharger les ressources critiques
    const preloadCriticalResources = () => {
      // Précharger l'image du logo seulement si elle existe
      const logoPreload = document.createElement('link');
      logoPreload.rel = 'preload';
      logoPreload.href = '/images/logo.webp';
      logoPreload.as = 'image';
      // Vérifier si l'image existe avant de l'ajouter
      const img = new Image();
      img.onload = () => document.head.appendChild(logoPreload);
      img.src = '/images/logo.webp';
    };

    // Optimiser le rendu du contenu principal
    const optimizeMainContent = () => {
      // Ajouter l'attribut loading="eager" au contenu au-dessus de la ligne
      const aboveFoldElements = document.querySelectorAll('header, .main-header, h1');
      aboveFoldElements.forEach(element => {
        if (element instanceof HTMLImageElement) {
          element.loading = 'eager';
        }
      });

      // Réduire le CLS (Cumulative Layout Shift)
      document.body.style.overflowX = 'hidden';

      // Ajouter des dimensions explicites aux images
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        if (!img.style.width && !img.style.height) {
          img.style.width = '100%';
          img.style.height = 'auto';
        }
      });
    };

    preloadCriticalResources();
    optimizeMainContent();
  }, []);

  // Optimiser le First Input Delay (FID)
  const optimizeFID = useCallback(() => {
    // Reporter les métriques Web Vitals (silencieusement)
    const reportWebVitals = (metric: any) => {
      // Supprimer les logs verbeux, garder seulement les métriques importantes
      if (metric.name === 'CLS' && metric.value > 0.1) {
        console.warn('High CLS detected:', metric.value);
      }
    };

    // Importer web-vitals silencieusement
    import('web-vitals').then((webVitals: any) => {
      if (webVitals.getCLS) webVitals.getCLS(reportWebVitals);
      if (webVitals.getFID) webVitals.getFID(reportWebVitals);
      if (webVitals.getFCP) webVitals.getFCP(reportWebVitals);
      if (webVitals.getLCP) webVitals.getLCP(reportWebVitals);
      if (webVitals.getTTFB) webVitals.getTTFB(reportWebVitals);
    }).catch(() => {
      // Web Vitals non disponible - ignorer silencieusement
    });

    // Optimiser l'exécution JavaScript (simplifié)
    const optimizeJavaScript = () => {
      // Éviter les modifications DOM risquées
      // Les scripts sont déjà optimisés par Vite
    };

    optimizeJavaScript();
  }, []);

  // Optimiser le Cumulative Layout Shift (CLS)
  const optimizeCLS = useCallback(() => {
    // Stabiliser la mise en page
    const stabilizeLayout = () => {
      // Ajouter des espaces réservés pour les images
      const imageContainers = document.querySelectorAll('[data-image-placeholder]');
      imageContainers.forEach(container => {
        const width = container.getAttribute('data-width') || '100%';
        const height = container.getAttribute('data-height') || '200px';
        (container as HTMLElement).style.minHeight = height;
        (container as HTMLElement).style.width = width;
      });

      // Optimiser les polices pour éviter le FOUT (Flash of Unstyled Text)
      document.fonts.ready.then(() => {
        document.body.classList.add('fonts-loaded');
      });
    };

    // Observer les changements de layout
    const observeLayoutShifts = () => {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift') {
            const layoutShiftEntry = entry as any;
            if (!layoutShiftEntry.hadRecentInput && layoutShiftEntry.value > 0.1) {
              console.warn('Significant layout shift detected:', layoutShiftEntry.value);
            }
          }
        }
      });

      try {
        observer.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        // Layout Shift API might not be available - silent fail
      }
    };

    stabilizeLayout();
    observeLayoutShifts();
  }, []);

  // Optimiser le Time to First Byte (TTFB)
  const optimizeTTFB = useCallback(() => {
    // Optimiser les requêtes réseau
    const optimizeNetworkRequests = () => {
      // Utiliser Service Worker pour le cache (silencieusement)
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => {
          // Service Worker non disponible - ignorer silencieusement
        });
      }
    };

    optimizeNetworkRequests();
  }, []);

  // Optimisations d'accessibilité pour Lighthouse
  const optimizeAccessibility = useCallback(() => {
    const improveAccessibility = () => {
      // Améliorer le contraste des couleurs
      const style = document.createElement('style');
      style.textContent = `
        .high-contrast-text {
          color: #000000 !important;
        }
        .high-contrast-bg {
          background-color: #ffffff !important;
        }
        @media (prefers-color-scheme: dark) {
          .high-contrast-text {
            color: #ffffff !important;
          }
          .high-contrast-bg {
            background-color: #000000 !important;
          }
        }
      `;
      document.head.appendChild(style);

      // Ajouter des attributs ARIA manquants
      const addAriaLabels = () => {
        // Labels pour les boutons sans texte
        const iconButtons = document.querySelectorAll('button[aria-label]:not([aria-label])');
        iconButtons.forEach(button => {
          const icon = button.querySelector('svg, i');
          if (icon) {
            const iconName = icon.getAttribute('data-icon') || 'button';
            button.setAttribute('aria-label', iconName);
          }
        });

        // Labels pour les éléments interactifs
        const interactiveElements = document.querySelectorAll('[onclick]:not([role]):not([tabindex])');
        interactiveElements.forEach(element => {
          element.setAttribute('role', 'button');
          element.setAttribute('tabindex', '0');
        });
      };

      addAriaLabels();
    };

    improveAccessibility();
  }, []);

  // Exécuter toutes les optimisations
  useEffect(() => {
    if (hasOptimized.current) return;

    const runOptimizations = () => {
      optimizeLCP();
      optimizeFID();
      optimizeCLS();
      optimizeTTFB();
      optimizeAccessibility();

      hasOptimized.current = true;
      // Optimisations appliquées silencieusement
    };

    // Exécuter après le chargement du DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', runOptimizations);
    } else {
      runOptimizations();
    }

    // Nettoyer les écouteurs d'événements
    return () => {
      document.removeEventListener('DOMContentLoaded', runOptimizations);
    };
  }, [optimizeLCP, optimizeFID, optimizeCLS, optimizeTTFB, optimizeAccessibility]);

  return {
    hasOptimized: hasOptimized.current
  };
};

/**
 * Hook pour optimiser le chargement des images
 */
export const useImageOptimization = () => {
  const optimizeImages = useCallback(() => {
    // Convertir les images en WebP si possible
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      const src = img.getAttribute('src');
      if (src && !src.includes('.webp') && !src.includes('data:')) {
        // Tenter de charger une version WebP
        const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        const webpImg = new Image();
        webpImg.onload = () => {
          img.setAttribute('src', webpSrc);
        };
        webpImg.src = webpSrc;
      }
    });

    // Ajouter le chargement paresseux pour les images hors écran
    const lazyLoadImages = () => {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      });

      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach(img => imageObserver.observe(img));
    };

    lazyLoadImages();
  }, []);

  useEffect(() => {
    optimizeImages();
  }, [optimizeImages]);

  return { optimizeImages };
};

export default useLighthouseOptimization;
