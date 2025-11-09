import React, { useState, useRef, useEffect } from 'react';
import {
  DocumentTextIcon,
  EyeIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentIcon,
  SparklesIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  CodeBracketIcon,
  ClipboardDocumentListIcon,
  NewspaperIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';
import { useTemplates } from '../../hooks/useTemplates.tsx';
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
  const [carouselIndex, setCarouselIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

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

  // Navigation du carousel
  const canGoNext = carouselIndex < Math.max(0, filteredTemplates.length - 3);
  const canGoPrev = carouselIndex > 0;

  const handleNext = () => {
    if (canGoNext) {
      setCarouselIndex(carouselIndex + 1);
    }
  };

  const handlePrev = () => {
    if (canGoPrev) {
      setCarouselIndex(carouselIndex - 1);
    }
  };

  // Calculer le nombre de cartes visibles
  const visibleCards = Math.min(3, filteredTemplates.length);

  // Réinitialiser l'index du carousel quand les filtres changent
  React.useEffect(() => {
    setCarouselIndex(0);
  }, [selectedCategory, searchQuery]);

  // Fonction pour obtenir l'icône correspondante à la catégorie
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'business':
        return <BriefcaseIcon style={{ width: '14px', height: '14px' }} />;
      case 'academic':
        return <AcademicCapIcon style={{ width: '14px', height: '14px' }} />;
      case 'technical':
        return <CodeBracketIcon style={{ width: '14px', height: '14px' }} />;
      case 'report':
        return <ClipboardDocumentListIcon style={{ width: '14px', height: '14px' }} />;
      case 'modern':
        return <SparklesIcon style={{ width: '14px', height: '14px' }} />;
      default:
        return <DocumentIcon style={{ width: '14px', height: '14px' }} />;
    }
  };

  // Classes pour les onglets de catégories (style Header)
  const getCategoryTabClasses = (isActive: boolean) => {
    const baseClasses = "px-4 py-1.5 border border-b-2 rounded-t-lg text-xs font-medium cursor-pointer transition-all duration-200 min-w-[80px] flex items-center justify-center gap-1 outline-none appearance-none transform translate-y-0 hover:translate-y-[-1px] hover:shadow-md";

    if (isActive) {
      return `${baseClasses} bg-gradient-to-r from-gray-500 to-gray-600 text-white border-gray-600 border-b-gray-600`;
    }

    return `${baseClasses} ${isDarkMode
      ? 'bg-gray-800 text-gray-100 border-gray-600 border-b-transparent hover:bg-gray-700 hover:border-b-gray-500'
      : 'bg-white text-gray-900 border-gray-300 border-b-transparent hover:bg-gray-50 hover:border-b-gray-400'
    }`;
  };

  // Fonction pour obtenir l'icône correspondante au template
  const getTemplateIcon = (template: Template) => {
    // Basé sur la catégorie ou le preview emoji
    const category = template.metadata.category?.toLowerCase();
    const preview = template.metadata.preview || '';

    // Mapping des catégories vers les icônes
    if (category?.includes('business') || preview?.includes('💼')) {
      return <BriefcaseIcon style={{ width: '16px', height: '16px' }} />;
    }
    if (category?.includes('academic') || preview?.includes('🎓')) {
      return <AcademicCapIcon style={{ width: '16px', height: '16px' }} />;
    }
    if (category?.includes('code') || category?.includes('technical') || preview?.includes('💻')) {
      return <CodeBracketIcon style={{ width: '16px', height: '16px' }} />;
    }
    if (category?.includes('report') || preview?.includes('📊')) {
      return <ClipboardDocumentListIcon style={{ width: '16px', height: '16px' }} />;
    }
    if (category?.includes('news') || preview?.includes('📰')) {
      return <NewspaperIcon style={{ width: '16px', height: '16px' }} />;
    }
    if (category?.includes('modern') || preview?.includes('✨')) {
      return <SparklesIcon style={{ width: '16px', height: '16px' }} />;
    }
    if (category?.includes('book') || preview?.includes('📚')) {
      return <BookOpenIcon style={{ width: '16px', height: '16px' }} />;
    }

    // Icône par défaut
    return <DocumentIcon style={{ width: '16px', height: '16px' }} />;
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
    marginBottom: '12px'
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
    gap: '2px',
    marginBottom: '0px',
    alignItems: 'flex-end',
    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
    padding: '0 8px 0 8px',
    borderBottom: `2px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`
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

  const carouselContainerStyle = {
    position: 'relative' as const,
    overflow: 'hidden',
    borderRadius: '0 0 12px 12px',
    backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
    border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
    borderTop: 'none',
    height: '180px'
  };

  const carouselTrackStyle = {
    display: 'flex',
    transition: 'transform 0.3s ease',
    height: '100%',
    alignItems: 'stretch'
  };

  const carouselCardStyle = (isSelected: boolean) => ({
    minWidth: '250px',
    maxWidth: '250px',
    border: `2px solid ${isSelected ? (isDarkMode ? '#6b7280' : '#9ca3af') : (isDarkMode ? '#374151' : '#f3f4f6')}`,
    borderRadius: '8px',
    backgroundColor: isSelected
      ? (isDarkMode ? '#374151' : '#f9fafb')
      : (isDarkMode ? '#1f2937' : '#ffffff'),
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    padding: '12px',
    margin: '8px',
    boxShadow: isSelected
      ? (isDarkMode ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)')
      : (isDarkMode ? '0 2px 6px rgba(0,0,0,0.2)' : '0 2px 6px rgba(0,0,0,0.05)')
  });

  const navigationButtonStyle = (disabled: boolean) => ({
    position: 'absolute' as const,
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
    border: `1px solid ${isDarkMode ? '#475569' : '#e2e8f0'}`,
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.2s ease',
    zIndex: 10,
    color: isDarkMode ? '#9ca3af' : '#6b7280'
  });

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

      {/* Onglets de catégories style Windows */}
      <div style={categoryTabsStyle}>
        <button
          className={getCategoryTabClasses(selectedCategory === 'all')}
          onClick={() => setSelectedCategory('all')}
        >
          <DocumentIcon style={{ width: '14px', height: '14px' }} />
          <span>Tous ({templates.length})</span>
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            className={getCategoryTabClasses(selectedCategory === category.id)}
            onClick={() => setSelectedCategory(category.id)}
          >
            {getCategoryIcon(category.name)}
            <span>{category.name} ({category.templates.length})</span>
          </button>
        ))}
      </div>

      {/* Carousel de templates */}
      <div style={carouselContainerStyle}>
        {canGoPrev && (
          <button
            style={navigationButtonStyle(false)}
            onClick={handlePrev}
            title="Précédent"
          >
            <ChevronLeftIcon style={{ width: '16px', height: '16px' }} />
          </button>
        )}

        {canGoNext && (
          <button
            style={{ ...navigationButtonStyle(false), right: '8px' }}
            onClick={handleNext}
            title="Suivant"
          >
            <ChevronRightIcon style={{ width: '16px', height: '16px' }} />
          </button>
        )}

        <div
          ref={carouselRef}
          style={{
            ...carouselTrackStyle,
            transform: `translateX(-${carouselIndex * 266}px)` // 250px + 16px margin
          }}
        >
          {filteredTemplates.map(template => (
            <div
              key={template.metadata.id}
              style={carouselCardStyle(selectedTemplate?.metadata.id === template.metadata.id)}
              onClick={() => handleTemplateSelect(template)}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '4px'
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: isDarkMode ? '#f1f5f9' : '#1e293b',
                    margin: '0 0 4px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    <span style={{
                      color: isDarkMode ? '#9ca3af' : '#6b7280',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      {getTemplateIcon(template)}
                    </span>
                    {template.metadata.name}
                  </h4>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '10px',
                    color: isDarkMode ? '#9ca3af' : '#6b7280'
                  }}>
                    <span style={{
                      backgroundColor: isDarkMode ? '#4b5563' : '#e5e7eb',
                      color: isDarkMode ? '#d1d5db' : '#4b5563',
                      padding: '1px 4px',
                      borderRadius: '3px',
                      fontSize: '9px',
                      fontWeight: '500'
                    }}>
                      {template.metadata.category}
                    </span>
                    {template.metadata.isPremium && (
                      <span style={{
                        backgroundColor: isDarkMode ? '#6b7280' : '#9ca3af',
                        color: '#fff',
                        padding: '1px 4px',
                        borderRadius: '3px',
                        fontSize: '9px',
                        fontWeight: '500'
                      }}>
                        PRO
                      </span>
                    )}
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  gap: '4px',
                  flexShrink: 0
                }}>
                  <button
                    style={{
                      ...actionButtonStyle,
                      padding: '4px',
                      minWidth: '24px',
                      height: '24px'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewTemplate(template);
                    }}
                    title="Aperçu"
                  >
                    <EyeIcon style={{ width: '12px', height: '12px' }} />
                  </button>
                  {!template.metadata.isDefault && (
                    <button
                      style={{
                        ...actionButtonStyle,
                        padding: '4px',
                        minWidth: '24px',
                        height: '24px'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicate(template);
                      }}
                      title="Dupliquer"
                    >
                      <DocumentDuplicateIcon style={{ width: '12px', height: '12px' }} />
                    </button>
                  )}
                </div>
              </div>
              <p style={{
                fontSize: '11px',
                color: isDarkMode ? '#d1d5db' : '#6b7280',
                lineHeight: '1.3',
                margin: '0',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}>
                {template.metadata.description}
              </p>
              <div style={{
                fontSize: '10px',
                color: isDarkMode ? '#6b7280' : '#9ca3af',
                marginTop: 'auto'
              }}>
                {template.metadata.author} • v{template.metadata.version}
              </div>
            </div>
          ))}
        </div>

        {/* Indicateurs de position */}
        {filteredTemplates.length > 3 && (
          <div style={{
            position: 'absolute',
            bottom: '8px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '4px'
          }}>
            {Array.from({ length: Math.ceil(filteredTemplates.length / 3) }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: i === Math.floor(carouselIndex / 3)
                    ? (isDarkMode ? '#6b7280' : '#9ca3af')
                    : (isDarkMode ? '#4b5563' : '#d1d5db'),
                  transition: 'all 0.2s ease'
                }}
              />
            ))}
          </div>
        )}
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