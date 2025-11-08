import React from 'react';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryKey } from '@tanstack/react-query';

// Configuration du cache avancé
export const CACHE_CONFIG = {
  // Templates: données stables
  templates: {
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 heure
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  },
  // Recent files: données changeantes
  recentFiles: {
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  },
  // PDF previews: données temporaires
  pdfPreviews: {
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 20, // 20 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  },
  // User preferences: très stables
  preferences: {
    staleTime: 1000 * 60 * 60 * 24, // 24 heures
    gcTime: 1000 * 60 * 60 * 48, // 2 jours
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  }
};

// Stratégie de retry avec backoff exponentiel
export const RETRY_CONFIG = {
  default: {
    retry: (failureCount: number, error: any) => {
      // Ne pas retry pour les erreurs 4xx (client)
      if (error?.status >= 400 && error?.status < 500) {
        return false;
      }
      // Retry jusqu'à 3 fois pour les erreurs 5xx (serveur)
      return failureCount < 3;
    },
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000), // Max 30s
  },
  critical: {
    retry: 5, // Plus de retries pour les opérations critiques
    retryDelay: (attemptIndex: number) => Math.min(500 * 1.5 ** attemptIndex, 15000),
  },
  nonCritical: {
    retry: 1, // Seulement 1 retry pour les opérations non critiques
    retryDelay: 1000,
  }
};

// Hook pour le cache hiérarchique
export const useHierarchicalCache = () => {
  const queryClient = useQueryClient();

  // Précharger en cascade les données dépendantes
  const preloadDependencies = React.useCallback((queryKey: QueryKey) => {
    // Si on charge des templates, précharger les catégories
    if (queryKey.includes('templates')) {
      queryClient.prefetchQuery({
        queryKey: ['template-categories'],
        queryFn: async () => {
          // Implémenter la récupération des catégories
          return ['professional', 'academic', 'personal', 'business'];
        },
        staleTime: CACHE_CONFIG.templates.staleTime,
      });
    }

    // Si on charge des fichiers récents, précharger les statistiques
    if (queryKey.includes('recent-files')) {
      queryClient.prefetchQuery({
        queryKey: ['file-stats'],
        queryFn: async () => {
          // Implémenter les statistiques de fichiers
          return { totalFiles: 0, totalSize: 0, lastModified: new Date() };
        },
        staleTime: CACHE_CONFIG.recentFiles.staleTime,
      });
    }
  }, [queryClient]);

  return { preloadDependencies };
};

// Hook pour les mutations avec debounce
export const useDebouncedMutation = <T, V>(
  mutationFn: (variables: V) => Promise<T>,
  delay: number = 300
) => {
  const queryClient = useQueryClient();
  const [debouncedVariables, setDebouncedVariables] = React.useState<V | null>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (debouncedVariables) {
        mutationFn(debouncedVariables);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [debouncedVariables, delay, mutationFn]);

  return React.useCallback((variables: V) => {
    setDebouncedVariables(variables);
  }, []);
};

// Hook pour la persistance du cache
export const useCachePersistence = () => {
  const queryClient = useQueryClient();

  // Sauvegarder l'état du cache dans localStorage
  const saveCacheToStorage = React.useCallback(() => {
    try {
      const cacheData = queryClient.getQueryCache().getAll();
      const persistentData = cacheData
        .filter(query => {
          const queryKey = query.queryKey[0] as string;
          return queryKey === 'templates' || queryKey === 'user-preferences';
        })
        .reduce((acc, query) => {
          const key = JSON.stringify(query.queryKey);
          acc[key] = {
            data: query.state.data,
            dataUpdatedAt: query.state.dataUpdatedAt,
            staleTime: query.options.staleTime,
          };
          return acc;
        }, {} as Record<string, any>);

      localStorage.setItem('react-query-cache', JSON.stringify(persistentData));
    } catch (error) {
      console.warn('Failed to save cache to storage:', error);
    }
  }, [queryClient]);

  // Restaurer le cache depuis localStorage
  const restoreCacheFromStorage = React.useCallback(() => {
    try {
      const stored = localStorage.getItem('react-query-cache');
      if (!stored) return;

      const cacheData = JSON.parse(stored);
      const now = Date.now();

      Object.entries(cacheData).forEach(([key, value]: [string, any]) => {
        const queryKey = JSON.parse(key);
        const age = now - value.dataUpdatedAt;

        // Ne restaurer que si les données ne sont pas trop vieilles
        if (age < (value.staleTime || CACHE_CONFIG.templates.staleTime)) {
          queryClient.setQueryData(queryKey, value.data);
        }
      });
    } catch (error) {
      console.warn('Failed to restore cache from storage:', error);
    }
  }, [queryClient]);

  // Initialiser la restauration au montage
  React.useEffect(() => {
    restoreCacheFromStorage();

    // Sauvegarder périodiquement
    const interval = setInterval(saveCacheToStorage, 1000 * 60 * 5); // Toutes les 5 minutes

    // Sauvegarder avant de quitter la page
    const handleBeforeUnload = saveCacheToStorage;

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('visibilitychange', saveCacheToStorage);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('visibilitychange', saveCacheToStorage);
    };
  }, [saveCacheToStorage, restoreCacheFromStorage]);

  return { saveCacheToStorage, restoreCacheFromStorage };
};

