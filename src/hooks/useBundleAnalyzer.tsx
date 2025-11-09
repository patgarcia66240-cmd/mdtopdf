import { useEffect, useState } from 'react';

interface BundleInfo {
  name: string;
  size: number;
  loaded: boolean;
  loadingTime?: number;
}

interface BundleMetrics {
  totalSize: number;
  loadedSize: number;
  chunks: BundleInfo[];
  loadingProgress: number;
}

export const useBundleAnalyzer = () => {
  const [metrics, setMetrics] = useState<BundleMetrics>({
    totalSize: 0,
    loadedSize: 0,
    chunks: [],
    loadingProgress: 0
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Analyser les bundles chargés
  const analyzeBundles = () => {
    if (typeof window === 'undefined' || !('performance' in window)) {
      return;
    }

    setIsAnalyzing(true);

    // Observer les ressources chargées
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const chunks: BundleInfo[] = [];

      entries.forEach((entry) => {
        if (entry.name.includes('.js') || entry.name.includes('.css')) {
          const resource = entry as PerformanceResourceTiming;
          chunks.push({
            name: resource.name.split('/').pop() || 'unknown',
            size: resource.transferSize || 0,
            loaded: true,
            loadingTime: resource.responseEnd - resource.requestStart
          });
        }
      });

      const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0);
      const loadedSize = chunks.filter(chunk => chunk.loaded).reduce((sum, chunk) => sum + chunk.size, 0);

      setMetrics({
        totalSize,
        loadedSize,
        chunks,
        loadingProgress: totalSize > 0 ? (loadedSize / totalSize) * 100 : 0
      });
    });

    observer.observe({ entryTypes: ['resource'] });

    // Nettoyer après 5 secondes
    setTimeout(() => {
      observer.disconnect();
      setIsAnalyzing(false);
    }, 5000);
  };

  // Formater la taille des bundles
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Obtenir les bundles les plus gros
  const getLargestBundles = (limit: number = 5) => {
    return metrics.chunks
      .sort((a, b) => b.size - a.size)
      .slice(0, limit);
  };

  // Obtenir les bundles les plus lents
  const getSlowestBundles = (limit: number = 5) => {
    return metrics.chunks
      .filter(chunk => chunk.loadingTime !== undefined)
      .sort((a, b) => (b.loadingTime || 0) - (a.loadingTime || 0))
      .slice(0, limit);
  };

  // Calculer le score de performance des bundles
  const getBundleScore = () => {
    const { totalSize, loadingProgress, chunks } = metrics;

    // Score basé sur la taille totale (plus petit = meilleur)
    const sizeScore = Math.max(0, 100 - (totalSize / 1000)); // -1 point par KB

    // Score basé sur le temps de chargement moyen
    const avgLoadingTime = chunks
      .filter(c => c.loadingTime)
      .reduce((sum, c) => sum + (c.loadingTime || 0), 0) / chunks.length || 0;
    const speedScore = Math.max(0, 100 - (avgLoadingTime / 10)); // -1 point par 10ms

    // Score basé sur le nombre de chunks (plus optimisé = meilleur)
    const chunkCountScore = Math.max(0, 100 - chunks.length);

    // Score basé sur le chargement progressif
    const progressScore = loadingProgress;

    return Math.round((sizeScore + speedScore + chunkCountScore + progressScore) / 4);
  };

  // Détecter les problèmes de performance
  const detectPerformanceIssues = () => {
    const issues: string[] = [];

    if (metrics.totalSize > 500 * 1024) { // > 500KB
      issues.push('Taille totale des bundles élevée (> 500KB)');
    }

    const largeChunks = metrics.chunks.filter(chunk => chunk.size > 100 * 1024); // > 100KB
    if (largeChunks.length > 0) {
      issues.push(`${largeChunks.length} chunk(s) trop volumineux(s) (> 100KB)`);
    }

    const slowChunks = metrics.chunks.filter(chunk => (chunk.loadingTime || 0) > 1000); // > 1s
    if (slowChunks.length > 0) {
      issues.push(`${slowChunks.length} chunk(s) lent(s) (> 1s)`);
    }

    if (metrics.chunks.length > 20) {
      issues.push('Trop nombreux chunks (fragmentation excessive)');
    }

    if (metrics.loadingProgress < 100) {
      issues.push('Chargement incomplet des bundles');
    }

    return issues;
  };

  // Suggestions d'optimisation
  const getOptimizationSuggestions = () => {
    const suggestions: string[] = [];

    if (metrics.totalSize > 500 * 1024) {
      suggestions.push('Envisagez le code splitting supplémentaire');
      suggestions.push('Utilisez le dynamic import pour les composants lourds');
    }

    const largeChunks = getLargestBundles();
    if (largeChunks.length > 0 && largeChunks[0].size > 100 * 1024) {
      suggestions.push(`Divisez le bundle "${largeChunks[0].name}" (${formatSize(largeChunks[0].size)})`);
    }

    const slowChunks = getSlowestBundles();
    if (slowChunks.length > 0 && (slowChunks[0].loadingTime || 0) > 1000) {
      suggestions.push(`Optimisez le chargement de "${slowChunks[0].name}"`);
    }

    if (metrics.chunks.length > 20) {
      suggestions.push('Consolidez certains petits chunks pour réduire le nombre de requêtes');
    }

    return suggestions;
  };

  return {
    metrics,
    isAnalyzing,
    analyzeBundles,
    formatSize,
    getLargestBundles,
    getSlowestBundles,
    getBundleScore,
    detectPerformanceIssues,
    getOptimizationSuggestions
  };
};

export default useBundleAnalyzer;