import React, { useState, useEffect } from 'react';
import { Template, TemplateStyles, TemplateLayout } from '@/types/app';
import { useAppStore } from '@/stores/appStore';
import {
  SwatchIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface TemplateEditorProps {
  template: Template | null;
  isDarkMode: boolean;
}

interface TabContentProps {
  children: React.ReactNode;
  isActive: boolean;
}

const TabContent: React.FC<TabContentProps> = ({ children, isActive }) => (
  <div style={{
    display: isActive ? 'block' : 'none',
    padding: '16px 0',
  }}>
    {children}
  </div>
);

const TemplateEditor: React.FC<TemplateEditorProps> = ({ template, isDarkMode }) => {
  const { updatePDFOptions } = useAppStore();
  const [activeTab, setActiveTab] = useState<'styles' | 'layout' | 'preview'>('styles');
  const [localTemplate, setLocalTemplate] = useState<Template | null>(template);

  useEffect(() => {
    setLocalTemplate(template);
  }, [template]);

  if (!template) {
    return (
      <div style={{
        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
        border: `1px solid ${isDarkMode ? '#374151' : '#d1d5db'}`,
        borderRadius: '8px',
        padding: '16px',
        textAlign: 'center',
        color: isDarkMode ? '#9ca3af' : '#6b7280',
      }}>
        <DocumentTextIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
        Sélectionnez un template pour l'éditer
      </div>
    );
  }

  const updateTemplateStyles = (updates: Partial<TemplateStyles>) => {
    if (!localTemplate) return;

    const updatedTemplate = {
      ...localTemplate,
      styles: { ...localTemplate.styles, ...updates }
    };
    setLocalTemplate(updatedTemplate);

    // Appliquer les changements au store
    updatePDFOptions({
      fontSize: updatedTemplate.styles.fontSize,
      fontFamily: updatedTemplate.styles.fontFamily,
    });
  };

  const updateTemplateLayout = (updates: Partial<TemplateLayout>) => {
    if (!localTemplate) return;

    const updatedTemplate = {
      ...localTemplate,
      layout: { ...localTemplate.layout, ...updates }
    };
    setLocalTemplate(updatedTemplate);

    // Appliquer les changements au store
    updatePDFOptions({
      format: updatedTemplate.layout.pageSize,
      orientation: updatedTemplate.layout.orientation,
      margins: updatedTemplate.layout.margins,
    });
  };

  const containerStyle = {
    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
    border: `1px solid ${isDarkMode ? '#374151' : '#d1d5db'}`,
    borderRadius: '8px',
    overflow: 'hidden',
  };

  const tabButtonStyle = (isActive: boolean) => ({
    flex: 1,
    padding: '12px',
    border: 'none',
    backgroundColor: isActive
      ? (isDarkMode ? '#374151' : '#f3f4f6')
      : 'transparent',
    color: isActive
      ? (isDarkMode ? '#e5e7eb' : '#1f2937')
      : (isDarkMode ? '#9ca3af' : '#6b7280'),
    fontSize: '14px',
    fontWeight: isActive ? '600' : '400',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    transition: 'all 0.2s ease',
  });

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: '500',
    color: isDarkMode ? '#9ca3af' : '#6b7280',
    marginBottom: '4px',
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
    borderRadius: '4px',
    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
    color: isDarkMode ? '#e5e7eb' : '#1f2937',
    fontSize: '14px',
  };

  const colorInputStyle = {
    width: '60px',
    height: '32px',
    border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
    borderRadius: '4px',
    cursor: 'pointer',
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '16px',
          fontWeight: '600',
          color: isDarkMode ? '#e5e7eb' : '#1f2937'
        }}>
          {template.name}
        </h3>
        <p style={{
          margin: '4px 0 0 0',
          fontSize: '12px',
          color: isDarkMode ? '#9ca3af' : '#6b7280'
        }}>
          {template.description}
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`
      }}>
        <button
          style={tabButtonStyle(activeTab === 'styles')}
          onClick={() => setActiveTab('styles')}
        >
          <SwatchIcon className="w-4 h-4" />
          Styles
        </button>
        <button
          style={tabButtonStyle(activeTab === 'layout')}
          onClick={() => setActiveTab('layout')}
        >
          <Cog6ToothIcon className="w-4 h-4" />
          Mise en page
        </button>
        <button
          style={tabButtonStyle(activeTab === 'preview')}
          onClick={() => setActiveTab('preview')}
        >
          <EyeIcon className="w-4 h-4" />
          Aperçu
        </button>
      </div>

      {/* Tab Content */}
      <div style={{ padding: '16px' }}>
        {/* Styles Tab */}
        <TabContent isActive={activeTab === 'styles'}>
          <div style={{ display: 'grid', gap: '16px' }}>
            {/* Typography */}
            <div>
              <h4 style={{
                margin: '0 0 12px 0',
                fontSize: '14px',
                fontWeight: '600',
                color: isDarkMode ? '#e5e7eb' : '#1f2937'
              }}>
                Typographie
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Police</label>
                  <select
                    value={localTemplate?.styles.fontFamily || 'Inter'}
                    onChange={(e) => updateTemplateStyles({ fontFamily: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="Inter">Inter</option>
                    <option value="Arial">Arial</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Courier New">Courier New</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Taille (px)</label>
                  <input
                    type="number"
                    min="8"
                    max="24"
                    value={localTemplate?.styles.fontSize || 12}
                    onChange={(e) => updateTemplateStyles({ fontSize: parseInt(e.target.value) })}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ marginTop: '12px' }}>
                <label style={labelStyle}>Interligne</label>
                <input
                  type="number"
                  min="1"
                  max="3"
                  step="0.1"
                  value={localTemplate?.styles.lineHeight || 1.6}
                  onChange={(e) => updateTemplateStyles({ lineHeight: parseFloat(e.target.value) })}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Colors */}
            <div>
              <h4 style={{
                margin: '0 0 12px 0',
                fontSize: '14px',
                fontWeight: '600',
                color: isDarkMode ? '#e5e7eb' : '#1f2937'
              }}>
                Couleurs
              </h4>

              <div style={{ display: 'grid', gap: '8px' }}>
                {Object.entries(localTemplate?.styles.colors || {}).map(([key, value]) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <label style={{
                      ...labelStyle,
                      margin: 0,
                      minWidth: '80px',
                      fontSize: '12px'
                    }}>
                      {key === 'primary' ? 'Primaire' :
                       key === 'secondary' ? 'Secondaire' :
                       key === 'text' ? 'Texte' : 'Fond'}
                    </label>
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => updateTemplateStyles({
                        colors: { ...localTemplate!.styles.colors, [key]: e.target.value }
                      })}
                      style={colorInputStyle}
                    />
                    <span style={{
                      fontSize: '12px',
                      color: isDarkMode ? '#9ca3af' : '#6b7280',
                      fontFamily: 'monospace'
                    }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabContent>

        {/* Layout Tab */}
        <TabContent isActive={activeTab === 'layout'}>
          <div style={{ display: 'grid', gap: '16px' }}>
            {/* Page Settings */}
            <div>
              <h4 style={{
                margin: '0 0 12px 0',
                fontSize: '14px',
                fontWeight: '600',
                color: isDarkMode ? '#e5e7eb' : '#1f2937'
              }}>
                Page
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Format</label>
                  <select
                    value={localTemplate?.layout.pageSize || 'a4'}
                    onChange={(e) => updateTemplateLayout({ pageSize: e.target.value as any })}
                    style={inputStyle}
                  >
                    <option value="a4">A4</option>
                    <option value="letter">Letter</option>
                    <option value="legal">Legal</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Orientation</label>
                  <select
                    value={localTemplate?.layout.orientation || 'portrait'}
                    onChange={(e) => updateTemplateLayout({ orientation: e.target.value as any })}
                    style={inputStyle}
                  >
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Paysage</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Margins */}
            <div>
              <h4 style={{
                margin: '0 0 12px 0',
                fontSize: '14px',
                fontWeight: '600',
                color: isDarkMode ? '#e5e7eb' : '#1f2937'
              }}>
                Marges (mm)
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Haut</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={localTemplate?.layout.margins.top || 20}
                    onChange={(e) => updateTemplateLayout({
                      margins: { ...localTemplate!.layout.margins, top: parseInt(e.target.value) }
                    })}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Bas</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={localTemplate?.layout.margins.bottom || 20}
                    onChange={(e) => updateTemplateLayout({
                      margins: { ...localTemplate!.layout.margins, bottom: parseInt(e.target.value) }
                    })}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Gauche</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={localTemplate?.layout.margins.left || 20}
                    onChange={(e) => updateTemplateLayout({
                      margins: { ...localTemplate!.layout.margins, left: parseInt(e.target.value) }
                    })}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Droite</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={localTemplate?.layout.margins.right || 20}
                    onChange={(e) => updateTemplateLayout({
                      margins: { ...localTemplate!.layout.margins, right: parseInt(e.target.value) }
                    })}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>
          </div>
        </TabContent>

        {/* Preview Tab */}
        <TabContent isActive={activeTab === 'preview'}>
          <div style={{
            backgroundColor: isDarkMode ? '#111827' : '#f9fafb',
            border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
            borderRadius: '4px',
            padding: '20px',
            minHeight: '200px',
            fontFamily: localTemplate?.styles.fontFamily || 'Inter',
            fontSize: `${localTemplate?.styles.fontSize || 12}px`,
            lineHeight: localTemplate?.styles.lineHeight || 1.6,
            color: localTemplate?.styles.colors.text || (isDarkMode ? '#e5e7eb' : '#1f2937'),
          }}>
            <h1 style={{
              margin: '0 0 16px 0',
              color: localTemplate?.styles.colors.primary || '#2563eb',
              fontSize: '1.5em',
            }}>
              Titre de l'aperçu
            </h1>

            <h2 style={{
              margin: '0 0 12px 0',
              color: localTemplate?.styles.colors.secondary || '#64748b',
              fontSize: '1.2em',
            }}>
              Sous-titre
            </h2>

            <p style={{ margin: '0 0 12px 0' }}>
              Ceci est un aperçu de votre template personnalisé. Les changements appliqués dans les onglets "Styles" et "Mise en page" seront reflétés ici.
            </p>

            <ul style={{ margin: '0', paddingLeft: '20px' }}>
              <li>Police : {localTemplate?.styles.fontFamily}</li>
              <li>Taille : {localTemplate?.styles.fontSize}px</li>
              <li>Interligne : {localTemplate?.styles.lineHeight}</li>
              <li>Format : {localTemplate?.layout.pageSize?.toUpperCase()}</li>
              <li>Orientation : {localTemplate?.layout.orientation === 'portrait' ? 'Portrait' : 'Paysage'}</li>
            </ul>
          </div>
        </TabContent>
      </div>
    </div>
  );
};

export default TemplateEditor;