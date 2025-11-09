import { useEffect, useRef, useCallback } from 'react';

interface PreloadOptions {
  delay?: number; // Délai avant le préchargement (ms)
  threshold?: number; // Distance avant de précharger
  rootMargin?: string; // Marge pour l'intersection observer
}

/**
 * Hook pour précharger des composants de manière conditionnelle
 * Utile pour améliorer les performances perçues
 */
export const usePreloadComponents = () => {
  const preloadedComponents = useRef(new Set<string>());

  /**
   * Précharge un composant de manière asynchrone
   */
  const preloadComponent = async (importFn: () => Promise<any>, name: string) => {
    if (preloadedComponents.current.has(name)) {
      return;
    }

    try {
      await importFn();
      preloadedComponents.current.add(name);
      console.log(`✅ Composant préchargé: ${name}`);
    } catch (error) {
      console.warn(`⚠️ Échec du préchargement du composant ${name}:`, error);
    }
  };

  /**
   * Précharge les composants basés sur les interactions utilisateur
   */
  const preloadOnInteraction = useCallback((
    componentName: string,
    importFn: () => Promise<any>
  ) => {
    const handleInteraction = () => {
      preloadComponent(importFn, componentName);
      // Nettoyer les écouteurs après le premier préchargement
      document.removeEventListener('mousemove', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };

    // Écouter les premières interactions de l'utilisateur
    document.addEventListener('mousemove', handleInteraction, { once: true });
    document.addEventListener('touchstart', handleInteraction, { once: true });
    document.addEventListener('keydown', handleInteraction, { once: true });
  }, [preloadComponent]);

  /**
   * Précharge les composants après un délai
   */
  const preloadAfterDelay = useCallback((
    componentName: string,
    importFn: () => Promise<any>,
    delay: number = 3000
  ) => {
    setTimeout(() => {
      preloadComponent(importFn, componentName);
    }, delay);
  }, [preloadComponent]);

  /**
   * Précharge les composants basés sur l'état de l'application
   */
  const preloadOnStateChange = useCallback((
    componentName: string,
    importFn: () => Promise<any>,
    triggerCondition: () => boolean,
    options: { debounce?: number } = {}
  ) => {
    const { debounce = 300 } = options;
    let timeoutId: NodeJS.Timeout;

    const checkAndPreload = () => {
      if (triggerCondition()) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          preloadComponent(importFn, componentName);
        }, debounce);
      }
    };

    return checkAndPreload;
  }, []);

  /**
   * Précharge les composants quand ils sont proches d'être visibles (Intersection Observer)
   */
  const preloadOnProximity = (
    componentName: string,
    importFn: () => Promise<any>,
    elementRef: React.RefObject<HTMLElement>,
    options: PreloadOptions = {}
  ) => {
    const {
      delay = 1000,
      threshold = 0.1,
      rootMargin = '50px'
    } = options;

    if (!elementRef.current) {
      console.log(`Element ref is null for ${componentName}, skipping proximity preload`);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              preloadComponent(importFn, componentName);
            }, delay);
            observer.disconnect();
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(elementRef.current);

    // Return cleanup function
    return () => {
      observer.disconnect();
    };
  };

  /**
   * Précharge les composants basés sur l'état de l'application
   */
  const preloadBasedOnState = (
    condition: boolean,
    componentName: string,
    importFn: () => Promise<any>
  ) => {
    useEffect(() => {
      if (condition && !preloadedComponents.current.has(componentName)) {
        // Précharger avec un petit délai pour ne pas bloquer l'interaction principale
        setTimeout(() => {
          preloadComponent(importFn, componentName);
        }, 500);
      }
    }, [condition, componentName, importFn]);
  };

  return {
    preloadComponent,
    preloadOnInteraction,
    preloadAfterDelay,
    preloadOnProximity,
    preloadBasedOnState,
    isPreloaded: (name: string) => preloadedComponents.current.has(name)
  };
};

/**
 * Hook spécifique pour le préchargement des composants de l'application MDtoPDF
 */
export const useMDtoPDFPreloading = ({
  showTemplates,
  showAdvancedExport,
  isDarkMode
}: {
  showTemplates: boolean;
  showAdvancedExport: boolean;
  isDarkMode: boolean;
}) => {
  const { preloadOnInteraction, preloadAfterDelay, preloadBasedOnState } = usePreloadComponents();

  // Précharger TemplateSelectorEnhanced au premier survol de la souris
  useEffect(() => {
    const handleFirstInteraction = () => {
      setTimeout(() => {
        import('../components/templates/TemplateSelectorEnhanced');
        console.log('📦 TemplateSelectorEnhanced préchargé');
      }, 2000);

      // Nettoyer après le préchargement
      document.removeEventListener('mousemove', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    document.addEventListener('mousemove', handleFirstInteraction, { once: true });
    document.addEventListener('touchstart', handleFirstInteraction, { once: true });
  }, []);

  // Précharger AdvancedExportPanel quand l'utilisateur est proche du bouton export
  useEffect(() => {
    const exportButton = document.querySelector('[aria-label*="export"]');
    if (exportButton) {
      const handleMouseEnter = () => {
        import('../components/export/AdvancedExportPanel');
        console.log('📦 AdvancedExportPanel préchargé');
        exportButton.removeEventListener('mouseenter', handleMouseEnter);
      };

      exportButton.addEventListener('mouseenter', handleMouseEnter);

      return () => {
        exportButton.removeEventListener('mouseenter', handleMouseEnter);
      };
    }
  }, []);

  // Précharger PDFPreview après un délai (composant essentiel)
  useEffect(() => {
    preloadAfterDelay(
      'PDFPreview',
      () => import('../components/modules/PDFPreview'),
      2000
    );
  }, [preloadAfterDelay]);

  // Précharger TemplateSelectorEnhanced quand l'onglet templates est actif
  preloadBasedOnState(
    showTemplates,
    'TemplateSelectorEnhanced',
    () => import('../components/templates/TemplateSelectorEnhanced')
  );

  // Précharger AdvancedExportPanel quand le panneau est ouvert
  preloadBasedOnState(
    showAdvancedExport,
    'AdvancedExportPanel',
    () => import('../components/export/AdvancedExportPanel')
  );
};

export default usePreloadComponents;