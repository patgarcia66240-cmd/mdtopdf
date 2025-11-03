import { useState, useCallback } from 'react';

export interface Template {
  id: string;
  name: string;
  description: string;
  colors: string[];
  isPro: boolean;
  category: 'modern' | 'classic' | 'academic' | 'creative';
  cssStyles: {
    fontFamily: string;
    headingColor: string;
    textColor: string;
    accentColor: string;
    backgroundColor: string;
  };
}

export const useTemplates = () => {
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: 'modern-blue',
      name: 'Moderne Bleu',
      description: 'Design moderne avec accents bleus, parfait pour les documents professionnels',
      colors: ['#3b82f6', '#1e40af', '#60a5fa', '#dbeafe'],
      isPro: false,
      category: 'modern',
      cssStyles: {
        fontFamily: 'Inter, system-ui, sans-serif',
        headingColor: '#1e40af',
        textColor: '#1f2937',
        accentColor: '#3b82f6',
        backgroundColor: '#ffffff'
      }
    },
    {
      id: 'classic-serif',
      name: 'Classique Serif',
      description: 'Élégant et traditionnel, idéal pour les documents académiques',
      colors: ['#374151', '#6b7280', '#9ca3af', '#f3f4f6'],
      isPro: false,
      category: 'classic',
      cssStyles: {
        fontFamily: 'Georgia, serif',
        headingColor: '#111827',
        textColor: '#374151',
        accentColor: '#6b7280',
        backgroundColor: '#ffffff'
      }
    },
    {
      id: 'academic-formal',
      name: 'Académique Formel',
      description: 'Style universitaire avec typographie Times et mises en page strictes',
      colors: ['#1f2937', '#374151', '#4b5563', '#e5e7eb'],
      isPro: true,
      category: 'academic',
      cssStyles: {
        fontFamily: 'Times New Roman, serif',
        headingColor: '#111827',
        textColor: '#1f2937',
        accentColor: '#374151',
        backgroundColor: '#ffffff'
      }
    },
    {
      id: 'minimal-clean',
      name: 'Minimal Clean',
      description: 'Design épuré et minimaliste, focus sur le contenu',
      colors: ['#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1'],
      isPro: false,
      category: 'modern',
      cssStyles: {
        fontFamily: 'system-ui, sans-serif',
        headingColor: '#334155',
        textColor: '#475569',
        accentColor: '#64748b',
        backgroundColor: '#ffffff'
      }
    },
    {
      id: 'creative-vibrant',
      name: 'Creatif Vibrant',
      description: 'Couleurs vives et design dynamique pour les présentations',
      colors: ['#f59e0b', '#ef4444', '#10b981', '#8b5cf6'],
      isPro: true,
      category: 'creative',
      cssStyles: {
        fontFamily: 'Nunito, sans-serif',
        headingColor: '#f59e0b',
        textColor: '#374151',
        accentColor: '#ef4444',
        backgroundColor: '#fef3c7'
      }
    },
    {
      id: 'tech-dark',
      name: 'Tech Dark',
      description: 'Thème sombre moderne pour les documents techniques',
      colors: ['#1f2937', '#374151', '#6b7280', '#f9fafb'],
      isPro: true,
      category: 'modern',
      cssStyles: {
        fontFamily: 'JetBrains Mono, monospace',
        headingColor: '#f9fafb',
        textColor: '#d1d5db',
        accentColor: '#60a5fa',
        backgroundColor: '#1f2937'
      }
    }
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState<string>('modern-blue');

  const getTemplateById = useCallback((id: string): Template | undefined => {
    return templates.find(template => template.id === id);
  }, [templates]);

  const getTemplatesByCategory = useCallback((category: Template['category']): Template[] => {
    return templates.filter(template => template.category === category);
  }, [templates]);

  const addTemplate = useCallback((newTemplate: Omit<Template, 'id'>) => {
    const id = `template-${Date.now()}`;
    setTemplates(prev => [...prev, { ...newTemplate, id }]);
    return id;
  }, []);

  const updateTemplate = useCallback((id: string, updates: Partial<Template>) => {
    setTemplates(prev =>
      prev.map(template =>
        template.id === id ? { ...template, ...updates } : template
      )
    );
  }, []);

  const deleteTemplate = useCallback((id: string) => {
    setTemplates(prev => prev.filter(template => template.id !== id));
    if (selectedTemplate === id) {
      setSelectedTemplate(templates[0]?.id || '');
    }
  }, [selectedTemplate, templates]);

  const duplicateTemplate = useCallback((id: string) => {
    const template = getTemplateById(id);
    if (template) {
      const newTemplate = {
        ...template,
        name: `${template.name} (Copie)`,
        id: `template-${Date.now()}`
      };
      setTemplates(prev => [...prev, newTemplate]);
      return newTemplate.id;
    }
    return null;
  }, [getTemplateById]);

  const applyTemplateStyles = useCallback((template: Template): string => {
    const styles = `
      .document-content {
        font-family: ${template.cssStyles.fontFamily};
        color: ${template.cssStyles.textColor};
        background-color: ${template.cssStyles.backgroundColor};
        line-height: 1.6;
      }
      .document-content h1, .document-content h2, .document-content h3 {
        color: ${template.cssStyles.headingColor};
        font-weight: 700;
        margin-top: 1.5em;
        margin-bottom: 0.5em;
      }
      .document-content h1 { font-size: 2em; }
      .document-content h2 { font-size: 1.5em; }
      .document-content h3 { font-size: 1.2em; }
      .document-content strong, .document-content b {
        color: ${template.cssStyles.accentColor};
        font-weight: 600;
      }
      .document-content code {
        background-color: ${template.colors[1]}20;
        padding: 2px 6px;
        border-radius: 4px;
        font-family: monospace;
        color: ${template.cssStyles.textColor};
      }
      .document-content blockquote {
        border-left: 4px solid ${template.cssStyles.accentColor};
        padding-left: 16px;
        margin: 16px 0;
        font-style: italic;
        color: ${template.colors[1]};
      }
    `;
    return styles;
  }, []);

  const getDefaultTemplates = useCallback((): Template[] => {
    return templates.filter(template => !template.isPro);
  }, [templates]);

  const getProTemplates = useCallback((): Template[] => {
    return templates.filter(template => template.isPro);
  }, [templates]);

  return {
    templates,
    selectedTemplate,
    setSelectedTemplate,
    getTemplateById,
    getTemplatesByCategory,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    applyTemplateStyles,
    getDefaultTemplates,
    getProTemplates
  };
};