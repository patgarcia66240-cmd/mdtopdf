import React from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface CacheMetrics {
  totalQueries: number;
  activeQueries: number;
  staleQueries: number;
  inactiveQueries: number;
  totalMutations: number;
  activeMutations: number;
  averageQueryTime: number;
  cacheSize: number;
  hitRate: number;
  errorRate: number;
}

interface UseCacheMonitorReturn extends CacheMetrics {
  clearCache: () => void;
  refetchAllQueries: () => void;
  invalidateAllQueries: () => void;
  resetMetrics: () => void;
  getDetailedStats: () => any;
}

export const useCacheMonitor = (): UseCacheMonitorReturn => {
  const queryClient = useQueryClient();

  const [metrics, setMetrics] = React.useState<CacheMetrics>({
    totalQueries: 0,
    activeQueries: 0,
    staleQueries: 0,
    inactiveQueries: 0,
    totalMutations: 0,
    activeMutations: 0,
    averageQueryTime: 0,
    cacheSize: 0,
    hitRate: 0,
    errorRate: 0,
  });

  // Fonction pour calculer les métriques
  const calculateMetrics = React.useCallback((): CacheMetrics => {
    const queryCache = queryClient.getQueryCache();
    const mutationCache = queryClient.getMutationCache();

    if (!queryCache || !mutationCache) {
      return {
        totalQueries: 0,
        activeQueries: 0,
        staleQueries: 0,
        inactiveQueries: 0,
        totalMutations: 0,
        activeMutations: 0,
        averageQueryTime: 0,
        cacheSize: 0,
        hitRate: 0,
        errorRate: 0,
      };
    }

    const queries = queryCache.getAll();
    const mutations = mutationCache.getAll();

    const totalQueries = queries.length;
    const activeQueries = queries.filter(q => q.state.fetchStatus === 'fetching').length;
    const staleQueries = queries.filter(q => q.isStale()).length;
    const inactiveQueries = queries.filter(q => q.getObserversCount() === 0).length;
    const totalMutations = mutations.length;
    const activeMutations = mutations.filter(m => m.state.status === 'pending').length;

    // Calculer le temps moyen des queries
    const queryTimes = queries
      .map(q => q.state.dataFetchTime || 0)
      .filter(time => time > 0);
    const averageQueryTime = queryTimes.length > 0
      ? queryTimes.reduce((sum, time) => sum + time, 0) / queryTimes.length
      : 0;

    // Estimer la taille du cache (approximation)
    const cacheData = queries.map(q => ({
      key: q.queryKey,
      data: q.state.data,
    }));
    const cacheSize = new Blob([JSON.stringify(cacheData)]).size;

    // Calculer les taux (simulation basée sur l'état)
    const successfulQueries = queries.filter(q => q.state.status === 'success').length;
    const failedQueries = queries.filter(q => q.state.status === 'error').length;
    const hitRate = successfulQueries > 0 ? (successfulQueries / totalQueries) * 100 : 0;
    const errorRate = failedQueries > 0 ? (failedQueries / totalQueries) * 100 : 0;

    return {
      totalQueries,
      activeQueries,
      staleQueries,
      inactiveQueries,
      totalMutations,
      activeMutations,
      averageQueryTime,
      cacheSize,
      hitRate,
      errorRate,
    };
  }, [queryClient]);

  // Mettre à jour les métriques périodiquement
  React.useEffect(() => {
    const updateMetrics = () => {
      const newMetrics = calculateMetrics();
      setMetrics(newMetrics);
    };

    // Mettre à jour immédiatement
    updateMetrics();

    // Mettre à jour toutes les 3 secondes
    const interval = setInterval(updateMetrics, 3000);

    return () => clearInterval(interval);
  }, [calculateMetrics]);

  // Actions sur le cache
  const clearCache = React.useCallback(() => {
    queryClient.clear();
    setMetrics(calculateMetrics());
  }, [queryClient, calculateMetrics]);

  const refetchAllQueries = React.useCallback(() => {
    queryClient.refetchQueries();
  }, [queryClient]);

  const invalidateAllQueries = React.useCallback(() => {
    queryClient.invalidateQueries();
  }, [queryClient]);

  const resetMetrics = React.useCallback(() => {
    setMetrics(calculateMetrics());
  }, [calculateMetrics]);

  // Obtenir des statistiques détaillées
  const getDetailedStats = React.useCallback(() => {
    const queryCache = queryClient.getQueryCache();
    const mutationCache = queryClient.getMutationCache();

    if (!queryCache || !mutationCache) {
      return null;
    }

    const queries = queryCache.getAll();
    const mutations = mutationCache.getAll();

    // Analyse des queries par type
    const queriesByType = queries.reduce((acc, query) => {
      const type = query.queryKey[0] as string;
      if (!acc[type]) acc[type] = [];
      acc[type].push(query);
      return acc;
    }, {} as Record<string, any[]>);

    // Analyse des erreurs
    const errors = queries
      .filter(q => q.state.status === 'error')
      .map(q => ({
        queryKey: q.queryKey,
        error: q.state.error,
        errorCount: q.state.errorUpdateCount || 0,
      }));

    // Analyse des temps de réponse
    const responseTimes = queries
      .map(q => ({
        queryKey: q.queryKey,
        fetchTime: q.state.dataFetchTime || 0,
        lastUpdated: q.state.dataUpdatedAt || 0,
      }))
      .filter(q => q.fetchTime > 0)
      .sort((a, b) => b.fetchTime - a.fetchTime);

    return {
      summary: metrics,
      queriesByType,
      errors,
      slowestQueries: responseTimes.slice(0, 10),
      fastestQueries: responseTimes.slice(-10),
      cacheAge: Date.now() - Math.min(...queries.map(q => q.state.dataUpdatedAt || Date.now())),
    };
  }, [queryClient, mutationCache, metrics, queries, mutations]);

  return {
    ...metrics,
    clearCache,
    refetchAllQueries,
    invalidateAllQueries,
    resetMetrics,
    getDetailedStats,
  };
};

