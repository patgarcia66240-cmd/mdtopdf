import React from 'react';
import { useQuery, useMutation, useQueryClient, QueryClient } from '@tanstack/react-query';
import { Template, TemplateCategory, TemplateVariable } from '../../types/template';
import TemplateService from '../../services/TemplateService';
import { useAdvancedCache, useOptimizedMutation, CACHE_CONFIG, RETRY_CONFIG } from './useAdvancedCache';

interface UseCachedTemplatesReturn {
  templates: Template[];
  categories: TemplateCategory[];
  variables: TemplateVariable[];
  selectedTemplate: Template | null;
  isLoading: boolean;
  error: string | null;
  isCreating: boolean;
  isDeleting: boolean;
  isUpdating: boolean;
  // Actions
  selectTemplate: (template: Template) => void;
  createTemplate: (template: Omit<Template, 'id'>) => void;
  updateTemplate: (template: Template) => void;
  deleteTemplate: (id: string) => void;
  duplicateTemplate: (id: string, newName?: string) => void;
  exportTemplate: (id: string) => Promise<string | null>;
  importTemplate: (templateJson: string) => Promise<Template | null>;
  searchTemplates: (query: string) => Template[];
  getTemplatesByCategory: (category: string) => Template[];
  applyVariables: (template: Template, variables: Record<string, any>) => Template;
  clearError: () => void;
  getStats: () => any;
  prefetchTemplates: () => void;
  invalidateTemplates: () => void;
}