// Hook pour le cache intelligent des previews
export const useIntelligentPreviewCache = () => {
  const queryClient = useQueryClient();

  // Cache LRU pour les previews
  const MAX_CACHED_PREVIEWS = 50;

  const cachePreview = React.useCallback((markdown: string, options: any, previewUrl: string) => {
    const cacheKey = ['pdf-preview', markdown, options];

    // Limiter le nombre de previews en cache
    const existingPreviews = queryClient.getQueryCache().getAll()
      .filter(query => query.queryKey[0] === 'pdf-preview');

    if (existingPreviews.length >= MAX_CACHED_PREVIEWS) {
      // Supprimer les previews les plus anciens
      const oldestQuery = existingPreviews
        .sort((a, b) => (a.state.dataUpdatedAt || 0) - (b.state.dataUpdatedAt || 0))[0];

      if (oldestQuery) {
        queryClient.removeQueries({ queryKey: oldestQuery.queryKey });
      }
    }

    queryClient.setQueryData(cacheKey, previewUrl);
  }, [queryClient]);

  // Précharger les previews basés sur l'usage
  const preloadCommonPreviews = React.useCallback(() => {
    const commonMarkdown = `
# Document Example

This is a sample document for preview caching.

## Features
- **Bold text**
- *Italic text*
- Lists and tables

![Image](https://example.com/image.jpg)
    `.trim();

    // Précharger pour différentes options communes
    const commonOptions = [
      { format: 'a4', orientation: 'portrait', fontSize: 12 },
      { format: 'a4', orientation: 'landscape', fontSize: 12 },
      { format: 'letter', orientation: 'portrait', fontSize: 11 },
    ];

    commonOptions.forEach(options => {
      queryClient.prefetchQuery({
        queryKey: ['pdf-preview', commonMarkdown, options],
        queryFn: async () => {
          // Implémenter la génération de preview
          return '#preview-url';
        },
        staleTime: CACHE_CONFIG.pdfPreviews.staleTime,
      });
    });
  }, [queryClient]);

  React.useEffect(() => {
    // Précharger après un court délai pour ne pas bloquer le rendu initial
    const timer = setTimeout(preloadCommonPreviews, 2000);
    return () => clearTimeout(timer);
  }, [preloadCommonPreviews]);

  return { cachePreview };
};

// Hook pour les mutations avec optimisation avancée
export const useOptimizedMutation = <T, V>(
  mutationFn: (variables: V) => Promise<T>,
  options: {
    queryKey?: QueryKey;
    optimisticUpdate?: (oldData: any, variables: V) => any;
    onSuccess?: (data: T, variables: V) => void;
    onError?: (error: any, variables: V) => void;
    retryConfig?: keyof typeof RETRY_CONFIG;
  } = {}
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    retry: RETRY_CONFIG[options.retryConfig || 'default'].retry,
    retryDelay: RETRY_CONFIG[options.retryConfig || 'default'].retryDelay,
    onMutate: async (variables) => {
      // Annuler les requêtes en cours
      if (options.queryKey) {
        await queryClient.cancelQueries({ queryKey: options.queryKey });
      }

      // Snapshot des données précédentes
      const previousData = options.queryKey
        ? queryClient.getQueryData(options.queryKey)
        : undefined;

      // Optimistic update si configuré
      if (options.optimisticUpdate && options.queryKey && previousData) {
        const optimisticData = options.optimisticUpdate(previousData, variables);
        queryClient.setQueryData(options.queryKey, optimisticData);
      }

      return { previousData };
    },
    onError: (error, variables, context) => {
      // Rollback en cas d'erreur
      if (options.queryKey && context?.previousData !== undefined) {
        queryClient.setQueryData(options.queryKey, context.previousData);
      }

      options.onError?.(error, variables);
    },
    onSuccess: (data, variables) => {
      // Invalider les requêtes liées
      if (options.queryKey) {
        queryClient.invalidateQueries({ queryKey: options.queryKey });
      }

      options.onSuccess?.(data, variables);
    },
  });
};

// Hook principal pour le cache avancé
export const useAdvancedCache = () => {
  const { preloadDependencies } = useHierarchicalCache();
  const { saveCacheToStorage, restoreCacheFromStorage } = useCachePersistence();
  const { cachePreview } = useIntelligentPreviewCache();

  return {
    // Configuration
    CACHE_CONFIG,
    RETRY_CONFIG,

    // Utilitaires
    preloadDependencies,
    saveCacheToStorage,
    restoreCacheFromStorage,
    cachePreview,

    // Hooks spécialisés
    useDebouncedMutation,
    useOptimizedMutation,
  };
};