// Hook pour le monitoring en temps réel des performances
export const useRealTimePerformanceMonitor = () => {
  const [isMonitoring, setIsMonitoring] = React.useState(false);
  const [performanceHistory, setPerformanceHistory] = React.useState<any[]>([]);

  const addPerformanceSnapshot = React.useCallback((snapshot: any) => {
    setPerformanceHistory(prev => [...prev.slice(-29), { ...snapshot, timestamp: Date.now() }]);
  }, []);

  const startMonitoring = React.useCallback(() => {
    setIsMonitoring(true);
    console.log('🚀 Performance monitoring started');
  }, []);

  const stopMonitoring = React.useCallback(() => {
    setIsMonitoring(false);
    console.log('⏹️ Performance monitoring stopped');
  }, []);

  const exportPerformanceData = React.useCallback(() => {
    const dataStr = JSON.stringify(performanceHistory, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-data-${new Date().toISOString()}.json`;
    a.click();

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  }, [performanceHistory]);

  return {
    isMonitoring,
    performanceHistory,
    startMonitoring,
    stopMonitoring,
    addPerformanceSnapshot,
    exportPerformanceData,
  };
};

// Hook pour l'analyse des patterns d'utilisation du cache
export const useCacheAnalytics = () => {
  const queryClient = useQueryClient();

  const analyzeUsagePatterns = React.useCallback(() => {
    const queryCache = queryClient.getQueryCache();
    if (!queryCache) return null;

    const queries = queryCache.getAll();

    // Patterns d'accès les plus fréquents
    const queryKeys = queries.map(q => JSON.stringify(q.queryKey));
    const keyFrequency = queryKeys.reduce((acc, key) => {
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostUsedQueries = Object.entries(keyFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([key, count]) => ({ key, count }));

    // Queries qui ont le plus d'observateurs
    const mostObservedQueries = queries
      .map(q => ({
        key: JSON.stringify(q.queryKey),
        observers: q.getObserversCount(),
        stale: q.isStale(),
      }))
      .sort((a, b) => b.observers - a.observers)
      .slice(0, 10);

    // Queries inactives (candidates pour nettoyage)
    const inactiveQueries = queries
      .filter(q => q.getObserversCount() === 0)
      .sort((a, b) => (a.state.dataUpdatedAt || 0) - (b.state.dataUpdatedAt || 0));

    // Taux de cache par type de query
    const cacheHitRatesByType = queries.reduce((acc, query) => {
      const type = query.queryKey[0] as string;
      if (!acc[type]) acc[type] = { total: 0, hits: 0 };
      acc[type].total++;
      if (query.state.status === 'success') acc[type].hits++;
      return acc;
    }, {} as Record<string, { total: number; hits: number }>);

    const hitRates = Object.entries(cacheHitRatesByType).map(([type, stats]) => ({
      type,
      hitRate: stats.total > 0 ? (stats.hits / stats.total) * 100 : 0,
      total: stats.total,
    }));

    return {
      mostUsedQueries,
      mostObservedQueries,
      inactiveQueries,
      hitRates,
      totalQueries: queries.length,
    };
  }, [queryClient]);

  const getOptimizationSuggestions = React.useCallback(() => {
    const analysis = analyzeUsagePatterns();
    if (!analysis) return [];

    const suggestions = [];

    // Suggestions basées sur les queries inactives
    if (analysis.inactiveQueries.length > 10) {
      suggestions.push({
        type: 'cleanup',
        priority: 'medium',
        message: `${analysis.inactiveQueries.length} queries inactives peuvent être nettoyées`,
        action: 'cleanInactiveQueries',
      });
    }

    // Suggestions basées sur les taux de cache
    const lowHitRateTypes = analysis.hitRates.filter(t => t.hitRate < 50);
    if (lowHitRateTypes.length > 0) {
      suggestions.push({
        type: 'optimization',
        priority: 'low',
        message: `Faible taux de cache pour: ${lowHitRateTypes.map(t => t.type).join(', ')}`,
        action: 'increaseStaleTime',
      });
    }

    return suggestions;
  }, [analyzeUsagePatterns]);

  return {
    analyzeUsagePatterns,
    getOptimizationSuggestions,
  };
};