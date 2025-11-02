import React from 'react';
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { pdfService } from '@/services/pdfService';
import { PDFOptions, Template, RecentFile } from '@/types/app';

export const useOptimizedPDFGeneration = () => {
  const queryClient = useQueryClient();

  const generatePDFMutation = useMutation({
    mutationFn: ({ markdown, options }: { markdown: string; options: PDFOptions }) =>
      pdfService.generatePDF(markdown, options),
    onSuccess: (blob, variables) => {
      // Trigger download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.pdf';
      a.click();
      URL.revokeObjectURL(url);

      // Optimistic update - ajouter aux fichiers récents immédiatement
      const newFile: RecentFile = {
        id: Date.now().toString(),
        name: 'document.pdf',
        content: variables.markdown.substring(0, 100) + '...',
        lastModified: new Date(),
        size: blob.size,
      };

      queryClient.setQueryData(['recent-files'], (oldFiles: RecentFile[] | undefined) => {
        const filtered = oldFiles?.filter(f => f.id !== newFile.id) || [];
        return [newFile, ...filtered].slice(0, 10);
      });

      // Invalider et rafraîchir en arrière-plan
      queryClient.invalidateQueries({
        queryKey: ['recent-files'],
        refetchType: 'active'
      });
    },
    onError: (error) => {
      console.error('PDF generation failed:', error);
      // Optionnel: afficher une notification toast
    },
  });

  const previewPDFMutation = useMutation({
    mutationFn: ({ markdown, options }: { markdown: string; options: PDFOptions }) =>
      pdfService.generatePDFPreview(markdown, options),
    onSuccess: (previewUrl) => {
      // Précharger le preview dans le cache
      queryClient.setQueryData(['pdf-preview', previewUrl], previewUrl);
    },
  });

  return {
    generatePDF: generatePDFMutation.mutate,
    generatePDFAsync: generatePDFMutation.mutateAsync,
    isGenerating: generatePDFMutation.isPending,
    generateError: generatePDFMutation.error,
    generatePreview: previewPDFMutation.mutate,
    generatePreviewAsync: previewPDFMutation.mutateAsync,
    isPreviewGenerating: previewPDFMutation.isPending,
    previewError: previewPDFMutation.error,
  };
};

export const useOptimizedTemplates = () => {
  return useQuery({
    queryKey: ['templates'],
    queryFn: () => pdfService.getTemplates(),
    staleTime: 1000 * 60 * 10, // 10 minutes au lieu de 5
    gcTime: 1000 * 60 * 30, // 30 minutes avant garbage collection
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};

export const useOptimizedRecentFiles = () => {
  return useQuery({
    queryKey: ['recent-files'],
    queryFn: () => pdfService.getRecentFiles(),
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Pour les gros fichiers, utilisation de Infinite Query
export const useInfiniteRecentFiles = () => {
  return useInfiniteQuery({
    queryKey: ['recent-files-infinite'],
    queryFn: ({ pageParam = 0 }) => {
      // Implémentation pour la pagination si nécessaire
      return pdfService.getRecentFiles().then(files => ({
        data: files.slice(pageParam * 10, (pageParam + 1) * 10),
        nextCursor: files.length > (pageParam + 1) * 10 ? pageParam + 1 : undefined,
        hasMore: files.length > (pageParam + 1) * 10,
      }));
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 1000 * 60 * 2,
  });
};

// Hook pour la mise en cache des previews
export const useCachedPreview = (markdown: string, options: PDFOptions) => {
  const queryKey = ['pdf-preview', markdown, options];

  return useQuery({
    queryKey,
    queryFn: () => pdfService.generatePDFPreview(markdown, options),
    enabled: !!markdown.trim(),
    staleTime: 1000 * 60 * 5, // 5 minutes pour les previews
    gcTime: 1000 * 60 * 10,
  });
};

// Hook pour précharger les templates
export const usePrefetchTemplates = () => {
  const queryClient = useQueryClient();

  React.useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ['templates'],
      queryFn: () => pdfService.getTemplates(),
      staleTime: 1000 * 60 * 10,
    });
  }, [queryClient]);
};

// Hook pour la gestion optimistic des templates personnalisés
export const useOptimizedTemplateManagement = () => {
  const queryClient = useQueryClient();

  const createTemplateMutation = useMutation({
    mutationFn: async (template: Omit<Template, 'id'>) => {
      const newTemplate: Template = {
        ...template,
        id: `custom-${Date.now()}`,
      };

      // Ajouter au localStorage
      const userTemplates = JSON.parse(localStorage.getItem('user-templates') || '[]');
      userTemplates.push(newTemplate);
      localStorage.setItem('user-templates', JSON.stringify(userTemplates));

      return newTemplate;
    },
    onMutate: async (newTemplate) => {
      // Annuler les requêtes en cours
      await queryClient.cancelQueries({ queryKey: ['templates'] });

      // Snapshot des données précédentes
      const previousTemplates = queryClient.getQueryData(['templates']);

      // Optimistic update
      const tempTemplate: Template = {
        ...newTemplate,
        id: `temp-${Date.now()}`,
      };

      queryClient.setQueryData(['templates'], (old: Template[] | undefined) => [
        ...(old || []),
        tempTemplate,
      ]);

      return { previousTemplates };
    },
    onError: (err, newTemplate, context) => {
      // Rollback en cas d'erreur
      queryClient.setQueryData(['templates'], context?.previousTemplates);
    },
    onSettled: () => {
      // Rafraîchir les données
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: async (templateId: string) => {
      // Supprimer du localStorage
      const userTemplates = JSON.parse(localStorage.getItem('user-templates') || '[]');
      const filtered = userTemplates.filter((t: Template) => t.id !== templateId);
      localStorage.setItem('user-templates', JSON.stringify(filtered));

      return templateId;
    },
    onMutate: async (templateId) => {
      await queryClient.cancelQueries({ queryKey: ['templates'] });
      const previousTemplates = queryClient.getQueryData(['templates']);

      // Optimistic delete
      queryClient.setQueryData(['templates'], (old: Template[] | undefined) =>
        (old || []).filter(t => t.id !== templateId)
      );

      return { previousTemplates };
    },
    onError: (err, templateId, context) => {
      queryClient.setQueryData(['templates'], context?.previousTemplates);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });

  return {
    createTemplate: createTemplateMutation.mutate,
    deleteTemplate: deleteTemplateMutation.mutate,
    isCreating: createTemplateMutation.isPending,
    isDeleting: deleteTemplateMutation.isPending,
  };
};

// Hook pour le background refetch intelligent
export const useSmartRefetch = () => {
  const queryClient = useQueryClient();

  // Refetch intelligent basé sur l'activité utilisateur
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // L'utilisateur est revenu sur la page
        queryClient.invalidateQueries({
          queryKey: ['recent-files'],
          refetchType: 'active'
        });
      }
    };

    const handleOnline = () => {
      // Retour en ligne
      queryClient.invalidateQueries({
        queryKey: ['templates'],
        refetchType: 'active'
      });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
    };
  }, [queryClient]);

  // Refetch périodique pour les données critiques
  React.useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({
        queryKey: ['recent-files'],
        refetchType: 'active'
      });
    }, 1000 * 60 * 5); // Toutes les 5 minutes

    return () => clearInterval(interval);
  }, [queryClient]);
};