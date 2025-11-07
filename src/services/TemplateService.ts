import { Template, TemplateMetadata, TemplateCategory, TemplateVariable, TemplateLibrary } from '../types/template';

class TemplateService {
  private static instance: TemplateService;
  private readonly STORAGE_KEY = 'mdtopdf_templates';
  private readonly LIBRARY_KEY = 'mdtopdf_template_library';
  private readonly CUSTOM_TEMPLATES_KEY = 'mdtopdf_custom_templates';

  static getInstance(): TemplateService {
    if (!TemplateService.instance) {
      TemplateService.instance = new TemplateService();
    }
    return TemplateService.instance;
  }

  /**
   * Obtenir tous les templates (par défaut + personnalisés)
   */
  getAllTemplates(): Template[] {
    try {
      const defaultTemplates = this.getDefaultTemplates();
      const customTemplates = this.getCustomTemplates();
      return [...defaultTemplates, ...customTemplates];
    } catch (error) {
      console.error('Erreur lors de la récupération des templates:', error);
      return this.getDefaultTemplates();
    }
  }

  /**
   * Obtenir un template par son ID
   */
  getTemplateById(id: string): Template | null {
    const templates = this.getAllTemplates();
    return templates.find(template => template.metadata.id === id) || null;
  }

  /**
   * Sauvegarder un template personnalisé
   */
  saveTemplate(template: Template): void {
    try {
      const customTemplates = this.getCustomTemplates();
      const existingIndex = customTemplates.findIndex(t => t.metadata.id === template.metadata.id);

      const updatedTemplate: Template = {
        ...template,
        metadata: {
          ...template.metadata,
          updatedAt: Date.now(),
          category: 'custom'
        }
      };

      if (existingIndex >= 0) {
        customTemplates[existingIndex] = updatedTemplate;
      } else {
        customTemplates.push(updatedTemplate);
      }

      localStorage.setItem(this.CUSTOM_TEMPLATES_KEY, JSON.stringify(customTemplates));
      console.log('Template sauvegardé:', template.metadata.name);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du template:', error);
      throw new Error('Impossible de sauvegarder le template');
    }
  }

