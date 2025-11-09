import { useEffect, useRef, useState, useCallback } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage?: number;
  componentName: string;
  timestamp: number;
}

interface PerformanceOptions {
  enableMemoryTracking?: boolean;
  enableRenderTimeTracking?: boolean;
  maxHistorySize?: number;
  alertThreshold?: number; // ms
}

/**
 * Hook pour suivre et optimiser les performances des composants
 */
export const usePerformanceMonitor = (options: PerformanceOptions = {}) => {
  const {
    enableMemoryTracking = false,
    enableRenderTimeTracking = true,
    maxHistorySize = 50,
    alertThreshold = 100 // alerte si rendu > 100ms
  } = options;

  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
  const [isPerformanceIssue, setIsPerformanceIssue] = useState(false);
  const renderStartRef = useRef<number>(0);
  const metricsHistoryRef = useRef<PerformanceMetrics[]>([]);

  // Démarrer le suivi du temps de rendu
  const startRenderTracking = useCallback(() => {
    if (enableRenderTimeTracking) {
      renderStartRef.current = performance.now();
    }
  }, [enableRenderTimeTracking]);

  // Fin du suivi du temps de rendu
  const endRenderTracking = useCallback((componentName: string) => {
    if (!enableRenderTimeTracking || renderStartRef.current === 0) return;

    const renderTime = performance.now() - renderStartRef.current;
    const newMetric: PerformanceMetrics = {
      renderTime,
      memoryUsage: enableMemoryTracking && 'memory' in performance ?
        (performance as any).memory.usedJSHeapSize : undefined,
      componentName,
      timestamp: Date.now()
    };

    // Ajouter à l'historique
    metricsHistoryRef.current.push(newMetric);

    // Limiter la taille de l'historique
    if (metricsHistoryRef.current.length > maxHistorySize) {
      metricsHistoryRef.current.shift();
    }

    setMetrics([...metricsHistoryRef.current]);

    // Vérifier les problèmes de performance
    if (renderTime > alertThreshold) {
      setIsPerformanceIssue(true);
      console.warn(`⚠️ Performance alert: ${componentName} took ${renderTime.toFixed(2)}ms to render`);
    }

    renderStartRef.current = 0;
  }, [enableRenderTimeTracking, enableMemoryTracking, maxHistorySize, alertThreshold]);

  // Obtenir les statistiques de performance
  const getPerformanceStats = useCallback(() => {
    if (metricsHistoryRef.current.length === 0) return null;

    const renderTimes = metricsHistoryRef.current.map(m => m.renderTime);
    const avgRenderTime = renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length;
    const maxRenderTime = Math.max(...renderTimes);
    const minRenderTime = Math.min(...renderTimes);

    return {
      avgRenderTime: avgRenderTime.toFixed(2),
      maxRenderTime: maxRenderTime.toFixed(2),
      minRenderTime: minRenderTime.toFixed(2),
      totalMeasurements: metricsHistoryRef.current.length,
      memoryUsage: enableMemoryTracking && 'memory' in performance ? {
        used: (performance as any).memory.usedJSHeapSize,
        total: (performance as any).memory.totalJSHeapSize,
        limit: (performance as any).memory.jsHeapSizeLimit
      } : null
    };
  }, [enableMemoryTracking]);

  // Nettoyer l'historique
  const clearMetrics = useCallback(() => {
    metricsHistoryRef.current = [];
    setMetrics([]);
    setIsPerformanceIssue(false);
  }, []);

  // Effet pour le suivi automatique des composants
  const useComponentTracking = useCallback((componentName: string) => {
    useEffect(() => {
      startRenderTracking();
      return () => {
        endRenderTracking(componentName);
      };
    }, [componentName, startRenderTracking, endRenderTracking]);
  }, [startRenderTracking, endRenderTracking]);

  return {
    metrics,
    isPerformanceIssue,
    getPerformanceStats,
    clearMetrics,
    startRenderTracking,
    endRenderTracking,
    useComponentTracking
  };
};

/**
 * Hook pour optimiser le rendu des composants lourds
 */
export const useRenderOptimization = (options: {
  debounceMs?: number;
  shouldDebounce?: boolean;
} = {}) => {
  const { debounceMs = 16, shouldDebounce = false } = options;
  const [isRendering, setIsRendering] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const optimizedRender = useCallback((
    renderFn: () => void,
    dependencies: any[] = []
  ) => {
    if (shouldDebounce) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setIsRendering(true);
      timeoutRef.current = setTimeout(() => {
        renderFn();
        setIsRendering(false);
      }, debounceMs);
    } else {
      renderFn();
    }
  }, [shouldDebounce, debounceMs]);

  // Nettoyer le timeout au démontage
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isRendering,
    optimizedRender
  };
};

/**
 * Hook pour le suivi de la latence des interactions
 */
export const useLatencyTracker = () => {
  const [latencies, setLatencies] = useState<{action: string, latency: number, timestamp: number}[]>([]);
  const interactionStartRef = useRef<number>(0);

  const startTracking = useCallback((action: string) => {
    interactionStartRef.current = performance.now();
  }, []);

  const endTracking = useCallback((action: string) => {
    if (interactionStartRef.current === 0) return;

    const latency = performance.now() - interactionStartRef.current;
    const newLatency = {
      action,
      latency,
      timestamp: Date.now()
    };

    setLatencies(prev => [...prev.slice(-49), newLatency]); // Garder les 50 dernières
    interactionStartRef.current = 0;
  }, []);

  const getAverageLatency = useCallback((action?: string) => {
    const relevantLatencies = action
      ? latencies.filter(l => l.action === action)
      : latencies;

    if (relevantLatencies.length === 0) return 0;

    const total = relevantLatencies.reduce((sum, l) => sum + l.latency, 0);
    return total / relevantLatencies.length;
  }, [latencies]);

  return {
    latencies,
    startTracking,
    endTracking,
    getAverageLatency
  };
};

export default usePerformanceMonitor;