import React, { useState } from 'react';
import { useTemplates } from '@/hooks/useTemplates';
import { useAppStore } from '@/stores/appStore';
import { Template } from '@/types/app';
import {
  DocumentTextIcon,
  AcademicCapIcon,
  PaintBrushIcon,
  PlusIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

interface TemplateSelectorProps {
  isDarkMode: boolean;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ isDarkMode }) => {
  const { data: templates, isLoading } = useTemplates();
  const { selectedTemplate, setSelectedTemplate } = useAppStore();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');

  const getTemplateIcon = (category: Template['category']) => {
    switch (category) {
      case 'professional':
        return <DocumentTextIcon className="w-6 h-6" />;
      case 'academic':
        return <AcademicCapIcon className="w-6 h-6" />;
      case 'creative':
        return <PaintBrushIcon className="w-6 h-6" />;
      default:
        return <DocumentTextIcon className="w-6 h-6" />;
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId === selectedTemplate ? null : templateId);
  };

  const handleCreateTemplate = () => {
    if (newTemplateName.trim()) {
      // Créer un nouveau template personnalisé
      const newTemplate: Template = {
        id: `custom-${Date.now()}`,
        name: newTemplateName.trim(),
        description: 'Template personnalisé créé par l\'utilisateur',
        category: 'custom',
        styles: {
          fontFamily: 'Inter',
          fontSize: 12,
          lineHeight: 1.6,
          colors: {
            primary: '#2563eb',
            secondary: '#64748b',
            text: '#1e293b',
            background: '#ffffff',
          },
        },
        layout: {
          margins: { top: 20, right: 20, bottom: 20, left: 20 },
          pageSize: 'a4',
          orientation: 'portrait',
        },
        preview: '',
      };

      // Sauvegarder dans localStorage
      const userTemplates = JSON.parse(localStorage.getItem('user-templates') || '[]');
      userTemplates.push(newTemplate);
      localStorage.setItem('user-templates', JSON.stringify(userTemplates));

      // Invalider le cache TanStack Query
      window.location.reload(); // Simple rechargement pour l'instant

      setNewTemplateName('');
      setShowCreateForm(false);
    }
  };

  const containerStyle = {
    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
    border: `1px solid ${isDarkMode ? '#374151' : '#d1d5db'}`,
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
  };

  const titleStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: isDarkMode ? '#e5e7eb' : '#1f2937',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const templateCardStyle = (isSelected: boolean) => ({
    border: `2px solid ${isSelected ? '#2563eb' : isDarkMode ? '#374151' : '#e5e7eb'}`,
    borderRadius: '6px',
    padding: '12px',
    marginBottom: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: isSelected
      ? (isDarkMode ? '#1e3a8a' : '#dbeafe')
      : (isDarkMode ? '#374151' : '#f9fafb'),
    transform: isSelected ? 'scale(1.02)' : 'scale(1)',
  });

  if (isLoading) {
    return (
      <div style={containerStyle}>
        <div style={titleStyle}>
          <DocumentTextIcon />
          Templates
        </div>
        <div style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
          Chargement des templates...
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={titleStyle}>
        <DocumentTextIcon />
        Templates
        <span style={{
          fontSize: '12px',
          fontWeight: 'normal',
          marginLeft: '8px',
          color: isDarkMode ? '#9ca3af' : '#6b7280'
        }}>
          ({templates?.length || 0} disponibles)
        </span>
      </div>

      {/* Templates disponibles */}
      {templates?.map((template) => {
        const isSelected = template.id === selectedTemplate;

        return (
          <div
            key={template.id}
            style={templateCardStyle(isSelected)}
            onClick={() => handleTemplateSelect(template.id)}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.backgroundColor = isDarkMode ? '#4b5563' : '#f3f4f6';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.backgroundColor = isDarkMode ? '#374151' : '#f9fafb';
              }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{
                color: isSelected ? '#2563eb' : (isDarkMode ? '#9ca3af' : '#6b7280'),
                marginTop: '2px'
              }}>
                {getTemplateIcon(template.category)}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '4px'
                }}>
                  <span style={{
                    fontWeight: '600',
                    color: isDarkMode ? '#e5e7eb' : '#1f2937',
                    fontSize: '14px'
                  }}>
                    {template.name}
                  </span>

                  {isSelected && (
                    <CheckIcon
                      className="w-5 h-5"
                      style={{ color: '#2563eb' }}
                    />
                  )}
                </div>

                <p style={{
                  fontSize: '12px',
                  color: isDarkMode ? '#9ca3af' : '#6b7280',
                  margin: 0,
                  lineHeight: '1.4'
                }}>
                  {template.description}
                </p>

                <div style={{
                  display: 'flex',
                  gap: '8px',
                  marginTop: '6px',
                  fontSize: '10px',
                  color: isDarkMode ? '#6b7280' : '#9ca3af'
                }}>
                  <span style={{
                    padding: '2px 6px',
                    backgroundColor: isDarkMode ? '#374151' : '#e5e7eb',
                    borderRadius: '3px',
                    textTransform: 'capitalize'
                  }}>
                    {template.category}
                  </span>
                  <span style={{
                    padding: '2px 6px',
                    backgroundColor: isDarkMode ? '#374151' : '#e5e7eb',
                    borderRadius: '3px'
                  }}>
                    {template.layout.pageSize.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Formulaire de création de template */}
      {showCreateForm ? (
        <div style={{
          marginTop: '12px',
          padding: '12px',
          backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
          borderRadius: '6px',
        }}>
          <input
            type="text"
            value={newTemplateName}
            onChange={(e) => setNewTemplateName(e.target.value)}
            placeholder="Nom du nouveau template"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
              borderRadius: '4px',
              backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
              color: isDarkMode ? '#e5e7eb' : '#1f2937',
              fontSize: '14px',
              marginBottom: '8px',
            }}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleCreateTemplate}
              style={{
                padding: '6px 12px',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Créer
            </button>
            <button
              onClick={() => {
                setShowCreateForm(false);
                setNewTemplateName('');
              }}
              style={{
                padding: '6px 12px',
                backgroundColor: isDarkMode ? '#4b5563' : '#d1d5db',
                color: isDarkMode ? '#e5e7eb' : '#1f2937',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Annuler
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowCreateForm(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            width: '100%',
            padding: '8px 12px',
            marginTop: '8px',
            backgroundColor: 'transparent',
            border: `1px dashed ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
            borderRadius: '4px',
            color: isDarkMode ? '#9ca3af' : '#6b7280',
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = isDarkMode ? '#374151' : '#f9fafb';
            e.currentTarget.style.borderColor = '#2563eb';
            e.currentTarget.style.color = '#2563eb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = isDarkMode ? '#4b5563' : '#d1d5db';
            e.currentTarget.style.color = isDarkMode ? '#9ca3af' : '#6b7280';
          }}
        >
          <PlusIcon className="w-4 h-4" />
          Créer un template personnalisé
        </button>
      )}
    </div>
  );
};

export default TemplateSelector;