  /**
   * Supprimer un template personnalisé
   */
  deleteTemplate(id: string): boolean {
    try {
      const customTemplates = this.getCustomTemplates();
      const filteredTemplates = customTemplates.filter(t => t.metadata.id !== id);

      if (filteredTemplates.length < customTemplates.length) {
        localStorage.setItem(this.CUSTOM_TEMPLATES_KEY, JSON.stringify(filteredTemplates));
        console.log('Template supprimé:', id);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de la suppression du template:', error);
      return false;
    }
  }

  /**
   * Dupliquer un template
   */
  duplicateTemplate(id: string, newName?: string): Template | null {
    try {
      const originalTemplate = this.getTemplateById(id);
      if (!originalTemplate) return null;

      const duplicatedTemplate: Template = {
        ...JSON.parse(JSON.stringify(originalTemplate)), // Deep copy
        metadata: {
          ...originalTemplate.metadata,
          id: this.generateTemplateId(),
          name: newName || `${originalTemplate.metadata.name} (copie)`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          category: 'custom',
          isDefault: false
        }
      };

      this.saveTemplate(duplicatedTemplate);
      return duplicatedTemplate;
    } catch (error) {
      console.error('Erreur lors de la duplication du template:', error);
      return null;
    }
  }

  /**
   * Obtenir les templates personnalisés
   */
  getCustomTemplates(): Template[] {
    try {
      const stored = localStorage.getItem(this.CUSTOM_TEMPLATES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erreur lors de la lecture des templates personnalisés:', error);
      return [];
    }
  }

  /**
   * Obtenir les templates par catégorie
   */
  getTemplatesByCategory(category: TemplateMetadata['category']): Template[] {
    const templates = this.getAllTemplates();
    return templates.filter(template => template.metadata.category === category);
  }

  /**
   * Rechercher des templates
   */
  searchTemplates(query: string): Template[] {
    const templates = this.getAllTemplates();
    const lowerQuery = query.toLowerCase();

    return templates.filter(template =>
      template.metadata.name.toLowerCase().includes(lowerQuery) ||
      template.metadata.description.toLowerCase().includes(lowerQuery) ||
      template.metadata.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Exporter un template
   */
  exportTemplate(id: string): string | null {
    try {
      const template = this.getTemplateById(id);
      if (!template) return null;

      return JSON.stringify(template, null, 2);
    } catch (error) {
      console.error('Erreur lors de l\'export du template:', error);
      return null;
    }
  }

  /**
   * Importer un template
   */
  importTemplate(templateJson: string): Template | null {
    try {
      const template: Template = JSON.parse(templateJson);

      // Valider le template
      if (!this.validateTemplate(template)) {
        throw new Error('Template invalide');
      }

      // Générer un nouvel ID pour éviter les conflits
      const importedTemplate: Template = {
        ...template,
        metadata: {
          ...template.metadata,
          id: this.generateTemplateId(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
          category: 'custom',
          isDefault: false
        }
      };

      this.saveTemplate(importedTemplate);
      return importedTemplate;
    } catch (error) {
      console.error('Erreur lors de l\'import du template:', error);
      return null;
    }
  }

  /**
   * Obtenir les catégories de templates
   */
  getCategories(): TemplateCategory[] {
    return [
      {
        id: 'professional',
        name: 'Professionnel',
        description: 'Templates pour documents d\'entreprise',
        icon: '💼',
        color: '#3b82f6',
        templates: this.getTemplatesByCategory('professional').map(t => t.metadata.id)
      },
      {
        id: 'academic',
        name: 'Académique',
        description: 'Templates pour travaux universitaires',
        icon: '🎓',
        color: '#10b981',
        templates: this.getTemplatesByCategory('academic').map(t => t.metadata.id)
      },
      {
        id: 'creative',
        name: 'Créatif',
        description: 'Templates originaux et artistiques',
        icon: '🎨',
        color: '#f59e0b',
        templates: this.getTemplatesByCategory('creative').map(t => t.metadata.id)
      },
      {
        id: 'business',
        name: 'Business',
        description: 'Templates pour rapports et présentations',
        icon: '📊',
        color: '#8b5cf6',
        templates: this.getTemplatesByCategory('business').map(t => t.metadata.id)
      },
      {
        id: 'technical',
        name: 'Technique',
        description: 'Templates pour documentation technique',
        icon: '⚙️',
        color: '#ef4444',
        templates: this.getTemplatesByCategory('technical').map(t => t.metadata.id)
      },
      {
        id: 'custom',
        name: 'Personnalisé',
        description: 'Vos templates créés',
        icon: '🛠️',
        color: '#6b7280',
        templates: this.getTemplatesByCategory('custom').map(t => t.metadata.id)
      }
    ];
  }

  /**
   * Obtenir les variables de templates
   */
  getTemplateVariables(): TemplateVariable[] {
    return [
      {
        id: 'company_name',
        name: 'Nom de l\'entreprise',
        type: 'text',
        defaultValue: 'Ma Société',
        description: 'Nom de votre entreprise',
        category: 'Informations'
      },
      {
        id: 'document_title',
        name: 'Titre du document',
        type: 'text',
        defaultValue: 'Document',
        description: 'Titre principal du document',
        category: 'Contenu'
      },
      {
        id: 'author_name',
        name: 'Nom de l\'auteur',
        type: 'text',
        defaultValue: 'Auteur',
        description: 'Votre nom',
        category: 'Informations'
      },
      {
        id: 'primary_color',
        name: 'Couleur principale',
        type: 'color',
        defaultValue: '#3b82f6',
        description: 'Couleur principale du thème',
        category: 'Apparence'
      },
      {
        id: 'font_size',
        name: 'Taille de police',
        type: 'number',
        defaultValue: 12,
        description: 'Taille de police de base en points',
        category: 'Apparence'
      },
      {
        id: 'show_page_numbers',
        name: 'Afficher les numéros de page',
        type: 'boolean',
        defaultValue: true,
        description: 'Inclure les numéros de page',
        category: 'Mise en page'
      },
      {
        id: 'paper_size',
        name: 'Format du papier',
        type: 'select',
        defaultValue: 'a4',
        options: ['a4', 'a3', 'letter', 'legal'],
        description: 'Format du papier',
        category: 'Mise en page'
      }
    ];
  }

  /**
   * Appliquer les variables à un template
   */
  applyTemplateVariables(template: Template, variables: Record<string, any>): Template {
    const applyVariablesToString = (str: string): string => {
      let result = str;
      Object.entries(variables).forEach(([key, value]) => {
        const placeholder = `{{${key}}}`;
        result = result.replace(new RegExp(placeholder, 'g'), String(value));
      });
      return result;
    };

    return {
      ...template,
      header: {
        ...template.header,
        content: template.header.content ? applyVariablesToString(template.header.content) : template.header.content
      },
      footer: {
        ...template.footer,
        content: template.footer.content ? applyVariablesToString(template.footer.content) : template.footer.content
      },
      customCSS: template.customCSS ? applyVariablesToString(template.customCSS) : template.customCSS
    };
  }

  /**
   * Obtenir les templates par défaut
   */
  private getDefaultTemplates(): Template[] {
    return [
      this.createModernTemplate(),
      this.createAcademicTemplate(),
      this.createMinimalTemplate(),
      this.createCorporateTemplate(),
      this.createTechnicalTemplate()
    ];
  }

  /**
   * Créer le template Modern
   */
  private createModernTemplate(): Template {
    return {
      metadata: {
        id: 'modern',
        name: 'Moderne',
        description: 'Design moderne et épuré avec couleurs vives',
        category: 'professional',
        author: 'MDtoPDF',
        version: '1.0.0',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        tags: ['moderne', 'professionnel', 'couleur'],
        isDefault: true,
        isPremium: false,
        preview: '🎨'
      },
      page: {
        size: 'a4',
        orientation: 'portrait',
        backgroundColor: '#ffffff'
      },
      header: {
        enabled: true,
        content: '{{document_title}}',
        height: 60,
        style: {
          fontFamily: 'Inter, sans-serif',
          fontSize: 24,
          color: '#1e293b',
          backgroundColor: '#f8fafc',
          borders: {
            width: 0,
            color: '#e2e8f0',
            style: 'solid'
          }
        },
        alignment: 'center',
        pageNumber: false
      },
      footer: {
        enabled: true,
        content: 'Page {{page_number}} - {{author_name}}',
        height: 40,
        style: {
          fontFamily: 'Inter, sans-serif',
          fontSize: 10,
          color: '#64748b',
          backgroundColor: '#f8fafc',
          borders: {
            width: 1,
            color: '#e2e8f0',
            style: 'solid'
          }
        },
        alignment: 'center',
        pageNumber: true
      },
      typography: {
        h1: {
          fontFamily: 'Inter, sans-serif',
          fontSize: 32,
          color: '#1e293b',
          margins: { top: 24, right: 0, bottom: 16, left: 0 }
        },
        h2: {
          fontFamily: 'Inter, sans-serif',
          fontSize: 24,
          color: '#334155',
          margins: { top: 20, right: 0, bottom: 12, left: 0 }
        },
        h3: {
          fontFamily: 'Inter, sans-serif',
          fontSize: 20,
          color: '#475569',
          margins: { top: 16, right: 0, bottom: 8, left: 0 }
        },
        p: {
          fontFamily: 'Inter, sans-serif',
          fontSize: 14,
          lineHeight: 1.6,
          color: '#475569',
          margins: { top: 0, right: 0, bottom: 12, left: 0 }
        },
        blockquote: {
          fontFamily: 'Inter, sans-serif',
          fontSize: 14,
          fontStyle: 'italic',
          color: '#64748b',
          backgroundColor: '#f1f5f9',
          borders: {
            width: 4,
            color: '#3b82f6',
            style: 'solid'
          },
          padding: { top: 16, right: 20, bottom: 16, left: 20 },
          margins: { top: 16, right: 0, bottom: 16, left: 0 }
        },
        code: {
          fontFamily: 'Fira Code, monospace',
          fontSize: 13,
          backgroundColor: '#f1f5f9',
          color: '#e11d48',
          padding: { top: 2, right: 6, bottom: 2, left: 6 },
          borders: {
            width: 1,
            color: '#e2e8f0',
            style: 'solid'
          },
          borderRadius: 4
        },
        pre: {
          fontFamily: 'Fira Code, monospace',
          fontSize: 13,
          backgroundColor: '#1e293b',
          color: '#e2e8f0',
          padding: { top: 16, right: 20, bottom: 16, left: 20 },
          borders: {
            width: 1,
            color: '#334155',
            style: 'solid'
          },
          borderRadius: 8,
          margins: { top: 16, right: 0, bottom: 16, left: 0 }
        },
        table: {
          header: {
            fontFamily: 'Inter, sans-serif',
            fontSize: 14,
            fontWeight: '600',
            color: '#f8fafc',
            backgroundColor: '#334155'
          },
          cell: {
            fontFamily: 'Inter, sans-serif',
            fontSize: 14,
            color: '#475569',
            backgroundColor: '#ffffff'
          },
          border: {
            width: 1,
            color: '#e2e8f0',
            style: 'solid'
          }
        },
        link: {
          fontFamily: 'Inter, sans-serif',
          fontSize: 14,
          color: '#3b82f6',
          textDecoration: 'underline'
        }
      },
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        accent: '#f59e0b',
        text: '#1e293b',
        background: '#ffffff',
        muted: '#f1f5f9',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444'
      }
    };
  }

  /**
   * Créer le template Académique
   */
  private createAcademicTemplate(): Template {
    return {
      metadata: {
        id: 'academic',
        name: 'Universitaire',
        description: 'Template académique formel pour travaux universitaires',
        category: 'academic',
        author: 'MDtoPDF',
        version: '1.0.0',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        tags: ['universitaire', 'recherche', 'formel'],
        isDefault: true,
        isPremium: false,
        preview: '🎓'
      },
      page: {
        size: 'a4',
        orientation: 'portrait',
        backgroundColor: '#ffffff'
      },
      header: {
        enabled: true,
        content: '{{document_title}}\n{{author_name}}',
        height: 80,
        style: {
          fontFamily: 'Times New Roman, serif',
          fontSize: 18,
          color: '#000000',
          backgroundColor: '#ffffff',
          borders: {
            width: 0,
            color: '#000000',
            style: 'none'
          }
        },
        alignment: 'center',
        pageNumber: false
      },
      footer: {
        enabled: true,
        content: '{{page_number}}',
        height: 30,
        style: {
          fontFamily: 'Times New Roman, serif',
          fontSize: 10,
          color: '#666666',
          backgroundColor: '#ffffff',
          borders: {
            width: 0,
            color: '#000000',
            style: 'none'
          }
        },
        alignment: 'center',
        pageNumber: true
      },
      typography: {
        h1: {
          fontFamily: 'Times New Roman, serif',
          fontSize: 28,
          color: '#000000',
          fontWeight: 'bold',
          margins: { top: 30, right: 0, bottom: 20, left: 0 }
        },
        h2: {
          fontFamily: 'Times New Roman, serif',
          fontSize: 22,
          color: '#000000',
          fontWeight: 'bold',
          margins: { top: 24, right: 0, bottom: 16, left: 0 }
        },
        h3: {
          fontFamily: 'Times New Roman, serif',
          fontSize: 18,
          color: '#333333',
          fontWeight: 'bold',
          margins: { top: 20, right: 0, bottom: 12, left: 0 }
        },
        p: {
          fontFamily: 'Times New Roman, serif',
          fontSize: 12,
          lineHeight: 1.8,
          color: '#000000',
          textAlign: 'justify',
          margins: { top: 0, right: 0, bottom: 12, left: 0 }
        },
        blockquote: {
          fontFamily: 'Times New Roman, serif',
          fontSize: 12,
          fontStyle: 'italic',
          color: '#555555',
          borders: {
            width: 3,
            color: '#cccccc',
            style: 'solid'
          },
          padding: { top: 16, right: 20, bottom: 16, left: 20 },
          margins: { top: 16, right: 0, bottom: 16, left: 40 }
        },
        code: {
          fontFamily: 'Courier New, monospace',
          fontSize: 11,
          backgroundColor: '#f5f5f5',
          color: '#000000',
          padding: { top: 2, right: 4, bottom: 2, left: 4 },
          borders: {
            width: 1,
            color: '#cccccc',
            style: 'solid'
          }
        },
        pre: {
          fontFamily: 'Courier New, monospace',
          fontSize: 10,
          backgroundColor: '#f8f8f8',
          color: '#000000',
          padding: { top: 12, right: 16, bottom: 12, left: 16 },
          borders: {
            width: 1,
            color: '#cccccc',
            style: 'solid'
          },
          margins: { top: 12, right: 0, bottom: 12, left: 0 }
        },
        table: {
          header: {
            fontFamily: 'Times New Roman, serif',
            fontSize: 12,
            fontWeight: 'bold',
            color: '#000000',
            backgroundColor: '#f0f0f0'
          },
          cell: {
            fontFamily: 'Times New Roman, serif',
            fontSize: 12,
            color: '#000000',
            backgroundColor: '#ffffff'
          },
          border: {
            width: 1,
            color: '#000000',
            style: 'solid'
          }
        },
        link: {
          fontFamily: 'Times New Roman, serif',
          fontSize: 12,
          color: '#0000cc',
          textDecoration: 'underline'
        }
      },
      colors: {
        primary: '#000000',
        secondary: '#333333',
        accent: '#666666',
        text: '#000000',
        background: '#ffffff',
        muted: '#f5f5f5',
        success: '#008000',
        warning: '#ff8c00',
        error: '#cc0000'
      }
    };
  }

  /**
   * Créer le template Minimal
   */
  private createMinimalTemplate(): Template {
    return {
      metadata: {
        id: 'minimal',
        name: 'Minimal',
        description: 'Design minimaliste épuré, noir et blanc',
        category: 'professional',
        author: 'MDtoPDF',
        version: '1.0.0',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        tags: ['minimal', 'épuré', 'noir-blanc'],
        isDefault: true,
        isPremium: false,
        preview: '⚪'
      },
      page: {
        size: 'a4',
        orientation: 'portrait',
        backgroundColor: '#ffffff'
      },
      header: {
        enabled: false,
        content: '',
        height: 0
      },
      footer: {
        enabled: false,
        content: '',
        height: 0
      },
      typography: {
        h1: {
          fontFamily: 'Georgia, serif',
          fontSize: 28,
          color: '#000000',
          fontWeight: 'normal',
          margins: { top: 24, right: 0, bottom: 16, left: 0 }
        },
        h2: {
          fontFamily: 'Georgia, serif',
          fontSize: 20,
          color: '#000000',
          fontWeight: 'normal',
          margins: { top: 20, right: 0, bottom: 12, left: 0 }
        },
        h3: {
          fontFamily: 'Georgia, serif',
          fontSize: 16,
          color: '#333333',
          fontWeight: 'normal',
          margins: { top: 16, right: 0, bottom: 8, left: 0 }
        },
        p: {
          fontFamily: 'Georgia, serif',
          fontSize: 14,
          lineHeight: 1.7,
          color: '#000000',
          margins: { top: 0, right: 0, bottom: 14, left: 0 }
        },
        blockquote: {
          fontFamily: 'Georgia, serif',
          fontSize: 14,
          fontStyle: 'italic',
          color: '#666666',
          borders: {
            width: 2,
            color: '#cccccc',
            style: 'solid'
          },
          padding: { top: 16, right: 20, bottom: 16, left: 20 },
          margins: { top: 16, right: 0, bottom: 16, left: 0 }
        },
        code: {
          fontFamily: 'Monaco, monospace',
          fontSize: 13,
          backgroundColor: '#f8f8f8',
          color: '#000000',
          padding: { top: 2, right: 6, bottom: 2, left: 6 }
        },
        pre: {
          fontFamily: 'Monaco, monospace',
          fontSize: 12,
          backgroundColor: '#f8f8f8',
          color: '#000000',
          padding: { top: 12, right: 16, bottom: 12, left: 16 },
          borders: {
            width: 1,
            color: '#dddddd',
            style: 'solid'
          },
          margins: { top: 12, right: 0, bottom: 12, left: 0 }
        },
        table: {
          header: {
            fontFamily: 'Georgia, serif',
            fontSize: 14,
            fontWeight: 'bold',
            color: '#000000',
            backgroundColor: '#ffffff'
          },
          cell: {
            fontFamily: 'Georgia, serif',
            fontSize: 14,
            color: '#000000',
            backgroundColor: '#ffffff'
          },
          border: {
            width: 1,
            color: '#dddddd',
            style: 'solid'
          }
        },
        link: {
          fontFamily: 'Georgia, serif',
          fontSize: 14,
          color: '#000000',
          textDecoration: 'underline'
        }
      },
      colors: {
        primary: '#000000',
        secondary: '#333333',
        accent: '#666666',
        text: '#000000',
        background: '#ffffff',
        muted: '#f8f8f8',
        success: '#008000',
        warning: '#ff8c00',
        error: '#cc0000'
      }
    };
  }

  /**
   * Créer le template Corporate
   */
  private createCorporateTemplate(): Template {
    return {
      metadata: {
        id: 'corporate',
        name: 'Corporate',
        description: 'Template professionnel pour documents d\'entreprise',
        category: 'business',
        author: 'MDtoPDF',
        version: '1.0.0',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        tags: ['entreprise', 'professionnel', 'rapport'],
        isDefault: true,
        isPremium: false,
        preview: '🏢'
      },
      page: {
        size: 'a4',
        orientation: 'portrait',
        backgroundColor: '#ffffff'
      },
      header: {
        enabled: true,
        content: '{{company_name}}\n{{document_title}}',
        height: 70,
        style: {
          fontFamily: 'Arial, sans-serif',
          fontSize: 16,
          color: '#1a1a1a',
          backgroundColor: '#f8f9fa',
          borders: {
            width: 2,
            color: '#007bff',
            style: 'solid'
          },
          padding: { top: 16, right: 20, bottom: 16, left: 20 }
        },
        alignment: 'left',
        pageNumber: false,
        date: true
      },
      footer: {
        enabled: true,
        content: '{{company_name}} | Page {{page_number}}',
        height: 35,
        style: {
          fontFamily: 'Arial, sans-serif',
          fontSize: 10,
          color: '#6c757d',
          backgroundColor: '#f8f9fa',
          borders: {
            width: 1,
            color: '#dee2e6',
            style: 'solid'
          },
          padding: { top: 8, right: 20, bottom: 8, left: 20 }
        },
        alignment: 'center',
        pageNumber: true
      },
      typography: {
        h1: {
          fontFamily: 'Arial, sans-serif',
          fontSize: 24,
          color: '#007bff',
          fontWeight: 'bold',
          margins: { top: 24, right: 0, bottom: 16, left: 0 }
        },
        h2: {
          fontFamily: 'Arial, sans-serif',
          fontSize: 20,
          color: '#0056b3',
          fontWeight: 'bold',
          margins: { top: 20, right: 0, bottom: 12, left: 0 }
        },
        h3: {
          fontFamily: 'Arial, sans-serif',
          fontSize: 16,
          color: '#004085',
          fontWeight: 'bold',
          margins: { top: 16, right: 0, bottom: 8, left: 0 }
        },
        p: {
          fontFamily: 'Arial, sans-serif',
          fontSize: 12,
          lineHeight: 1.6,
          color: '#212529',
          margins: { top: 0, right: 0, bottom: 10, left: 0 }
        },
        blockquote: {
          fontFamily: 'Arial, sans-serif',
          fontSize: 12,
          fontStyle: 'italic',
          color: '#6c757d',
          backgroundColor: '#e9ecef',
          borders: {
            width: 4,
            color: '#007bff',
            style: 'solid'
          },
          padding: { top: 12, right: 16, bottom: 12, left: 16 },
          margins: { top: 12, right: 0, bottom: 12, left: 0 }
        },
        code: {
          fontFamily: 'Consolas, monospace',
          fontSize: 11,
          backgroundColor: '#e9ecef',
          color: '#c7254e',
          padding: { top: 2, right: 4, bottom: 2, left: 4 },
          borderRadius: 3
        },
        pre: {
          fontFamily: 'Consolas, monospace',
          fontSize: 11,
          backgroundColor: '#f8f9fa',
          color: '#212529',
          padding: { top: 12, right: 16, bottom: 12, left: 16 },
          borders: {
            width: 1,
            color: '#dee2e6',
            style: 'solid'
          },
          borderRadius: 4,
          margins: { top: 12, right: 0, bottom: 12, left: 0 }
        },
        table: {
          header: {
            fontFamily: 'Arial, sans-serif',
            fontSize: 12,
            fontWeight: 'bold',
            color: '#ffffff',
            backgroundColor: '#007bff'
          },
          cell: {
            fontFamily: 'Arial, sans-serif',
            fontSize: 12,
            color: '#212529',
            backgroundColor: '#ffffff'
          },
          border: {
            width: 1,
            color: '#dee2e6',
            style: 'solid'
          }
        },
        link: {
          fontFamily: 'Arial, sans-serif',
          fontSize: 12,
          color: '#007bff',
          textDecoration: 'none'
        }
      },
      colors: {
        primary: '#007bff',
        secondary: '#6c757d',
        accent: '#17a2b8',
        text: '#212529',
        background: '#ffffff',
        muted: '#f8f9fa',
        success: '#28a745',
        warning: '#ffc107',
        error: '#dc3545'
      }
    };
  }

  /**
   * Créer le template Technique
   */
  private createTechnicalTemplate(): Template {
    return {
      metadata: {
        id: 'technical',
        name: 'Technique',
        description: 'Template pour documentation technique et code',
        category: 'technical',
        author: 'MDtoPDF',
        version: '1.0.0',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        tags: ['technique', 'code', 'documentation'],
        isDefault: true,
        isPremium: false,
        preview: '⚙️'
      },
      page: {
        size: 'a4',
        orientation: 'portrait',
        backgroundColor: '#fafafa'
      },
      header: {
        enabled: true,
        content: '{{document_title}}',
        height: 50,
        style: {
          fontFamily: 'Menlo, Monaco, monospace',
          fontSize: 18,
          color: '#24292e',
          backgroundColor: '#f6f8fa',
          borders: {
            width: 2,
            color: '#0366d6',
            style: 'solid'
          },
          padding: { top: 12, right: 20, bottom: 12, left: 20 }
        },
        alignment: 'left',
        pageNumber: false
      },
      footer: {
        enabled: true,
        content: '{{author_name}} | {{page_number}}',
        height: 30,
        style: {
          fontFamily: 'Menlo, Monaco, monospace',
          fontSize: 10,
          color: '#586069',
          backgroundColor: '#f6f8fa',
          borders: {
            width: 1,
            color: '#d1d9e0',
            style: 'solid'
          },
          padding: { top: 6, right: 20, bottom: 6, left: 20 }
        },
        alignment: 'center',
        pageNumber: true
      },
      typography: {
        h1: {
          fontFamily: 'Menlo, Monaco, monospace',
          fontSize: 24,
          color: '#0969da',
          fontWeight: 'bold',
          margins: { top: 20, right: 0, bottom: 12, left: 0 }
        },
        h2: {
          fontFamily: 'Menlo, Monaco, monospace',
          fontSize: 18,
          color: '#1f2328',
          fontWeight: 'bold',
          margins: { top: 16, right: 0, bottom: 10, left: 0 }
        },
        h3: {
          fontFamily: 'Menlo, Monaco, monospace',
          fontSize: 16,
          color: '#24292e',
          fontWeight: 'bold',
          margins: { top: 12, right: 0, bottom: 8, left: 0 }
        },
        p: {
          fontFamily: 'Segoe UI, system-ui, sans-serif',
          fontSize: 13,
          lineHeight: 1.6,
          color: '#24292e',
          margins: { top: 0, right: 0, bottom: 10, left: 0 }
        },
        blockquote: {
          fontFamily: 'Segoe UI, system-ui, sans-serif',
          fontSize: 13,
          fontStyle: 'italic',
          color: '#656d76',
          backgroundColor: '#f6f8fa',
          borders: {
            width: 4,
            color: '#0969da',
            style: 'solid'
          },
          padding: { top: 12, right: 16, bottom: 12, left: 16 },
          margins: { top: 12, right: 0, bottom: 12, left: 0 }
        },
        code: {
          fontFamily: 'Menlo, Monaco, monospace',
          fontSize: 12,
          backgroundColor: '#fffbdd',
          color: '#24292e',
          padding: { top: 2, right: 4, bottom: 2, left: 4 },
          borders: {
            width: 1,
            color: '#d0d7de',
            style: 'solid'
          },
          borderRadius: 3
        },
        pre: {
          fontFamily: 'Menlo, Monaco, monospace',
          fontSize: 11,
          backgroundColor: '#1f2428',
          color: '#e6edf3',
          padding: { top: 12, right: 16, bottom: 12, left: 16 },
          borders: {
            width: 1,
            color: '#30363d',
            style: 'solid'
          },
          borderRadius: 6,
          margins: { top: 12, right: 0, bottom: 12, left: 0 }
        },
        table: {
          header: {
            fontFamily: 'Menlo, Monaco, monospace',
            fontSize: 12,
            fontWeight: 'bold',
            color: '#ffffff',
            backgroundColor: '#0969da'
          },
          cell: {
            fontFamily: 'Segoe UI, system-ui, sans-serif',
            fontSize: 12,
            color: '#24292e',
            backgroundColor: '#ffffff'
          },
          border: {
            width: 1,
            color: '#d1d9e0',
            style: 'solid'
          }
        },
        link: {
          fontFamily: 'Segoe UI, system-ui, sans-serif',
          fontSize: 13,
          color: '#0969da',
          textDecoration: 'none'
        }
      },
      colors: {
        primary: '#0969da',
        secondary: '#656d76',
        accent: '#1f883d',
        text: '#24292e',
        background: '#ffffff',
        muted: '#f6f8fa',
        success: '#1a7f37',
        warning: '#9a6700',
        error: '#cf222e'
      }
    };
  }

  /**
   * Valider la structure d'un template
   */
  private validateTemplate(template: any): boolean {
    try {
      return (
        template &&
        template.metadata &&
        template.metadata.id &&
        template.metadata.name &&
        template.page &&
        template.typography &&
        template.colors
      );
    } catch {
      return false;
    }
  }

  /**
   * Générer un ID de template unique
   */
  private generateTemplateId(): string {
    return `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Nettoyer le stockage local (pour le développement)
   */
  clearStorage(): void {
    try {
      localStorage.removeItem(this.CUSTOM_TEMPLATES_KEY);
      localStorage.removeItem(this.LIBRARY_KEY);
      console.log('Stockage des templates nettoyé');
    } catch (error) {
      console.error('Erreur lors du nettoyage du stockage:', error);
    }
  }

  /**
   * Obtenir des statistiques sur les templates
   */
  getStats(): {
    total: number;
    default: number;
    custom: number;
    byCategory: Array<{
      category: string;
      count: number;
    }>;
    recentlyCreated: Array<{
      id: string;
      name: string;
      updatedAt: number;
    }>;
  } {
    const templates = this.getAllTemplates();
    const categories = this.getCategories();

    return {
      total: templates.length,
      default: templates.filter(t => t.metadata.isDefault).length,
      custom: templates.filter(t => !t.metadata.isDefault).length,
      byCategory: categories.map(cat => ({
        category: cat.name,
        count: templates.filter(t => t.metadata.category === cat.id).length
      })),
      recentlyCreated: templates
        .filter(t => !t.metadata.isDefault)
        .sort((a, b) => b.metadata.updatedAt - a.metadata.updatedAt)
        .slice(0, 5)
        .map(t => ({
          id: t.metadata.id,
          name: t.metadata.name,
          updatedAt: t.metadata.updatedAt
        }))
    };
  }
}

export default TemplateService;