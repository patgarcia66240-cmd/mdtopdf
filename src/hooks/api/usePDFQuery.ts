import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pdfService } from '@/services/pdfService';
import { PDFOptions } from '@/types/app';

export const usePDFGeneration = () => {
  const queryClient = useQueryClient();

  const generatePDFMutation = useMutation({
    mutationFn: ({ markdown, options }: { markdown: string; options: PDFOptions }) =>
      pdfService.generatePDF(markdown, options),
    onSuccess: (blob) => {
      // Déclencher le téléchargement
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.pdf';
      a.click();
      URL.revokeObjectURL(url);

      // Invalider les queries pertinentes
      queryClient.invalidateQueries({ queryKey: ['recent-files'] });
    },
    onError: (error) => {
      console.error('PDF generation failed:', error);
    },
  });

  const previewPDFMutation = useMutation({
    mutationFn: ({ markdown, options }: { markdown: string; options: PDFOptions }) =>
      pdfService.generatePDFPreview(markdown, options),
  });

  return {
    generatePDF: generatePDFMutation.mutate,
    isGenerating: generatePDFMutation.isPending,
    generateError: generatePDFMutation.error,
    generatePreview: previewPDFMutation.mutate,
    isPreviewGenerating: previewPDFMutation.isPending,
    previewError: previewPDFMutation.error,
  };
};

export const useTemplates = () => {
  return useQuery({
    queryKey: ['templates'],
    queryFn: () => pdfService.getTemplates(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useRecentFiles = () => {
  return useQuery({
    queryKey: ['recent-files'],
    queryFn: () => pdfService.getRecentFiles(),
    staleTime: 1000 * 60, // 1 minute
  });
};