export const useCachedTemplates = (): UseCachedTemplatesReturn => {
  const queryClient = useQueryClient();
  const templateService = TemplateService.getInstance();
  const { preloadDependencies } = useAdvancedCache();

  // Query principale pour les templates avec cache intelligent
  const {
    data: templates = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const templates = templateService.getAllTemplates();

      // Précharger les dépendances
      preloadDependencies(['templates']);

      return templates;
    },
    staleTime: CACHE_CONFIG.templates.staleTime,
    gcTime: CACHE_CONFIG.templates.gcTime,
    refetchOnWindowFocus: CACHE_CONFIG.templates.refetchOnWindowFocus,
    refetchOnReconnect: CACHE_CONFIG.templates.refetchOnReconnect,
    retry: RETRY_CONFIG.default.retry,
    retryDelay: RETRY_CONFIG.default.retryDelay,
  });

  // Query pour les catégories
  const { data: categories = [] } = useQuery({
    queryKey: ['template-categories'],
    queryFn: () => templateService.getCategories(),
    staleTime: CACHE_CONFIG.templates.staleTime,
    gcTime: CACHE_CONFIG.templates.gcTime,
    retry: RETRY_CONFIG.default.retry,
  });

  // Query pour les variables
  const { data: variables = [] } = useQuery({
    queryKey: ['template-variables'],
    queryFn: () => templateService.getTemplateVariables(),
    staleTime: CACHE_CONFIG.templates.staleTime,
    gcTime: CACHE_CONFIG.templates.gcTime,
    retry: RETRY_CONFIG.default.retry,
  });

  // État local pour le template sélectionné
  const [selectedTemplate, setSelectedTemplate] = React.useState<Template | null>(null);

  // Mutation optimisée pour la création
  const createTemplateMutation = useOptimizedMutation(
    async (templateData: Omit<Template, 'id'>) => {
      const newTemplate: Template = {
        ...templateData,
        id: `custom-${Date.now()}`,
        metadata: {
          ...templateData.metadata,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };

      // Sauvegarder dans le service
      templateService.saveTemplate(newTemplate);

      // Ajouter au localStorage
      const userTemplates = JSON.parse(localStorage.getItem('user-templates') || '[]');
      userTemplates.push(newTemplate);
      localStorage.setItem('user-templates', JSON.stringify(userTemplates));

      return newTemplate;
    },
    {
      queryKey: ['templates'],
      optimisticUpdate: (oldTemplates: Template[], variables) => {
        const tempTemplate: Template = {
          ...variables,
          id: `temp-${Date.now()}`,
          metadata: {
            ...variables.metadata,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        };
        return [...oldTemplates, tempTemplate];
      },
      onSuccess: (newTemplate) => {
        setSelectedTemplate(newTemplate);

        // Invalider les requêtes liées
        queryClient.invalidateQueries({ queryKey: ['template-categories'] });
        queryClient.invalidateQueries({ queryKey: ['template-stats'] });
      },
      retryConfig: 'critical',
    }
  );

  // Mutation optimisée pour la mise à jour
  const updateTemplateMutation = useOptimizedMutation(
    async (template: Template) => {
      templateService.saveTemplate(template);
      return template;
    },
    {
      queryKey: ['templates'],
      optimisticUpdate: (oldTemplates: Template[], variables) => {
        return oldTemplates.map(t => t.id === variables.id ? { ...variables, metadata: { ...variables.metadata, updatedAt: new Date().toISOString() } } : t);
      },
      onSuccess: (updatedTemplate) => {
        if (selectedTemplate?.id === updatedTemplate.id) {
          setSelectedTemplate(updatedTemplate);
        }
      },
      retryConfig: 'critical',
    }
  );

  // Mutation optimisée pour la suppression
  const deleteTemplateMutation = useOptimizedMutation(
    async (templateId: string) => {
      const success = templateService.deleteTemplate(templateId);

      if (success) {
        // Supprimer du localStorage
        const userTemplates = JSON.parse(localStorage.getItem('user-templates') || '[]');
        const filtered = userTemplates.filter((t: Template) => t.id !== templateId);
        localStorage.setItem('user-templates', JSON.stringify(filtered));
      }

      return templateId;
    },
    {
      queryKey: ['templates'],
      optimisticUpdate: (oldTemplates: Template[], variables) => {
        return oldTemplates.filter(t => t.id !== variables);
      },
      onSuccess: (deletedId) => {
        // Sélectionner un autre template si celui supprimé était sélectionné
        if (selectedTemplate?.id === deletedId) {
          const remainingTemplates = templates.filter(t => t.id !== deletedId);
          const newSelection = remainingTemplates.find(t => t.metadata.isDefault) || remainingTemplates[0] || null;
          setSelectedTemplate(newSelection);
        }

        // Invalider les requêtes liées
        queryClient.invalidateQueries({ queryKey: ['template-categories'] });
        queryClient.invalidateQueries({ queryKey: ['template-stats'] });
      },
      retryConfig: 'critical',
    }
  );

  // Mutation pour la duplication
  const duplicateTemplateMutation = useOptimizedMutation(
    async ({ id, newName }: { id: string; newName?: string }) => {
      const duplicated = templateService.duplicateTemplate(id, newName);

      if (duplicated) {
        // Ajouter au localStorage
        const userTemplates = JSON.parse(localStorage.getItem('user-templates') || '[]');
        userTemplates.push(duplicated);
        localStorage.setItem('user-templates', JSON.stringify(userTemplates));
      }

      return duplicated;
    },
    {
      queryKey: ['templates'],
      optimisticUpdate: (oldTemplates: Template[], variables) => {
        const original = oldTemplates.find(t => t.id === variables.id);
        if (!original) return oldTemplates;

        const duplicated: Template = {
          ...original,
          id: `temp-duplicate-${Date.now()}`,
          metadata: {
            ...original.metadata,
            id: `temp-duplicate-${Date.now()}`,
            name: variables.newName || `${original.metadata.name} (copie)`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        };

        return [...oldTemplates, duplicated];
      },
      onSuccess: (duplicated) => {
        if (duplicated) {
          setSelectedTemplate(duplicated);
        }
      },
      retryConfig: 'default',
    }
  );

  // Actions
  const selectTemplate = React.useCallback((template: Template) => {
    setSelectedTemplate(template);

    // Précharger les templates similaires
    const similar = templates.filter(t =>
      t.metadata.category === template.metadata.category &&
      t.id !== template.id
    ).slice(0, 3);

    similar.forEach(similarTemplate => {
      queryClient.prefetchQuery({
        queryKey: ['template-detail', similarTemplate.id],
        queryFn: () => Promise.resolve(similarTemplate),
        staleTime: CACHE_CONFIG.templates.staleTime,
      });
    });
  }, [templates, queryClient]);

  const createTemplate = React.useCallback((template: Omit<Template, 'id'>) => {
    createTemplateMutation.mutate(template);
  }, [createTemplateMutation]);

  const updateTemplate = React.useCallback((template: Template) => {
    updateTemplateMutation.mutate(template);
  }, [updateTemplateMutation]);

  const deleteTemplate = React.useCallback((id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce template ?')) {
      deleteTemplateMutation.mutate(id);
    }
  }, [deleteTemplateMutation]);

  const duplicateTemplate = React.useCallback((id: string, newName?: string) => {
    duplicateTemplateMutation.mutate({ id, newName });
  }, [duplicateTemplateMutation]);

  const exportTemplate = React.useCallback(async (id: string): Promise<string | null> => {
    try {
      return templateService.exportTemplate(id);
    } catch (err) {
      console.error('Export failed:', err);
      return null;
    }
  }, []);

  const importTemplate = React.useCallback(async (templateJson: string): Promise<Template | null> => {
    try {
      const imported = templateService.importTemplate(templateJson);

      if (imported) {
        // Invalider le cache pour forcer le rechargement
        queryClient.invalidateQueries({ queryKey: ['templates'] });
        setSelectedTemplate(imported);
      }

      return imported;
    } catch (err) {
      console.error('Import failed:', err);
      return null;
    }
  }, [queryClient]);

  const searchTemplates = React.useCallback((query: string): Template[] => {
    if (!query.trim()) return templates;

    const searchQuery = query.toLowerCase();
    return templates.filter(template =>
      template.metadata.name.toLowerCase().includes(searchQuery) ||
      template.metadata.description.toLowerCase().includes(searchQuery) ||
      template.metadata.category.toLowerCase().includes(searchQuery)
    );
  }, [templates]);

  const getTemplatesByCategory = React.useCallback((category: string): Template[] => {
    return templates.filter(t => t.metadata.category === category);
  }, [templates]);

  const applyVariables = React.useCallback((template: Template, variables: Record<string, any>): Template => {
    return templateService.applyTemplateVariables(template, variables);
  }, []);

  const clearError = React.useCallback(() => {
    // L'erreur sera automatiquement nettoyée par React Query
  }, []);

  const getStats = React.useCallback(() => {
    return templateService.getStats();
  }, []);

  // Précharger les templates
  const prefetchTemplates = React.useCallback(() => {
    queryClient.prefetchQuery({
      queryKey: ['templates'],
      queryFn: async () => templateService.getAllTemplates(),
      staleTime: CACHE_CONFIG.templates.staleTime,
    });
  }, [queryClient, templateService]);

  // Invalider les templates
  const invalidateTemplates = React.useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['templates'] });
    queryClient.invalidateQueries({ queryKey: ['template-categories'] });
    queryClient.invalidateQueries({ queryKey: ['template-variables'] });
  }, [queryClient]);

  // Initialiser le template sélectionné
  React.useEffect(() => {
    if (templates.length > 0 && !selectedTemplate) {
      const defaultTemplate = templates.find(t => t.metadata.isDefault) || templates[0];
      setSelectedTemplate(defaultTemplate);
    }
  }, [templates, selectedTemplate]);

  return {
    templates,
    categories,
    variables,
    selectedTemplate,
    isLoading,
    error: error?.message || null,
    isCreating: createTemplateMutation.isPending,
    isDeleting: deleteTemplateMutation.isPending,
    isUpdating: updateTemplateMutation.isPending,
    selectTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    exportTemplate,
    importTemplate,
    searchTemplates,
    getTemplatesByCategory,
    applyVariables,
    clearError,
    getStats,
    prefetchTemplates,
    invalidateTemplates,
  };
};