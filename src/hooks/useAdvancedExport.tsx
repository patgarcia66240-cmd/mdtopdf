import { useState, useCallback, useRef } from 'react';
import AdvancedExportService, { ExportOptions, ExportProgress } from '../services/AdvancedExportService';

interface UseAdvancedExportReturn {
  exportToMultipleFormats: (
    markdown: string,
    elementRef: HTMLElement | null,
    options: ExportOptions[]
  ) => Promise<void[]>;
  exportSingleFormat: (
    markdown: string,
    elementRef: HTMLElement | null,
    options: ExportOptions
  ) => Promise<void>;
  activeExports: ExportProgress[];
  cancelExport: (exportId: string) => boolean;
  isExporting: boolean;
  exportProgress: Record<string, ExportProgress>;
}

export const useAdvancedExport = (): UseAdvancedExportReturn => {
  const [activeExports, setActiveExports] = useState<ExportProgress[]>([]);
  const [exportProgress, setExportProgress] = useState<Record<string, ExportProgress>>({});
  const exportServiceRef = useRef<AdvancedExportService>(AdvancedExportService.getInstance());

  const updateProgress = useCallback((progress: ExportProgress) => {
    setExportProgress(prev => ({
      ...prev,
      [progress.id]: progress
    }));

    setActiveExports(prev => {
      const existing = prev.findIndex(e => e.id === progress.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = progress;
        return updated;
      }
      return [...prev, progress];
    });
  }, []);

  const exportSingleFormat = useCallback(async (
    markdown: string,
    elementRef: HTMLElement | null,
    options: ExportOptions
  ): Promise<void> => {
    try {
      await exportServiceRef.current.export(markdown, elementRef, options, updateProgress);
    } catch (error) {
      console.error(`Erreur lors de l'export ${options.format}:`, error);
      throw error;
    }
  }, [updateProgress]);

  const exportToMultipleFormats = useCallback(async (
    markdown: string,
    elementRef: HTMLElement | null,
    options: ExportOptions[]
  ): Promise<void[]> => {
    const exportPromises = options.map(option =>
      exportSingleFormat(markdown, elementRef, option)
        .catch(error => {
          console.error(`Export ${option.format} échoué:`, error);
          return Promise.reject(error);
        })
    );

    try {
      const results = await Promise.allSettled(exportPromises);
      return results.map((result, index) => {
        if (result.status === 'rejected') {
          throw result.reason;
        }
        return result.value;
      });
    } catch (error) {
      console.error('Erreur lors de l\'export multiple:', error);
      throw error;
    }
  }, [exportSingleFormat]);

  const cancelExport = useCallback((exportId: string): boolean => {
    return exportServiceRef.current.cancelExport(exportId);
  }, []);

  const isExporting = activeExports.some(exp => exp.status === 'processing');

  return {
    exportToMultipleFormats,
    exportSingleFormat,
    activeExports,
    cancelExport,
    isExporting,
    exportProgress
  };
};