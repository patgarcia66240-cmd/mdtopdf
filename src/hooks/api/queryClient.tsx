import React from 'react';
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query';

// Configuration avancée du QueryClient
export const createOptimizedQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Configuration globale des queries
        staleTime: 1000 * 60 * 5, // 5 minutes par défaut
        gcTime: 1000 * 60 * 10, // 10 minutes avant garbage collection
        retry: (failureCount, error: any) => {
          // Ne pas retry pour les erreurs client (4xx)
          if (error?.status >= 400 && error?.status < 500) {
            return false;
          }
          // Retry jusqu'à 3 fois pour les erreurs serveur (5xx)
          return failureCount < 3;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Max 30s
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchOnMount: true,
        networkMode: 'online',
      },
      mutations: {
        // Configuration globale des mutations
        retry: 1,
        retryDelay: 1000,
        networkMode: 'online',
      },
    },
    queryCache: new QueryCache(),
    mutationCache: new MutationCache(),
  });
};

// Créer le client par défaut
export const queryClient = createOptimizedQueryClient();

// Hook pour la persistance du cache dans localStorage (implémentation manuelle)
export const useQueryPersistence = () => {
  const queryClient = queryClient;

  // Sauvegarder le cache dans localStorage
  const saveCacheToStorage = React.useCallback(() => {
    if (!queryClient) return;

    try {
      const queryCache = queryClient.getQueryCache();
      const queries = queryCache.getAll();

      // Sélectionner seulement les queries importantes à persister
      const persistentQueries = queries.filter(query => {
        const key = query.queryKey[0] as string;
        return key === 'templates' || key === 'user-preferences';
      });

      const cacheData = persistentQueries.reduce((acc, query) => {
        const key = JSON.stringify(query.queryKey);
        acc[key] = {
          data: query.state.data,
          dataUpdatedAt: query.state.dataUpdatedAt,
          staleTime: query.options.staleTime,
        };
        return acc;
      }, {} as Record<string, any>);

      localStorage.setItem('mdtopdf-query-cache', JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to save cache to storage:', error);
    }
  }, [queryClient]);

  // Restaurer le cache depuis localStorage
  const restoreCacheFromStorage = React.useCallback(() => {
    if (!queryClient) return;

    try {
      const stored = localStorage.getItem('mdtopdf-query-cache');
      if (!stored) return;

      const cacheData = JSON.parse(stored);
      const now = Date.now();

      Object.entries(cacheData).forEach(([key, value]: [string, any]) => {
        const queryKey = JSON.parse(key);
        const age = now - value.dataUpdatedAt;

        // Ne restaurer que si les données ne sont pas trop vieilles
        if (age < (value.staleTime || 1000 * 60 * 30)) { // 30 minutes par défaut
          queryClient.setQueryData(queryKey, value.data);
        }
      });
    } catch (error) {
      console.warn('Failed to restore cache from storage:', error);
    }
  }, [queryClient]);

  // Initialiser la restauration et la sauvegarde
  React.useEffect(() => {
    // Restaurer au montage
    restoreCacheFromStorage();

    // Sauvegarder périodiquement
    const interval = setInterval(saveCacheToStorage, 1000 * 60 * 2); // Toutes les 2 minutes

    // Sauvegarder avant de quitter la page
    const handleBeforeUnload = saveCacheToStorage;
    const handleVisibilityChange = saveCacheToStorage;

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [saveCacheToStorage, restoreCacheFromStorage]);

  return { saveCacheToStorage, restoreCacheFromStorage };
};

// Provider TanStack Query optimisé
interface QueryProviderProps {
  children: React.ReactNode;
  client?: QueryClient;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({
  children,
  client = queryClient
}) => {
  // Activer la persistance
  useQueryPersistence();

  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  );
};

// Hook pour le monitoring des performances
export const useQueryPerformanceMonitor = () => {
  const queryClient = queryClient;

  const getQueryStats = React.useCallback(() => {
    const queryCache = queryClient?.getQueryCache();
    if (!queryCache) return null;

    const queries = queryCache.getAll();
    const mutationCache = queryClient?.getMutationCache();
    const mutations = mutationCache?.getAll() || [];

    return {
      // Stats des queries
      totalQueries: queries.length,
      activeQueries: queries.filter(q => q.state.fetchStatus === 'fetching').length,
      staleQueries: queries.filter(q => q.isStale()).length,
      inactiveQueries: queries.filter(q => !q.getObserversCount()).length,

      // Stats des mutations
      totalMutations: mutations.length,
      activeMutations: mutations.filter(m => m.state.status === 'pending').length,

      // Performance
      averageQueryTime: queries.reduce((sum, q) => sum + (q.state.dataFetchTime || 0), 0) / queries.length,
      cacheSize: JSON.stringify(queries.map(q => ({ key: q.queryKey, data: q.state.data }))).length,
    };
  }, [queryClient]);

  const [stats, setStats] = React.useState(getQueryStats());

  // Mettre à jour les stats périodiquement
  React.useEffect(() => {
    const interval = setInterval(() => {
      setStats(getQueryStats());
    }, 5000); // Toutes les 5 secondes

    return () => clearInterval(interval);
  }, [getQueryStats]);

  const clearCache = React.useCallback(() => {
    queryClient?.clear();
  }, [queryClient]);

  const refetchAllQueries = React.useCallback(() => {
    queryClient?.refetchQueries();
  }, [queryClient]);

  const invalidateAllQueries = React.useCallback(() => {
    queryClient?.invalidateQueries();
  }, [queryClient]);

  return {
    stats,
    getQueryStats,
    clearCache,
    refetchAllQueries,
    invalidateAllQueries,
  };
};

// Hook pour le débogage des queries
export const useQueryDebugger = () => {
  const queryClient = queryClient;

  const logQueryState = React.useCallback(() => {
    const queryCache = queryClient?.getQueryCache();
    if (!queryCache) return;

    const queries = queryCache.getAll();
    console.group('🔍 Query Debug Information');
    console.log('Total Queries:', queries.length);

    queries.forEach(query => {
      console.group(`Query: ${JSON.stringify(query.queryKey)}`);
      console.log('Status:', query.state.fetchStatus);
      console.log('Data Updated:', new Date(query.state.dataUpdatedAt || 0).toLocaleTimeString());
      console.log('Stale:', query.isStale());
      console.log('Observers:', query.getObserversCount());
      console.log('Data:', query.state.data);
      console.groupEnd();
    });

    console.groupEnd();
  }, [queryClient]);

  return { logQueryState };
};

export default queryClient;