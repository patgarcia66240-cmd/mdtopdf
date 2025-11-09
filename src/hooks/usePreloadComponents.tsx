import { useCallback, useEffect, useRef } from 'react';

interface PreloadOptions {
  delay?: number;
  threshold?: number;
  rootMargin?: string;
}

// Core hook exposing helpers to preload components in various ways
export const usePreloadComponents = () => {
  const preloaded = useRef(new Set<string>());
  const isProd = import.meta.env.PROD;

  const preloadComponent = useCallback(async (importFn: () => Promise<any>, name: string) => {
    if (preloaded.current.has(name)) return;
    try {
      await importFn();
      preloaded.current.add(name);
      if (!isProd) console.log(`📦 Composant préchargé: ${name}`);
    } catch (err) {
      if (!isProd) console.warn(`⚠️ Échec du préchargement de ${name}:`, err);
    }
  }, [isProd]);

  const preloadOnInteraction = useCallback((componentName: string, importFn: () => Promise<any>) => {
    const handler = () => {
      preloadComponent(importFn, componentName);
      document.removeEventListener('mousemove', handler);
      document.removeEventListener('touchstart', handler);
      document.removeEventListener('keydown', handler);
    };
    document.addEventListener('mousemove', handler, { once: true });
    document.addEventListener('touchstart', handler, { once: true });
    document.addEventListener('keydown', handler, { once: true });
  }, [preloadComponent]);

  const preloadAfterDelay = useCallback((componentName: string, importFn: () => Promise<any>, delay = 3000) => {
    const id = setTimeout(() => preloadComponent(importFn, componentName), delay);
    return () => clearTimeout(id);
  }, [preloadComponent]);

  const preloadOnProximity = (
    componentName: string,
    importFn: () => Promise<any>,
    elementRef: React.RefObject<HTMLElement>,
    options: PreloadOptions = {}
  ) => {
    const { delay = 1000, threshold = 0.1, rootMargin = '50px' } = options;
    if (!elementRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => preloadComponent(importFn, componentName), delay);
          observer.disconnect();
        }
      });
    }, { threshold, rootMargin });
    observer.observe(elementRef.current);
    return () => observer.disconnect();
  };

  const preloadBasedOnState = (
    condition: boolean,
    componentName: string,
    importFn: () => Promise<any>
  ) => {
    useEffect(() => {
      if (condition && !preloaded.current.has(componentName)) {
        const id = setTimeout(() => preloadComponent(importFn, componentName), 500);
        return () => clearTimeout(id);
      }
    }, [condition, componentName, importFn]);
  };

  return {
    preloadComponent,
    preloadOnInteraction,
    preloadAfterDelay,
    preloadOnProximity,
    preloadBasedOnState,
    isPreloaded: (name: string) => preloaded.current.has(name),
  };
};

// App specific preloading wiring
export const useMDtoPDFPreloading = ({
  showTemplates,
  showAdvancedExport,
  isDarkMode,
}: {
  showTemplates: boolean;
  showAdvancedExport: boolean;
  isDarkMode: boolean;
}) => {
  const { preloadAfterDelay, preloadBasedOnState } = usePreloadComponents();

  // First interaction preloading (guarded for StrictMode)
  const firstInteractionSetup = useRef(false);
  useEffect(() => {
    if (firstInteractionSetup.current) return;
    firstInteractionSetup.current = true;
    const handleFirst = () => {
      setTimeout(() => {
        import('../components/templates/TemplateSelectorEnhanced');
        if (!import.meta.env.PROD) console.log('🚀 TemplateSelectorEnhanced préchargé');
      }, 2000);
      document.removeEventListener('mousemove', handleFirst);
      document.removeEventListener('touchstart', handleFirst);
    };
    document.addEventListener('mousemove', handleFirst, { once: true });
    document.addEventListener('touchstart', handleFirst, { once: true });
  }, []);

  // Hover export preloading (guarded for StrictMode)
  const exportHoverSetup = useRef(false);
  useEffect(() => {
    if (exportHoverSetup.current) return;
    exportHoverSetup.current = true;
    const exportButton = document.querySelector('[aria-label*="export" i]');
    if (!exportButton) return;
    const onEnter = () => {
      import('../components/export/AdvancedExportPanel');
      if (!import.meta.env.PROD) console.log('🚀 AdvancedExportPanel préchargé');
      exportButton.removeEventListener('mouseenter', onEnter);
    };
    exportButton.addEventListener('mouseenter', onEnter);
    return () => exportButton.removeEventListener('mouseenter', onEnter);
  }, []);

  // Essential preview after a short delay
  useEffect(() => {
    const cancel = preloadAfterDelay(
      'PDFPreview',
      () => import('../components/modules/PDFPreview'),
      2000,
    );
    return cancel;
  }, [preloadAfterDelay]);

  // Based on app state
  preloadBasedOnState(
    showTemplates,
    'TemplateSelectorEnhanced',
    () => import('../components/templates/TemplateSelectorEnhanced'),
  );

  preloadBasedOnState(
    showAdvancedExport,
    'AdvancedExportPanel',
    () => import('../components/export/AdvancedExportPanel'),
  );
};

export default usePreloadComponents;

