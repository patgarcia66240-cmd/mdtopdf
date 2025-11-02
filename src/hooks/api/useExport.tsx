import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { exportService, ExportFormat, ExportOptions } from '@/services/exportService';
import { useAppStore } from '@/stores/appStore';
import { useTemplates } from './usePDFQuery';

export const useExport = () => {
  const queryClient = useQueryClient();
  const { markdown, pdfOptions, selectedTemplate } = useAppStore();
  const { data: templates } = useTemplates();

  const exportMutation = useMutation({
    mutationFn: async (format: ExportFormat) => {
      const exportOptions: ExportOptions = {
        format,
        filename: 'document',
        markdown: markdown,
        pdfOptions: format === 'pdf' || format === 'png' ? pdfOptions : undefined,
        template: selectedTemplate ? templates?.find(t => t.id === selectedTemplate) : undefined,
      };

      // Validation des options
      const errors = exportService.validateExportOptions(exportOptions);
      if (errors.length > 0) {
        throw new Error(errors.join('\n'));
      }

      return exportService.exportDocument(exportOptions);
    },
    onSuccess: () => {
      // Invalider les queries pertinentes si nécessaire
      queryClient.invalidateQueries({ queryKey: ['recent-files'] });
    },
    onError: (error) => {
      console.error('Export failed:', error);
    },
  });

  const exportToFormat = (format: ExportFormat) => {
    if (!markdown.trim()) {
      throw new Error('Aucun contenu à exporter');
    }

    return exportMutation.mutateAsync(format);
  };

  return {
    exportToFormat,
    isExporting: exportMutation.isPending,
    exportError: exportMutation.error,
    supportedFormats: exportService.getSupportedFormats(),
  };
};

export const useSupportedFormats = () => {
  return {
    formats: exportService.getSupportedFormats(),
  };
};