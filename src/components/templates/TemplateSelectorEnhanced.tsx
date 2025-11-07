import React, { useState, useRef, useEffect } from 'react';
import { DocumentTextIcon, EyeIcon, DocumentDuplicateIcon, TrashIcon, ArrowDownTrayIcon, ArrowUpTrayIcon, MagnifyingGlassIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useTemplates } from '../../hooks/useTemplates';
import { Template, TemplateCategory } from '../../types/template';

interface TemplateSelectorEnhancedProps {
  isDarkMode: boolean;
  onTemplateSelect: (template: Template) => void;
  className?: string;
}

const TemplateSelectorEnhanced: React.FC<TemplateSelectorEnhancedProps> = ({
  isDarkMode,
  onTemplateSelect,
  className = ''
}) => {
  const {
    templates,
    categories,
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
    clearError
  } = useTemplates();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtrer les templates
  const filteredTemplates = React.useMemo(() => {
    let filtered = templates;

    // Filtrer par catégorie
    if (selectedCategory !== 'all') {
      filtered = getTemplatesByCategory(selectedCategory);
    }

    // Filtrer par recherche
    if (searchQuery.trim()) {
      filtered = searchTemplates(searchQuery);
    }

    return filtered;
  }, [templates, selectedCategory, searchQuery, searchTemplates, getTemplatesByCategory]);

  const handleTemplateSelect = (template: Template) => {
    selectTemplate(template);
    onTemplateSelect(template);
  };

  const handleDuplicate = async (template: Template) => {
    const duplicated = await duplicateTemplate(template.metadata.id);
    if (duplicated) {
      console.log('Template dupliqué:', duplicated.metadata.name);
    }
  };

  const handleDelete = async (templateId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce template ?')) {
      const success = await deleteTemplate(templateId);
      if (success) {
        console.log('Template supprimé');
      }
    }
  };

  const handleExport = async (template: Template) => {
    const exportData = await exportTemplate(template.metadata.id);
    if (exportData) {
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${template.metadata.name}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleImport = async () => {
    if (!importJson.trim()) {
      alert('Veuillez entrer un template JSON valide');
      return;
    }

    try {
      // Valider le JSON
      JSON.parse(importJson);
      const imported = await importTemplate(importJson);
      if (imported) {
        console.log('Template importé:', imported.metadata.name);
        setShowImportDialog(false);
        setImportJson('');
      }
    } catch (err) {
      alert('JSON invalide. Veuillez vérifier le format.');
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setImportJson(content);
      };
      reader.readAsText(file);
    }
  };

  // Styles
  const containerStyle = {
    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
    border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
    borderRadius: '12px',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  };

  const titleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: isDarkMode ? '#f1f5f9' : '#1e293b',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const searchContainerStyle = {
    position: 'relative' as const,
    marginBottom: '16px'
  };

  const searchInputStyle = {
    width: '100%',
    padding: '12px 40px 12px 16px',
    border: `1px solid ${isDarkMode ? '#475569' : '#d1d5db'}`,
    borderRadius: '8px',
    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
    color: isDarkMode ? '#f9fafb' : '#111827',
    fontSize: '14px'
  };

  const searchIconStyle = {
    position: 'absolute' as const,
    right: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '20px',
    height: '20px',
    color: isDarkMode ? '#9ca3af' : '#6b7280'
  };

  const categoryTabsStyle = {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
    flexWrap: 'wrap' as const
  };

  const categoryTabStyle = (isActive: boolean) => ({
    padding: '8px 16px',
    borderRadius: '20px',
    backgroundColor: isActive
      ? (isDarkMode ? '#3b82f6' : '#2563eb')
      : (isDarkMode ? '#374151' : '#f3f4f6'),
    color: isActive
      ? '#ffffff'
      : (isDarkMode ? '#d1d5db' : '#374151'),
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  });

  const templatesGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
    minHeight: '400px'
  };

  const templateCardStyle = (isSelected: boolean) => ({
    border: `2px solid ${isSelected ? (isDarkMode ? '#3b82f6' : '#2563eb') : (isDarkMode ? '#475569' : '#e2e8f0')}`,
    borderRadius: '12px',
    padding: '16px',
    backgroundColor: isSelected
      ? (isDarkMode ? '#1e3a8a' : '#dbeafe')
      : (isDarkMode ? '#1f2937' : '#ffffff'),
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px'
  });

  const templateHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  };

  const templateTitleStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: isDarkMode ? '#f1f5f9' : '#1e293b',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const templateMetaStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: isDarkMode ? '#9ca3af' : '#6b7280'
  };

  const templateDescriptionStyle = {
    fontSize: '13px',
    color: isDarkMode ? '#d1d5db' : '#6b7280',
    lineHeight: '1.4',
    margin: '0'
  };

  const templateActionsStyle = {
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-end'
  };

  const actionButtonStyle = {
    padding: '6px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    color: isDarkMode ? '#9ca3af' : '#6b7280',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center'
  };

  const modalOverlayStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  };

  const modalStyle = {
    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '80vh',
    overflow: 'auto'
  };

  const modalHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  };

  const modalTitleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: isDarkMode ? '#f1f5f9' : '#1e293b',
    margin: 0
  };

  const textareaStyle = {
    width: '100%',
    minHeight: '200px',
    padding: '12px',
    border: `1px solid ${isDarkMode ? '#475569' : '#d1d5db'}`,
    borderRadius: '8px',
    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
    color: isDarkMode ? '#f9fafb' : '#111827',
    fontSize: '14px',
    fontFamily: 'monospace',
    resize: 'vertical' as const
  };

  const modalActionsStyle = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '20px'
  };

  const buttonStyle = {
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: 'none'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: isDarkMode ? '#3b82f6' : '#2563eb',
    color: 'white'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'transparent',
    color: isDarkMode ? '#6b7280' : '#374151',
    border: `1px solid ${isDarkMode ? '#475569' : '#d1d5db'}`
  };

  if (isLoading) {
    return (
      <div style={containerStyle} className={className}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #e5e7eb',
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>Chargement des templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle} className={className}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      <div style={headerStyle}>
        <h2 style={titleStyle}>
          <DocumentTextIcon style={{ width: '24px', height: '24px' }} />
          Bibliothèque de Templates
        </h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            style={{
              ...actionButtonStyle,
              backgroundColor: isDarkMode ? '#3b82f6' : '#2563eb',
              color: 'white',
              padding: '8px 16px'
            }}
            onClick={() => fileInputRef.current?.click()}
            title="Importer un template"
          >
            <ArrowUpTrayIcon style={{ width: '16px', height: '16px' }} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileImport}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {error && (
        <div style={{
          backgroundColor: isDarkMode ? '#7f1d1d' : '#fef2f2',
          color: '#dc2626',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '16px',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>⚠️</span>
          {error}
          <button
            onClick={clearError}
            style={{
              background: 'none',
              border: 'none',
              color: '#dc2626',
              cursor: 'pointer',
              marginLeft: 'auto'
            }}
          >
            <XMarkIcon style={{ width: '16px', height: '16px' }} />
          </button>
        </div>
      )}

      <div style={searchContainerStyle}>
        <input
          type="text"
          placeholder="Rechercher un template..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={searchInputStyle}
        />
        <MagnifyingGlassIcon style={searchIconStyle} />
      </div>

      <div style={categoryTabsStyle}>
        <button
          style={categoryTabStyle(selectedCategory === 'all')}
          onClick={() => setSelectedCategory('all')}
        >
          Tous ({templates.length})
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            style={categoryTabStyle(selectedCategory === category.id)}
            onClick={() => setSelectedCategory(category.id)}
          >
            <span>{category.icon}</span>
            {category.name} ({category.templates.length})
          </button>
        ))}
      </div>

      <div style={templatesGridStyle}>
        {filteredTemplates.map(template => (
          <div
            key={template.metadata.id}
            style={templateCardStyle(selectedTemplate?.metadata.id === template.metadata.id)}
            onClick={() => handleTemplateSelect(template)}
          >
            <div style={templateHeaderStyle}>
              <div>
                <h3 style={templateTitleStyle}>
                  <span>{template.metadata.preview || '📄'}</span>
                  {template.metadata.name}
                </h3>
                <div style={templateMetaStyle}>
                  <span style={{
                    backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
                    color: '#fff',
                    fontSize: '10px',
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}>
                    {template.metadata.category}
                  </span>
                  {template.metadata.isPremium && (
                    <span style={{
                      backgroundColor: '#f59e0b',
                      color: '#fff',
                      fontSize: '10px',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      PRO
                    </span>
                  )}
                </div>
              </div>
              <div style={templateActionsStyle}>
                <button
                  style={actionButtonStyle}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewTemplate(template);
                  }}
                  title="Aperçu"
                >
                  <EyeIcon style={{ width: '16px', height: '16px' }} />
                </button>
                {!template.metadata.isDefault && (
                  <>
                    <button
                      style={actionButtonStyle}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicate(template);
                      }}
                      title="Dupliquer"
                    >
                      <DocumentDuplicateIcon style={{ width: '16px', height: '16px' }} />
                    </button>
                    <button
                      style={actionButtonStyle}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(template.metadata.id);
                      }}
                      title="Supprimer"
                    >
                      <TrashIcon style={{ width: '16px', height: '16px' }} />
                    </button>
                  </>
                )}
                <button
                  style={actionButtonStyle}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExport(template);
                  }}
                  title="Exporter"
                >
                  <ArrowDownTrayIcon style={{ width: '16px', height: '16px' }} />
                </button>
              </div>
            </div>
            <p style={templateDescriptionStyle}>
              {template.metadata.description}
            </p>
            <div style={{ fontSize: '12px', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
              Créé par {template.metadata.author} • Version {template.metadata.version}
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && !isLoading && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: isDarkMode ? '#9ca3af' : '#6b7280'
        }}>
          <DocumentTextIcon style={{ width: '48px', height: '48px', marginBottom: '16px', opacity: 0.5 }} />
          <p>Aucun template trouvé</p>
        </div>
      )}

      {/* Dialogue d'import */}
      {showImportDialog && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <div style={modalHeaderStyle}>
              <h3 style={modalTitleStyle}>Importer un Template</h3>
              <button
                onClick={() => setShowImportDialog(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: isDarkMode ? '#9ca3af' : '#6b7280'
                }}
              >
                <XMarkIcon style={{ width: '24px', height: '24px' }} />
              </button>
            </div>

            <textarea
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder="Collez le JSON du template ici..."
              style={textareaStyle}
            />

            <div style={modalActionsStyle}>
              <button
                style={secondaryButtonStyle}
                onClick={() => setShowImportDialog(false)}
              >
                Annuler
              </button>
              <button
                style={primaryButtonStyle}
                onClick={handleImport}
              >
                Importer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'aperçu */}
      {previewTemplate && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <div style={modalHeaderStyle}>
              <h3 style={modalTitleStyle}>
                Aperçu: {previewTemplate.metadata.name}
              </h3>
              <button
                onClick={() => setPreviewTemplate(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: isDarkMode ? '#9ca3af' : '#6b7280'
                }}
              >
                <XMarkIcon style={{ width: '24px', height: '24px' }} />
              </button>
            </div>

            <div style={{
              backgroundColor: isDarkMode ? '#1f2937' : '#f8fafc',
              padding: '20px',
              borderRadius: '8px',
              border: `1px solid ${isDarkMode ? '#475569' : '#e2e8f0'}`
            }}>
              <h4 style={{ margin: '0 0 12px 0', color: isDarkMode ? '#f1f5f9' : '#1e293b' }}>
                Configuration
              </h4>
              <div style={{ fontSize: '12px', color: isDarkMode ? '#d1d5db' : '#6b7280' }}>
                <strong>Catégorie:</strong> {previewTemplate.metadata.category}<br />
                <strong>Auteur:</strong> {previewTemplate.metadata.author}<br />
                <strong>Version:</strong> {previewTemplate.metadata.version}<br />
                <strong>Format:</strong> {previewTemplate.page.size.toUpperCase()} {previewTemplate.page.orientation}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button
                style={primaryButtonStyle}
                onClick={() => setPreviewTemplate(null)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateSelectorEnhanced;