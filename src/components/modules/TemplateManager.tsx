import React, { useState } from 'react';
import {
  DocumentPlusIcon,
  PencilIcon,
  TrashIcon,
  DocumentIcon,
  EyeIcon,
  FolderOpenIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import {  TemplateStyles, TemplateLayout } from '@/types/app';

// Type pour TemplateManager qui inclut le content obligatoire
export interface TemplateWithContent {
  id: string;
  name: string;
  description: string;
  category: 'business' | 'academic' | 'creative' | 'technical'|'custom';
  styles: TemplateStyles;
  layout: TemplateLayout;
  preview: string;
  content: string; // Propriété obligatoire pour le contenu
  style?: any;
  colors: string[];
  isPro: boolean;
}

// Type pour le formulaire de création/édition
interface TemplateFormData {
  name: string;
  description: string;
  content: string;
  style: LegacyStyle;
  category:'business' | 'academic' | 'creative' | 'technical' | 'custom';
}

// Ancienne structure de style pour compatibilité
interface LegacyStyle {
  fontFamily: string;
  fontSize: string;
  lineHeight: string;
  color: string;
  headerColor: string;
  backgroundColor: string;
  borderColor: string;
}

// Fonction pour convertir l'ancien style vers le nouveau format
const convertLegacyStyle = (legacy: LegacyStyle): TemplateStyles => ({
  fontFamily: legacy.fontFamily,
  fontSize: parseInt(legacy.fontSize),
  lineHeight: parseFloat(legacy.lineHeight),
  colors: {
    primary: legacy.headerColor,
    secondary: legacy.color,
    text: legacy.color,
    background: legacy.backgroundColor,
  }
});

// Fonction pour créer un layout par défaut
const createDefaultLayout = (): TemplateLayout => ({
  pageSize: 'a4',
  orientation: 'portrait',
  margins: { top: 20, right: 20, bottom: 20, left: 20 }
});

interface TemplateManagerProps {
  templates: TemplateWithContent[];
  onTemplateSelect: (template: TemplateWithContent) => void;
  onTemplateCreate: (template: TemplateWithContent) => void;
  onTemplateUpdate: (id: string, template: Partial<TemplateWithContent>) => void;
  onTemplateDelete: (id: string) => void;
  isDarkMode: boolean;
  onClose: () => void;
}

const TemplateManager: React.FC<TemplateManagerProps> = ({
  templates,
  onTemplateSelect,
  onTemplateCreate,
  onTemplateUpdate,
  onTemplateDelete,
  isDarkMode,
  onClose
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateWithContent | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateWithContent | null>(null);
  const [formData, setFormData] = useState<TemplateFormData>({
    name: '',
    description: '',
    content: '',
    style: {
      fontFamily: 'Inter',
      fontSize: '12px',
      lineHeight: '1.4',
      color: '#1e293b',
      headerColor: '#1e293b',
      backgroundColor: '#ffffff',
      borderColor: '#e5e7eb'
    },
    category: 'business'
  });

  const defaultTemplates: TemplateWithContent[] = [
    {
      id: 'business-report',
      name: 'Rapport d\'entreprise',
      description: 'Template professionnel pour rapports et documents d\'entreprise',
      content: `# Rapport d'entreprise

## Résumé exécutif

<!-- pagebreak -->

## Analyse détaillée

### Méthodologie

### Résultats

<!-- pagebreak -->

## Recommandations

### Actions prioritaires

### Calendrier de mise en œuvre`,
      styles: convertLegacyStyle({
        fontFamily: 'Inter, sans-serif',
        fontSize: '12px',
        lineHeight: '1.4',
        color: '#1e293b',
        headerColor: '#1e293b',
        backgroundColor: '#ffffff',
        borderColor: '#e5e7eb'
      }),
      layout: createDefaultLayout(),
      preview: '/templates/business-report-preview.png',
      category: 'business',
      colors: ['#1e293b', '#3b82f6', '#10b981', '#f59e0b'],
      isPro: false
    },
    {
      id: 'academic-paper',
      name: 'Article académique',
      description: 'Template formaté pour publications académiques et recherches',
      content: `# Titre de l'article

**Auteur** - *Institution*

## Résumé

## Introduction

### Contexte

### Problématique

<!-- pagebreak -->

## Méthodologie

### Collecte de données

### Analyse

<!-- pagebreak -->

## Résultats

## Discussion

## Conclusion

## Références`,
      styles: convertLegacyStyle({
        fontFamily: 'Times New Roman, serif',
        fontSize: '11px',
        lineHeight: '1.6',
        color: '#1f2937',
        headerColor: '#1f2937',
        backgroundColor: '#ffffff',
        borderColor: '#d1d5db'
      }),
      layout: createDefaultLayout(),
      preview: `/templates/default-preview.png`,
      category: 'academic',
      colors: ['#1f2937', '#059669', '#dc2626', '#7c3aed'],
      isPro: false
    },
    {
      id: 'creative-portfolio',
      name: 'Portfolio créatif',
      description: 'Template moderne pour portfolios et présentations créatives',
      content: `# Mon Portfolio

## À propos

### Nom
### Contact
### Compétences

<!-- pagebreak -->

## Projets

### Projet 1
#### Description
#### Technologies
#### Lien

### Projet 2

<!-- pagebreak -->

## Expérience

### Poste actuel
#### Responsabilités
#### Réalisations

### Expérience précédente

<!-- pagebreak -->

## Formation

### Diplôme
### Institution
### Année

## Contact`,
      styles: convertLegacyStyle({
        fontFamily: 'Inter, sans-serif',
        fontSize: '12px',
        lineHeight: '1.5',
        color: '#374151',
        headerColor: '#1e293b',
        backgroundColor: '#ffffff',
        borderColor: '#e5e7eb'
      }),
      layout: createDefaultLayout(),
      preview: `/templates/default-preview.png`,
      category: 'creative',
      colors: ['#374151', '#f59e0b', '#8b5cf6', '#ec4899'],
      isPro: false
    }
  ];

  const allTemplates = [
    ...defaultTemplates,
    ...templates.filter(t => !defaultTemplates.some(dt => dt.id === t.id))
  ];
  const containerStyle = {
    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  };

  const titleStyle = {
    margin: 0,
    fontSize: '20px',
    fontWeight: '700',
    color: isDarkMode ? '#f1f5f9' : '#1e293b',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const buttonStyle = (variant: 'primary' | 'secondary' = 'primary') => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: variant === 'primary'
      ? 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
      : (isDarkMode ? '#374151' : '#f1f5f9'),
    border: variant === 'primary'
      ? 'none'
      : `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
    borderRadius: '8px',
    color: variant === 'primary'
      ? '#ffffff'
      : (isDarkMode ? '#f1f5f9' : '#374151'),
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  });

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  };

  const cardStyle = {
    backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
    border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
    borderRadius: '8px',
    padding: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative' as const
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      business: '#3b82f6',
      academic: '#10b981',
      creative: '#f59e0b',
      technical: '#8b5cf6',
      custom: '#ef4444'
    };
    return colors[category as keyof typeof colors] || '#6b7280';
  };

  const handleCreateTemplate = () => {
    if (formData.name && formData.content) {
      onTemplateCreate({
        id: '', // Sera généré automatiquement
        name: formData.name,
        description: formData.description,
        content: formData.content,
        styles: convertLegacyStyle(formData.style),
        layout: createDefaultLayout(),
        preview: '/templates/default-preview.png',
        category: formData.category,
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
        isPro: false
      });
      setShowCreateModal(false);
      resetForm();
    }
  };

  const handleUpdateTemplate = () => {
    if (selectedTemplate && formData.name && formData.content) {
      onTemplateUpdate(selectedTemplate.id, {
        name: formData.name,
        description: formData.description,
        content: formData.content,
        styles: convertLegacyStyle(formData.style),
        layout: createDefaultLayout(),
        preview: '/templates/default-preview.png',
        category: formData.category
      });
      setShowEditModal(false);
      setSelectedTemplate(null);
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      content: '',
      style: {
        fontFamily: 'Inter',
        fontSize: '12px',
        lineHeight: '1.4',
        color: '#1e293b',
        headerColor: '#1e293b',
        backgroundColor: '#ffffff',
        borderColor: '#e5e7eb'
      },
      category: 'business'
    });
  };

  const openEditModal = (template: TemplateWithContent) => {
    setSelectedTemplate(template);
    // Convert back to legacy format for form compatibility
    const legacyStyle = {
      fontFamily: template.styles.fontFamily,
      fontSize: `${template.styles.fontSize}px`,
      lineHeight: template.styles.lineHeight.toString(),
      color: template.styles.colors.text,
      headerColor: template.styles.colors.primary,
      backgroundColor: template.styles.colors.background,
      borderColor: '#e5e7eb'
    };

    setFormData({
      name: template.name,
      description: template.description,
      content: template.content,
      style: legacyStyle,
      category: template.category
    });
    setShowEditModal(true);
  };

  const Modal = ({
    show,
    onClose,
    title,
    onSubmit,
    submitText
  }: {
    show: boolean;
    onClose: () => void;
    title: string;
    onSubmit: () => void;
    submitText: string;
  }) => {
    if (!show) return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          width: '90%',
          maxWidth: '600px',
          maxHeight: '80vh',
          overflow: 'auto',
          border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3 style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: '600',
              color: isDarkMode ? '#f1f5f9' : '#1e293b'
            }}>
              {title}
            </h3>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                color: isDarkMode ? '#9ca3af' : '#6b7280'
              }}
            >
              <XMarkIcon style={{ width: '20px', height: '20px' }} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '4px',
                color: isDarkMode ? '#f1f5f9' : '#374151',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Nom du template
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
                  borderRadius: '6px',
                  backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                  color: isDarkMode ? '#f1f5f9' : '#1e293b'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '4px',
                color: isDarkMode ? '#f1f5f9' : '#374151',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
                  borderRadius: '6px',
                  backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                  color: isDarkMode ? '#f1f5f9' : '#1e293b'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '4px',
                color: isDarkMode ? '#f1f5f9' : '#374151',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Catégorie
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value as TemplateWithContent['category']})}                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
                  borderRadius: '6px',
                  backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                  color: isDarkMode ? '#f1f5f9' : '#1e293b'
                }}
              >
                <option value="business">Business</option>
                <option value="academic">Académique</option>
                <option value="creative">Créatif</option>
                <option value="technical">Technique</option>
                <option value="custom">Personnalisé</option>
              </select>
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '4px',
                color: isDarkMode ? '#f1f5f9' : '#374151',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Contenu du template (Markdown)
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows={10}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
                  borderRadius: '6px',
                  backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                  color: isDarkMode ? '#f1f5f9' : '#1e293b',
                  fontFamily: 'monospace',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
            marginTop: '24px'
          }}>
            <button
              onClick={onClose}
              style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
                borderRadius: '6px',
                color: isDarkMode ? '#f1f5f9' : '#374151',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Annuler
            </button>
            <button
              onClick={onSubmit}
              disabled={!formData.name || !formData.content}
              style={{
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                border: 'none',
                borderRadius: '6px',
                color: '#ffffff',
                fontSize: '14px',
                cursor: formData.name && formData.content ? 'pointer' : 'not-allowed',
                opacity: formData.name && formData.content ? 1 : 0.5
              }}
            >
              {submitText}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              color: isDarkMode ? '#9ca3af' : '#6b7280',
              borderRadius: '4px'
            }}
            title="Fermer"
          >
            <XMarkIcon style={{ width: '20px', height: '20px' }} />
          </button>
          <h2 style={titleStyle}>
            <DocumentIcon style={{ width: '24px', height: '24px' }} />
            Gestion des templates
          </h2>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          style={buttonStyle('primary')}
        >
          <DocumentPlusIcon style={{ width: '16px', height: '16px' }} />
          Nouveau template
        </button>
      </div>

      <div style={gridStyle}>
        {allTemplates.map((template) => (
          <div
            key={template.id}
            style={cardStyle}
            onClick={() => onTemplateSelect(template)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '8px'
            }}>
              <span style={{
                backgroundColor: getCategoryColor(template.category),
                color: '#ffffff',
                fontSize: '10px',
                fontWeight: '500',
                padding: '2px 6px',
                borderRadius: '4px',
                textTransform: 'uppercase'
              }}>
                {template.category}
              </span>

              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewTemplate(template);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    color: isDarkMode ? '#9ca3af' : '#6b7280',
                    borderRadius: '4px'
                  }}
                  title="Aperçu"
                >
                  <EyeIcon style={{ width: '16px', height: '16px' }} />
                </button>

                {template.category === 'custom' && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(template);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        color: isDarkMode ? '#9ca3af' : '#6b7280',
                        borderRadius: '4px'
                      }}
                      title="Modifier"
                    >
                      <PencilIcon style={{ width: '16px', height: '16px' }} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Êtes-vous sûr de vouloir supprimer ce template ?')) {
                          onTemplateDelete(template.id);
                        }
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        color: '#ef4444',
                        borderRadius: '4px'
                      }}
                      title="Supprimer"
                    >
                      <TrashIcon style={{ width: '16px', height: '16px' }} />
                    </button>
                  </>
                )}
              </div>
            </div>

            <h3 style={{
              margin: '0 0 8px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: isDarkMode ? '#f1f5f9' : '#1e293b'
            }}>
              {template.name}
            </h3>

            <p style={{
              margin: '0 0 12px 0',
              fontSize: '12px',
              color: isDarkMode ? '#9ca3af' : '#6b7280',
              lineHeight: '1.4'
            }}>
              {template.description}
            </p>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '11px',
              color: isDarkMode ? '#9ca3af' : '#6b7280'
            }}>
              <FolderOpenIcon style={{ width: '12px', height: '12px' }} />
              <span>Cliquer pour utiliser ce template</span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      <Modal
        show={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          resetForm();
        }}
        title="Créer un nouveau template"
        onSubmit={handleCreateTemplate}
        submitText="Créer"
      />

      {/* Edit Modal */}
      <Modal
        show={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedTemplate(null);
          resetForm();
        }}
        title="Modifier le template"
        onSubmit={handleUpdateTemplate}
        submitText="Mettre à jour"
      />

      {/* Preview Modal */}
      {previewTemplate && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            width: '90%',
            maxWidth: '800px',
            maxHeight: '80vh',
            overflow: 'auto',
            border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: '600',
                color: isDarkMode ? '#f1f5f9' : '#1e293b'
              }}>
                Aperçu: {previewTemplate.name}
              </h3>
              <button
                onClick={() => setPreviewTemplate(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  color: isDarkMode ? '#9ca3af' : '#6b7280'
                }}
              >
                <XMarkIcon style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <div style={{
              backgroundColor: previewTemplate.styles.colors.background,
              border: `1px solid #e5e7eb`,
              borderRadius: '8px',
              padding: '20px',
              fontFamily: previewTemplate.styles.fontFamily,
              fontSize: `${previewTemplate.styles.fontSize}px`,
              lineHeight: previewTemplate.styles.lineHeight.toString(),
              color: previewTemplate.styles.colors.text,
              whiteSpace: 'pre-wrap'
            }}>
              {previewTemplate.content}
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
              marginTop: '24px'
            }}>
              <button
                onClick={() => setPreviewTemplate(null)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'transparent',
                  border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
                  borderRadius: '6px',
                  color: isDarkMode ? '#f1f5f9' : '#374151',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  onTemplateSelect(previewTemplate);
                  setPreviewTemplate(null);
                }}
                style={{
                  padding: '8px 16px',
                  background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Utiliser ce template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateManager;
