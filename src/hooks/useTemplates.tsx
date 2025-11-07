import { useState, useEffect, useCallback } from 'react';
import { Template, TemplateCategory, TemplateVariable } from '../types/template';
import TemplateService from '../services/TemplateService';

interface UseTemplatesReturn {
  templates: Template[];
  categories: TemplateCategory[];
  variables: TemplateVariable[];
  selectedTemplate: Template | null;
  isLoading: boolean;
  error: string | null;
  // Actions
  selectTemplate: (template: Template) => void;
  saveTemplate: (template: Template) => Promise<void>;
  deleteTemplate: (id: string) => Promise<boolean>;
  duplicateTemplate: (id: string, newName?: string) => Promise<Template | null>;
  exportTemplate: (id: string) => Promise<string | null>;
  importTemplate: (templateJson: string) => Promise<Template | null>;
  searchTemplates: (query: string) => Template[];
  getTemplatesByCategory: (category: string) => Template[];
  applyVariables: (template: Template, variables: Record<string, any>) => Template;
  clearError: () => void;
  getStats: () => any;
}

export const useTemplates = (): UseTemplatesReturn => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<TemplateCategory[]>([]);
  const [variables, setVariables] = useState<TemplateVariable[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const templateService = TemplateService.getInstance();

  // Charger les templates au montage
  useEffect(() => {
    const loadTemplates = () => {
      try {
        setIsLoading(true);
        setError(null);

        const loadedTemplates = templateService.getAllTemplates();
        const loadedCategories = templateService.getCategories();
        const loadedVariables = templateService.getTemplateVariables();

        setTemplates(loadedTemplates);
        setCategories(loadedCategories);
        setVariables(loadedVariables);

        // Sélectionner le premier template par défaut
        const defaultTemplate = loadedTemplates.find(t => t.metadata.isDefault);
        if (defaultTemplate) {
          setSelectedTemplate(defaultTemplate);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des templates';
        setError(errorMessage);
        console.error('Erreur useTemplates:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, []);

  const selectTemplate = useCallback((template: Template) => {
    setSelectedTemplate(template);
  }, []);

  const saveTemplate = useCallback(async (template: Template): Promise<void> => {
    try {
      setError(null);
      templateService.saveTemplate(template);

      // Mettre à jour la liste des templates
      const updatedTemplates = templateService.getAllTemplates();
      setTemplates(updatedTemplates);

      // Si c'est un template personnalisé, le sélectionner
      if (template.metadata.category === 'custom') {
        setSelectedTemplate(template);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const deleteTemplate = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const success = templateService.deleteTemplate(id);

      if (success) {
        // Mettre à jour la liste des templates
        const updatedTemplates = templateService.getAllTemplates();
        setTemplates(updatedTemplates);

        // Si on supprime le template sélectionné, en sélectionner un autre
        if (selectedTemplate?.metadata.id === id) {
          const newSelection = updatedTemplates.find(t => t.metadata.isDefault) || updatedTemplates[0];
          setSelectedTemplate(newSelection || null);
        }
      }

      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      setError(errorMessage);
      return false;
    }
  }, [selectedTemplate]);

  const duplicateTemplate = useCallback(async (id: string, newName?: string): Promise<Template | null> => {
    try {
      setError(null);
      const duplicated = templateService.duplicateTemplate(id, newName);

      if (duplicated) {
        // Mettre à jour la liste des templates
        const updatedTemplates = templateService.getAllTemplates();
        setTemplates(updatedTemplates);
        setSelectedTemplate(duplicated);
      }

      return duplicated;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la duplication';
      setError(errorMessage);
      return null;
    }
  }, []);

  const exportTemplate = useCallback(async (id: string): Promise<string | null> => {
    try {
      setError(null);
      return templateService.exportTemplate(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'export';
      setError(errorMessage);
      return null;
    }
  }, []);

  const importTemplate = useCallback(async (templateJson: string): Promise<Template | null> => {
    try {
      setError(null);
      const imported = templateService.importTemplate(templateJson);

      if (imported) {
        // Mettre à jour la liste des templates
        const updatedTemplates = templateService.getAllTemplates();
        setTemplates(updatedTemplates);
        setSelectedTemplate(imported);
      }

      return imported;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'import';
      setError(errorMessage);
      return null;
    }
  }, []);

  const searchTemplates = useCallback((query: string): Template[] => {
    if (!query.trim()) return templates;
    return templateService.searchTemplates(query);
  }, [templates]);

  const getTemplatesByCategory = useCallback((category: string): Template[] => {
    return templateService.getTemplatesByCategory(category as Template['metadata']['category']);
  }, []);

  const applyVariables = useCallback((template: Template, variables: Record<string, any>): Template => {
    return templateService.applyTemplateVariables(template, variables);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getStats = useCallback(() => {
    return templateService.getStats();
  }, []);

  return {
    templates,
    categories,
    variables,
    selectedTemplate,
    isLoading,
    error,
    selectTemplate,
    saveTemplate,
    deleteTemplate,
    duplicateTemplate,
    exportTemplate,
    importTemplate,
    searchTemplates,
    getTemplatesByCategory,
    applyVariables,
    clearError,
    getStats
  };
};