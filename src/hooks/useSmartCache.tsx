import { useCallback, useRef, useEffect } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
  key: string;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds (default: 5 minutes)
  maxSize?: number; // Maximum number of entries (default: 100)
  enableCompression?: boolean; // Enable data compression for large objects
}

/**
 * Hook pour un cache intelligent avec TTL et gestion de mémoire
 */
export const useSmartCache = <T>(options: CacheOptions = {}) => {
  const {
    ttl = 5 * 60 * 1000, // 5 minutes par défaut
    maxSize = 100,
    enableCompression = false
  } = options;

  const cacheRef = useRef<Map<string, CacheEntry<T>>>(new Map());
  const accessOrderRef = useRef<string[]>([]);

  // Nettoyer les entrées expirées
  const cleanExpiredEntries = useCallback(() => {
    const now = Date.now();
    const cache = cacheRef.current;

    for (const [key, entry] of cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        cache.delete(key);
        // Retirer de l'ordre d'accès
        const index = accessOrderRef.current.indexOf(key);
        if (index > -1) {
          accessOrderRef.current.splice(index, 1);
        }
      }
    }
  }, []);

  // Nettoyer les anciennes entrées si le cache est plein
  const evictOldestEntries = useCallback(() => {
    while (cacheRef.current.size >= maxSize && accessOrderRef.current.length > 0) {
      const oldestKey = accessOrderRef.current.shift();
      if (oldestKey && cacheRef.current.has(oldestKey)) {
        cacheRef.current.delete(oldestKey);
      }
    }
  }, [maxSize]);

  // Compresser les données si nécessaire (simple simulation)
  const compressData = useCallback((data: T): T => {
    if (!enableCompression || typeof data !== 'object') {
      return data;
    }

    // Pour les objets volumineux, on pourrait implémenter une compression réelle
    // Ici, c'est une simulation
    try {
      const jsonString = JSON.stringify(data);
      if (jsonString.length > 10000) { // > 10KB
        console.log('📦 Large object cached, consider implementing compression');
      }
      return data;
    } catch {
      return data;
    }
  }, [enableCompression]);

  // Mettre en cache une valeur
  const set = useCallback((key: string, data: T, customTtl?: number) => {
    cleanExpiredEntries();
    evictOldestEntries();

    const entry: CacheEntry<T> = {
      data: compressData(data),
      timestamp: Date.now(),
      ttl: customTtl || ttl,
      key
    };

    cacheRef.current.set(key, entry);

    // Mettre à jour l'ordre d'accès
    const accessIndex = accessOrderRef.current.indexOf(key);
    if (accessIndex > -1) {
      accessOrderRef.current.splice(accessIndex, 1);
    }
    accessOrderRef.current.push(key);

    return data;
  }, [ttl, cleanExpiredEntries, evictOldestEntries, compressData]);

  // Récupérer une valeur du cache
  const get = useCallback((key: string): T | null => {
    const entry = cacheRef.current.get(key);

    if (!entry) {
      return null;
    }

    // Vérifier si l'entrée est expirée
    if (Date.now() - entry.timestamp > entry.ttl) {
      cacheRef.current.delete(key);
      const index = accessOrderRef.current.indexOf(key);
      if (index > -1) {
        accessOrderRef.current.splice(index, 1);
      }
      return null;
    }

    // Mettre à jour l'ordre d'accès (LRU)
    const accessIndex = accessOrderRef.current.indexOf(key);
    if (accessIndex > -1) {
      accessOrderRef.current.splice(accessIndex, 1);
    }
    accessOrderRef.current.push(key);

    return entry.data;
  }, []);

  // Vérifier si une clé existe et n'est pas expirée
  const has = useCallback((key: string): boolean => {
    return get(key) !== null;
  }, [get]);

  // Supprimer une entrée
  const remove = useCallback((key: string): boolean => {
    const deleted = cacheRef.current.delete(key);
    if (deleted) {
      const index = accessOrderRef.current.indexOf(key);
      if (index > -1) {
        accessOrderRef.current.splice(index, 1);
      }
    }
    return deleted;
  }, []);

  // Vider tout le cache
  const clear = useCallback(() => {
    cacheRef.current.clear();
    accessOrderRef.current = [];
  }, []);

  // Obtenir des statistiques sur le cache
  const getStats = useCallback(() => {
    const cache = cacheRef.current;
    const now = Date.now();
    let expiredCount = 0;
    let totalSize = 0;

    for (const [key, entry] of cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        expiredCount++;
      }
      try {
        totalSize += JSON.stringify(entry.data).length;
      } catch {
        // Ignorer les erreurs de sérialisation
      }
    }

    return {
      size: cache.size,
      maxSize,
      expiredCount,
      hitRate: 0, // Pourrait être calculé avec un compteur
      totalSize: `${(totalSize / 1024).toFixed(2)} KB`,
      oldestEntry: accessOrderRef.current[0] || null,
      newestEntry: accessOrderRef.current[accessOrderRef.current.length - 1] || null
    };
  }, [maxSize]);

  // Précharger des données avec mise en cache automatique
  const preload = useCallback(async (
    key: string,
    fetchFn: () => Promise<T>,
    customTtl?: number
  ): Promise<T> => {
    // Vérifier d'abord si les données sont en cache
    const cached = get(key);
    if (cached !== null) {
      return cached;
    }

    try {
      const data = await fetchFn();
      set(key, data, customTtl);
      return data;
    } catch (error) {
      console.error(`Failed to preload data for key "${key}":`, error);
      throw error;
    }
  }, [get, set]);

  // Nettoyage automatique des entrées expirées
  useEffect(() => {
    const interval = setInterval(cleanExpiredEntries, 60000); // Nettoyer chaque minute
    return () => clearInterval(interval);
  }, [cleanExpiredEntries]);

  return {
    set,
    get,
    has,
    remove,
    clear,
    getStats,
    preload
  };
};

