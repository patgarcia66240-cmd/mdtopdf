import { useMemo, useCallback, useRef } from 'react';

/**
 * Hook pour optimiser les performances avec mémoisation et débouncing
 */
export const usePerformanceOptimization = () => {
  // Cache pour les calculs coûteux
  const expensiveCalculationsCache = useRef(new Map());

  /**
   * Memoize une fonction avec cache personnalisé
   */
  const useMemoizedFunction = useCallback(
    <T extends (...args: any[]) => any>(fn: T, cacheKey: string): T => {
      return ((...args: any[]) => {
        const key = `${cacheKey}-${JSON.stringify(args)}`;

        if (expensiveCalculationsCache.current.has(key)) {
          return expensiveCalculationsCache.current.get(key);
        }

        const result = fn(...args);
        expensiveCalculationsCache.current.set(key, result);

        // Limiter la taille du cache
        if (expensiveCalculationsCache.current.size > 100) {
          const firstKey = expensiveCalculationsCache.current.keys().next().value;
          expensiveCalculationsCache.current.delete(firstKey);
        }

        return result;
      }) as T;
    },
    []
  );

  /**
   * Debounce pour les fonctions fréquemment appelées
   */
  const useDebouncedCallback = useCallback(
    <T extends (...args: any[]) => any>(
      callback: T,
      delay: number
    ): T => {
      const timeoutRef = useRef<NodeJS.Timeout>();

      return ((...args: any[]) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          callback(...args);
        }, delay);
      }) as T;
    },
    []
  );

  /**
   * Throttle pour les fonctions de rendu
   */
  const useThrottledCallback = useCallback(
    <T extends (...args: any[]) => any>(
      callback: T,
      delay: number
    ): T => {
      const lastCallRef = useRef<number>(0);

      return ((...args: any[]) => {
        const now = Date.now();

        if (now - lastCallRef.current >= delay) {
          lastCallRef.current = now;
          callback(...args);
        }
      }) as T;
    },
    []
  );

  /**
   * Optimisation pour les tableaux grandes tailles (virtual scrolling)
   */
  const useVirtualization = useCallback(
    <T>(
      items: T[],
      itemHeight: number,
      containerHeight: number,
      overscan: number = 5
    ) => {
      return useMemo(() => {
        const visibleCount = Math.ceil(containerHeight / itemHeight);
        const startIndex = Math.max(0, 0 - overscan);
        const endIndex = Math.min(items.length - 1, startIndex + visibleCount + overscan * 2);

        return {
          visibleItems: items.slice(startIndex, endIndex + 1),
          startIndex,
          endIndex,
          totalHeight: items.length * itemHeight,
          offsetY: startIndex * itemHeight
        };
      }, [items, itemHeight, containerHeight, overscan]);
    },
    []
  );

  /**
   * Optimisation des chaînes de caractères (markdown parsing)
   */
  const useMarkdownOptimization = useCallback(() => {
    const parseMarkdownChunked = useMemoizedFunction(
      (content: string) => {
        // Parser le markdown par chunks pour éviter le blocage
        const chunkSize = 1000;
        const chunks = [];

        for (let i = 0; i < content.length; i += chunkSize) {
          const chunk = content.slice(i, i + chunkSize);
          // Simulation du parsing (à remplacer par le vrai parser)
          chunks.push(chunk.replace(/\n/g, '<br>'));
        }

        return chunks.join('');
      },
      'markdown-parse'
    );

    return { parseMarkdownChunked };
  }, [useMemoizedFunction]);

  /**
   * Gestion de mémoire pour les gros objets
   */
  const useMemoryManagement = useCallback(() => {
    const cleanup = useCallback(() => {
      // Nettoyer les références circulaires
      if (typeof window !== 'undefined' && 'gc' in window) {
        // Force garbage collection si disponible (développement seulement)
        (window as any).gc?.();
      }
    }, []);

    const optimizeMemory = useCallback(() => {
      // Nettoyer le cache des calculs coûteux
      expensiveCalculationsCache.current.clear();

      // Nettoyer les event listeners inutilisés
      // TODO: Implémenter le nettoyage des listeners

      cleanup();
    }, [cleanup]);

    return { optimizeMemory, cleanup };
  }, []);

  /**
   * Optimisation du rendu des listes
   */
  const useListOptimization = useCallback(<T,>(
    items: T[],
    renderItem: (item: T, index: number) => React.ReactNode,
    getItemKey: (item: T, index: number) => string | number
  ) => {
    return useMemo(() => {
      return items.map((item, index) => ({
        key: getItemKey(item, index),
        element: renderItem(item, index)
      }));
    }, [items, renderItem, getItemKey]);
  }, []);

  return {
    useMemoizedFunction,
    useDebouncedCallback,
    useThrottledCallback,
    useVirtualization,
    useMarkdownOptimization,
    useMemoryManagement,
    useListOptimization
  };
};

export default usePerformanceOptimization;