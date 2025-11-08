import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pdfService } from '../../services/pdfService';
import { PDFOptions } from '../../types/app';
import { useAdvancedCache, useDebouncedMutation, CACHE_CONFIG } from './useAdvancedCache';

interface UseSmartPreviewOptions {
  debounceMs?: number;
  maxCacheSize?: number;
  preloadCommonPreviews?: boolean;
}

interface UseSmartPreviewReturn {
  previewUrl: string | undefined;
  isLoading: boolean;
  error: string | null;
  generatePreview: (markdown: string, options: PDFOptions) => void;
  generatePreviewImmediate: (markdown: string, options: PDFOptions) => Promise<string>;
  clearPreview: () => void;
  preloadPreview: (markdown: string, options: PDFOptions) => void;
  cacheStats: {
    cachedPreviews: number;
    totalCacheSize: number;
  };
}

export const useSmartPreview = (options: UseSmartPreviewOptions = {}): UseSmartPreviewReturn => {
  const {
    debounceMs = 500,
    maxCacheSize = 50,
    preloadCommonPreviews = true
  } = options;

  const queryClient = useQueryClient();
  const { cachePreview } = useAdvancedCache();

  // État pour le markdown et options actuels
  const [currentMarkdown, setCurrentMarkdown] = React.useState<string>('');
  const [currentOptions, setCurrentOptions] = React.useState<PDFOptions>({});

  // Generate preview avec debounce
  const debouncedGeneratePreview = useDebouncedMutation(
    async ({ markdown, options }: { markdown: string; options: PDFOptions }) => {
      return pdfService.generatePDFPreview(markdown, options);
    },
    debounceMs
  );

  // Query pour le preview avec cache intelligent
  const {
    data: previewUrl,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['pdf-preview', currentMarkdown, currentOptions],
    queryFn: () => pdfService.generatePDFPreview(currentMarkdown, currentOptions),
    enabled: !!currentMarkdown.trim(),
    staleTime: CACHE_CONFIG.pdfPreviews.staleTime,
    gcTime: CACHE_CONFIG.pdfPreviews.gcTime,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    retryDelay: 1000,
  });

  // Génération de preview immédiate (sans debounce)
  const generatePreviewImmediate = React.useCallback(async (
    markdown: string,
    options: PDFOptions
  ): Promise<string> => {
    const cacheKey = ['pdf-preview', markdown, options];

    // Vérifier si déjà en cache
    const cached = queryClient.getQueryData(cacheKey);
    if (cached) {
      return cached as string;
    }

    // Générer et mettre en cache
    try {
      const previewUrl = await pdfService.generatePDFPreview(markdown, options);

      // Gérer la taille du cache (LRU)
      const existingPreviews = queryClient.getQueryCache().getAll()
        .filter(query => query.queryKey[0] === 'pdf-preview');

      if (existingPreviews.length >= maxCacheSize) {
        // Supprimer les previews les plus anciens
        const oldestQueries = existingPreviews
          .sort((a, b) => (a.state.dataUpdatedAt || 0) - (b.state.dataUpdatedAt || 0))
          .slice(0, existingPreviews.length - maxCacheSize + 1);

        oldestQueries.forEach(query => {
          queryClient.removeQueries({ queryKey: query.queryKey });
        });
      }

      // Mettre en cache
      cachePreview(markdown, options, previewUrl);
      queryClient.setQueryData(cacheKey, previewUrl);

      return previewUrl;
    } catch (error) {
      console.error('Preview generation failed:', error);
      throw error;
    }
  }, [queryClient, maxCacheSize, cachePreview]);

  // Génération de preview avec debounce
  const generatePreview = React.useCallback((markdown: string, options: PDFOptions) => {
    setCurrentMarkdown(markdown);
    setCurrentOptions(options);
    debouncedGeneratePreview({ markdown, options });
  }, [debouncedGeneratePreview]);

  // Précharger un preview
  const preloadPreview = React.useCallback((markdown: string, options: PDFOptions) => {
    queryClient.prefetchQuery({
      queryKey: ['pdf-preview', markdown, options],
      queryFn: () => pdfService.generatePDFPreview(markdown, options),
      staleTime: CACHE_CONFIG.pdfPreviews.staleTime,
    });
  }, [queryClient]);

  // Nettoyer le preview
  const clearPreview = React.useCallback(() => {
    setCurrentMarkdown('');
    setCurrentOptions({});
    queryClient.removeQueries({ queryKey: ['pdf-preview'] });
  }, [queryClient]);

  // Précharger les previews communs
  React.useEffect(() => {
    if (!preloadCommonPreviews) return;

    const timer = setTimeout(() => {
      const commonMarkdown = `
# Document Professional

## Overview
This is a sample document that demonstrates the PDF generation capabilities.

## Features
- **Bold text** for emphasis
- *Italic text* for subtle highlighting
- Lists and tables
- Code blocks
- Images and links

## Sample Table
| Feature | Status | Priority |
|---------|--------|----------|
| PDF Export | ✅ | High |
| Templates | ✅ | Medium |
| Custom Styles | 🚧 | Low |

> This is a blockquote for important information.

\`\`\`javascript
// Code example
function generatePDF() {
  console.log('PDF generation');
}
\`\`\`

## Conclusion
This preview showcases the professional PDF export capabilities.
      `.trim();

      const commonOptions = [
        { format: 'a4' as const, orientation: 'portrait' as const, fontSize: 12, fontFamily: 'Inter' },
        { format: 'a4' as const, orientation: 'landscape' as const, fontSize: 12, fontFamily: 'Inter' },
        { format: 'letter' as const, orientation: 'portrait' as const, fontSize: 11, fontFamily: 'Inter' },
        { format: 'a4' as const, orientation: 'portrait' as const, fontSize: 14, fontFamily: 'Times New Roman' },
      ];

      commonOptions.forEach(options => {
        preloadPreview(commonMarkdown, options);
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [preloadCommonPreviews, preloadPreview]);

  // Statistiques du cache
  const cacheStats = React.useMemo(() => {
    const cachedPreviews = queryClient.getQueryCache().getAll()
      .filter(query => query.queryKey[0] === 'pdf-preview');

    return {
      cachedPreviews: cachedPreviews.length,
      totalCacheSize: cachedPreviews.reduce((total, query) => {
        const url = query.state.data as string | undefined;
        return total + (url?.length || 0);
      }, 0)
    };
  }, [queryClient]);

  // Nettoyer les URLs objets quand le composant est démonté
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return {
    previewUrl,
    isLoading,
    error: error?.message || null,
    generatePreview,
    generatePreviewImmediate,
    clearPreview,
    preloadPreview,
    cacheStats,
  };
};

// Hook pour les previews multiples (pour comparer différentes options)
export const useMultiplePreviews = (
  baseMarkdown: string,
  optionsList: PDFOptions[]
) => {
  const queryClient = useQueryClient();

  const previews = useQuery({
    queryKey: ['pdf-previews', baseMarkdown, optionsList],
    queryFn: async () => {
      const results = await Promise.allSettled(
        optionsList.map(options =>
          pdfService.generatePDFPreview(baseMarkdown, options)
        )
      );

      return results.map((result, index) => ({
        options: optionsList[index],
        url: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason : null,
      }));
    },
    enabled: !!baseMarkdown.trim() && optionsList.length > 0,
    staleTime: CACHE_CONFIG.pdfPreviews.staleTime,
    retry: 2,
  });

  const generateAllPreviews = React.useCallback(() => {
    optionsList.forEach(options => {
      queryClient.prefetchQuery({
        queryKey: ['pdf-preview', baseMarkdown, options],
        queryFn: () => pdfService.generatePDFPreview(baseMarkdown, options),
        staleTime: CACHE_CONFIG.pdfPreviews.staleTime,
      });
    });
  }, [baseMarkdown, optionsList, queryClient]);

  return {
    previews: previews.data || [],
    isLoading: previews.isLoading,
    error: previews.error,
    generateAllPreviews,
    refetch: previews.refetch,
  };
};

// Hook pour le monitoring des performances de preview
export const usePreviewPerformance = () => {
  const [metrics, setMetrics] = React.useState({
    averageGenerationTime: 0,
    totalGenerated: 0,
    cacheHitRate: 0,
    errorRate: 0,
  });

  const { data: performanceData } = useQuery({
    queryKey: ['preview-performance'],
    queryFn: async () => {
      // Simuler la récupération des données de performance
      // En production, cela viendrait d'un service de monitoring
      return {
        averageGenerationTime: Math.random() * 2000 + 500,
        totalGenerated: Math.floor(Math.random() * 1000),
        cacheHitRate: Math.random() * 100,
        errorRate: Math.random() * 5,
      };
    },
    staleTime: 1000 * 60, // 1 minute
    refetchInterval: 1000 * 60 * 5, // 5 minutes
  });

  React.useEffect(() => {
    if (performanceData) {
      setMetrics(performanceData);
    }
  }, [performanceData]);

  return metrics;
};