/**
 * Hook spécialisé pour le cache des templates
 */
export const useTemplateCache = () => {
  const cache = useSmartCache<Template>({
    ttl: 10 * 60 * 1000, // 10 minutes pour les templates
    maxSize: 50
  });

  const preloadTemplates = useCallback(async (templateIds: string[]) => {
    const preloadPromises = templateIds.map(async (id) => {
      try {
        return await cache.preload(
          `template-${id}`,
          async () => {
            // Simuler un appel API
            await new Promise(resolve => setTimeout(resolve, 100));
            return { id, name: `Template ${id}`, content: `Content for ${id}` } as Template;
          }
        );
      } catch (error) {
        console.warn(`Failed to preload template ${id}:`, error);
        return null;
      }
    });

    const results = await Promise.allSettled(preloadPromises);
    return results.filter(result => result.status === 'fulfilled').map(result => (result as PromiseFulfilledResult<Template>).value);
  }, [cache]);

  return {
    ...cache,
    preloadTemplates
  };
};

/**
 * Hook spécialisé pour le cache des exports
 */
export const useExportCache = () => {
  const cache = useSmartCache<ExportResult>({
    ttl: 2 * 60 * 1000, // 2 minutes pour les exports
    maxSize: 20
  });

  const getCachedExport = useCallback((markdown: string, format: string) => {
    const key = `export-${format}-${btoa(markdown).substring(0, 50)}`;
    return cache.get(key);
  }, [cache]);

  const setCachedExport = useCallback((markdown: string, format: string, result: ExportResult) => {
    const key = `export-${format}-${btoa(markdown).substring(0, 50)}`;
    return cache.set(key, result);
  }, [cache]);

  return {
    ...cache,
    getCachedExport,
    setCachedExport
  };
};

// Types pour les hooks spécialisés
interface Template {
  id: string;
  name: string;
  content: string;
}

interface ExportResult {
  success: boolean;
  data?: any;
  error?: string;
  timestamp: number;
}

export default useSmartCache;