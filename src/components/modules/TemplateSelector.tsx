import React, { useState } from 'react';
import { SparklesIcon, PlusIcon } from '@heroicons/react/24/outline';
import TemplateManager from './TemplateManager';

interface Template {
  id: string;
  name: string;
  description: string;
  colors: string[];
  isPro: boolean;
  category: 'modern' | 'classic' | 'academic' | 'creative';
  content?: string;
  style?: any;
}

interface TemplateSelectorProps {
  templates: Template[];
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
  onCreateTemplate: () => void;
  isDarkMode: boolean;
  onApplyTemplate?: (content: string, style?: any) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  selectedTemplate,
  onTemplateSelect,
  isDarkMode,
  onApplyTemplate
}) => {
  const [showManager, setShowManager] = useState(false);
  const [customTemplates, setCustomTemplates] = useState<any[]>([]);
  const panelStyle = {
    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
    padding: '24px',
    borderRadius: '12px',
    border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  };

  const titleStyle = {
    margin: 0,
    fontSize: '18px',
    fontWeight: '700',
    color: isDarkMode ? '#f1f5f9' : '#1e293b',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px'
  };

  const templateCardStyle = (isSelected: boolean) => ({
    backgroundColor: isSelected ? (isDarkMode ? '#1e3a5f' : '#eff6ff') : (isDarkMode ? '#0f172a' : '#ffffff'),
    border: isSelected ? '2px solid #6b7280' : `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
    borderRadius: '12px',
    padding: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative' as const,
    boxShadow: isSelected ? '0 4px 12px rgba(107, 114, 128, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.05)'
  });

  const badgeStyle = (isPro: boolean) => ({
    position: 'absolute' as const,
    top: '12px',
    right: '12px',
    backgroundColor: isPro ? '#f59e0b' : '#10b981',
    color: '#ffffff',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase' as const
  });

  const colorPreviewStyle = {
    display: 'flex',
    gap: '4px',
    marginBottom: '12px'
  };

  const colorBlockStyle = {
    height: '6px',
    borderRadius: '2px',
    flex: 1
  };

  const nameStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: isDarkMode ? '#f1f5f9' : '#1e293b',
    margin: '0 0 8px 0'
  };

  const descriptionStyle = {
    fontSize: '13px',
    color: isDarkMode ? '#94a3b8' : '#64748b',
    margin: 0,
    lineHeight: '1.5'
  };

  const createButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
    border: `2px dashed ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
    borderRadius: '12px',
    color: isDarkMode ? '#d1d5db' : '#6b7280',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    justifyContent: 'center'
  };

  const handleCardClick = (templateId: string) => {
    onTemplateSelect(templateId);

    // Si le template a du contenu, l'appliquer
    const template = [...templates, ...customTemplates].find(t => t.id === templateId);
    if (template?.content && onApplyTemplate) {
      onApplyTemplate(template.content, template.style);
    }
  };

  const handleCardHover = (e: React.MouseEvent<HTMLDivElement>, isSelected: boolean) => {
    if (!isSelected) {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
    }
  };

  const handleCardLeave = (e: React.MouseEvent<HTMLDivElement>, isSelected: boolean) => {
    if (!isSelected) {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
    }
  };

  const handleCreateHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = isDarkMode ? '#4b5563' : '#e5e7eb';
    e.currentTarget.style.borderColor = isDarkMode ? '#6b7280' : '#9ca3af';
  };

  const handleCreateLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = isDarkMode ? '#374151' : '#f3f4f6';
    e.currentTarget.style.borderColor = isDarkMode ? '#4b5563' : '#d1d5db';
  };

  const handleCreateTemplate = () => {
    setShowManager(true);
  };

  const handleTemplateSelect = (template: any) => {
    if (onApplyTemplate) {
      onApplyTemplate(template.content, template.style);
    }
  };

  const handleTemplateCreate = (template: any) => {
    const newTemplate = {
      id: `custom-${Date.now()}`,
      ...template,
      isPro: false,
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
    };
    setCustomTemplates([...customTemplates, newTemplate]);
  };

  const handleTemplateUpdate = (id: string, updates: any) => {
    setCustomTemplates(customTemplates.map(t =>
      t.id === id ? { ...t, ...updates } : t
    ));
  };

  const handleTemplateDelete = (id: string) => {
    setCustomTemplates(customTemplates.filter(t => t.id !== id));
  };

  if (showManager) {
    return (
      <TemplateManager
        templates={customTemplates}
        onTemplateSelect={handleTemplateSelect}
        onTemplateCreate={handleTemplateCreate}
        onTemplateUpdate={handleTemplateUpdate}
        onTemplateDelete={handleTemplateDelete}
        isDarkMode={isDarkMode}
      />
    );
  }

  return (
    <div style={panelStyle}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>
          <SparklesIcon style={{ width: '20px', height: '20px' }} />
          Templates Professionnels
        </h3>
      </div>

      <div style={gridStyle}>
        {[...templates, ...customTemplates].map((template) => (
          <div
            key={template.id}
            style={templateCardStyle(selectedTemplate === template.id)}
            onClick={() => handleCardClick(template.id)}
            onMouseEnter={(e) => handleCardHover(e, selectedTemplate === template.id)}
            onMouseLeave={(e) => handleCardLeave(e, selectedTemplate === template.id)}
          >
            <span style={badgeStyle(template.isPro)}>
              {template.isPro ? 'Pro' : 'Free'}
            </span>

            <div style={colorPreviewStyle}>
              {template.colors.map((color: string, index: number) => (
                <div
                  key={index}
                  style={{
                    ...colorBlockStyle,
                    backgroundColor: color
                  }}
                />
              ))}
            </div>

            <h4 style={nameStyle}>{template.name}</h4>
            <p style={descriptionStyle}>{template.description}</p>
          </div>
        ))}

        <button
          onClick={handleCreateTemplate}
          style={createButtonStyle}
          onMouseEnter={handleCreateHover}
          onMouseLeave={handleCreateLeave}
        >
          <PlusIcon style={{ width: '18px', height: '18px' }} />
          Gestion des templates
        </button>
      </div>
    </div>
  );
};

export default TemplateSelector;