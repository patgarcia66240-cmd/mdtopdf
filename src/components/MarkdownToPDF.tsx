import React, { useRef, useState } from 'react';
import {
  DocumentArrowDownIcon,
  RocketLaunchIcon,
  SunIcon,
  MoonIcon,
  Cog6ToothIcon,
  SwatchIcon,
  ArrowDownTrayIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { usePDFGeneration } from '@/hooks/api/usePDFQuery';
import { useAppStore } from '@/stores/appStore';
import MarkdownEditor from './MarkdownEditor';
import PDFOptionsPanel from './PDFOptionsPanel';
import PDFHeaderFooterPanel from './PDFHeaderFooterPanel';
import TemplateSelector from './templates/TemplateSelector';
import TemplateEditor from './templates/TemplateEditor';
import ExportPanel from './export/ExportPanel';
import { useTemplates } from '@/hooks/api/usePDFQuery';

const MarkdownToPDF: React.FC = () => {
  const markdownRef = useRef<HTMLDivElement>(null);
  const { generatePDF, isGenerating } = usePDFGeneration();
  const { data: templates } = useTemplates();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'templates' | 'export'>('editor');

  const {
    markdown,
    setMarkdown,
    pdfOptions,
    updatePDFOptions,
    selectedTemplate,
    setSelectedTemplate,
    theme,
    setTheme,
    getWordCount,
    getEstimatedPages,
    sidebarCollapsed,
    toggleSidebar
  } = useAppStore();

  // Obtenir le template sélectionné
  const selectedTemplateData = templates?.find(t => t.id === selectedTemplate);

  const [fileName, setFileName] = React.useState('candivoc-report');

  const isDarkMode = theme === 'dark';

  // Styles dynamiques selon le mode
  const containerStyle = isDarkMode ? {
    backgroundColor: '#181820',
    color: '#fff',
    padding: '30px',
    minHeight: '100vh',
  } : {
    backgroundColor: '#f7f7f7',
    color: '#333',
    padding: '30px',
    minHeight: '100vh',
  };

  const headerStyle = isDarkMode ? {
    fontSize: '2rem',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '1.2',
    background: 'linear-gradient(135deg, #1357e8ff 0%,  #1452b5ff 75%, #0b41b6ff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    WebkitTextStroke: '1px #579eefff',
    WebkitTextStrokeColor: '#579eefff',
    textStroke: '2px #104582ff',
    margin: 0,
    alignSelf: 'center',
    position: 'relative' as const,
  } : {
    fontSize: '2rem',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '1.2',
    background: 'linear-gradient(135deg, #2563eb 0%,  #3b82f6 75%, #2563eb 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    WebkitTextStroke: '2px #4999f5ff',
    WebkitTextStrokeColor: '#4999f5ff',
    textStroke: '2px #4999f5ff',
    margin: 0,
    alignSelf: 'center',
    position: 'relative' as const,
  };

  const inputStyle = isDarkMode ? {
    flex: 1,
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #3b3b52',
    backgroundColor: '#2a2a3d',
    color: 'white',
  } : {
    flex: 1,
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #d1d5db',
    backgroundColor: 'white',
    color: '#333',
  };

  const buttonStyle = isDarkMode ? {
    padding: '12px 24px',
    background: isGenerating
      ? 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
      : 'linear-gradient(135deg, #1e40af 0%, #2e79f1ff 45%, #2563eb 75%,  #1e40af 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: isGenerating ? 'not-allowed' : 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    transform: isGenerating ? 'none' : 'translateY(0)',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  } : {
    padding: '12px 24px',
    background: isGenerating
      ? 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)'
      : 'linear-gradient(135deg, #dbeafe 0%, #93c5fd 20%, #60a5fa 40%, #3b82f6 60%, #2563eb 80%, #1d4ed8 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: isGenerating ? 'not-allowed' : 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    transform: isGenerating ? 'none' : 'translateY(0)',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.4)',
  };

  const toggleButtonStyle = isDarkMode ? {
    padding: '8px 16px',
    backgroundColor: '#374151',
    color: 'white',
    border: '1px solid #4b5563',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  } : {
    padding: '8px 16px',
    backgroundColor: '#f3f4f6',
    color: '#333',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const handleExportPDF = () => {
    if (!markdown.trim()) {
      alert('Veuillez entrer du contenu Markdown avant d\'exporter');
      return;
    }

    generatePDF({ markdown, options: pdfOptions });
  };

  const renderSidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
        borderRadius: '8px',
        padding: '4px',
      }}>
        <button
          onClick={() => setActiveTab('editor')}
          style={{
            flex: 1,
            padding: '8px',
            border: 'none',
            borderRadius: '6px',
            backgroundColor: activeTab === 'editor'
              ? (isDarkMode ? '#1f2937' : '#ffffff')
              : 'transparent',
            color: isDarkMode ? '#e5e7eb' : '#1f2937',
            fontSize: '12px',
            fontWeight: activeTab === 'editor' ? '600' : '400',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
          }}
        >
          <Cog6ToothIcon className="w-4 h-4" />
          Options
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          style={{
            flex: 1,
            padding: '8px',
            border: 'none',
            borderRadius: '6px',
            backgroundColor: activeTab === 'templates'
              ? (isDarkMode ? '#1f2937' : '#ffffff')
              : 'transparent',
            color: isDarkMode ? '#e5e7eb' : '#1f2937',
            fontSize: '12px',
            fontWeight: activeTab === 'templates' ? '600' : '400',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
          }}
        >
          <SwatchIcon className="w-4 h-4" />
          Templates
        </button>
        <button
          onClick={() => setActiveTab('export')}
          style={{
            flex: 1,
            padding: '8px',
            border: 'none',
            borderRadius: '6px',
            backgroundColor: activeTab === 'export'
              ? (isDarkMode ? '#1f2937' : '#ffffff')
              : 'transparent',
            color: isDarkMode ? '#e5e7eb' : '#1f2937',
            fontSize: '12px',
            fontWeight: activeTab === 'export' ? '600' : '400',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
          }}
        >
          <ArrowDownTrayIcon className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Contenu basé sur l'onglet actif */}
      {activeTab === 'editor' && (
        <>
          {/* Panneau PDF Header/Footer */}
          <PDFHeaderFooterPanel
            options={pdfOptions}
            onChange={updatePDFOptions}
            isDarkMode={isDarkMode}
          />

          {/* Panneau d'options PDF */}
          <PDFOptionsPanel
            options={pdfOptions}
            onChange={updatePDFOptions}
            isDarkMode={isDarkMode}
          />

          {/* Export PDF rapide */}
          <div style={containerStyle}>
            <h4 style={{
              margin: '0 0 12px 0',
              fontSize: '14px',
              fontWeight: '600',
              color: isDarkMode ? '#e5e7eb' : '#1f2937'
            }}>
              Export PDF rapide
            </h4>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Nom du fichier"
              style={inputStyle}
            />
            <button
              onClick={handleExportPDF}
              disabled={isGenerating}
              style={{
                ...buttonStyle,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '8px'
              }}
            >
              <DocumentArrowDownIcon style={{ width: '18px', height: '18px' }} />
              {isGenerating ? 'Conversion en cours...' : 'Exporter en PDF'}
            </button>
          </div>
        </>
      )}

      {activeTab === 'templates' && (
        <>
          <TemplateSelector isDarkMode={isDarkMode} />
          {selectedTemplateData && (
            <TemplateEditor template={selectedTemplateData} isDarkMode={isDarkMode} />
          )}
        </>
      )}

      {activeTab === 'export' && (
        <ExportPanel isDarkMode={isDarkMode} />
      )}
    </div>
  );

  return (
    <div style={containerStyle} data-theme={theme}>
      {/* Header Mobile */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        padding: '12px 0',
      }}>
        <button
          onClick={() => setShowMobileSidebar(!showMobileSidebar)}
          style={{
            padding: '8px',
            backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
            border: 'none',
            borderRadius: '6px',
            color: isDarkMode ? '#e5e7eb' : '#1f2937',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {showMobileSidebar ? (
            <XMarkIcon className="w-5 h-5" />
          ) : (
            <Bars3Icon className="w-5 h-5" />
          )}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RocketLaunchIcon
            style={{
              width: '32px',
              height: '32px',
              color: isDarkMode ? '#3b82f6' : '#2563eb',
              filter: `
                drop-shadow(0 2px 4px rgba(37, 99, 235, 0.3))
                hue-rotate(${isDarkMode ? '0deg' : '-10deg'})
                saturate(1.2)
                brightness(1.1)
              `
            }}
          />
          <div style={{ textAlign: 'center' }}>
            <h1 style={{
              ...headerStyle,
              fontSize: '1.5rem',
              margin: 0,
            }}>MDtoPDF</h1>
            <div style={{ fontSize: '11px', opacity: 0.7 }}>
              {getWordCount()} mots • ~{getEstimatedPages()} pages
            </div>
          </div>
        </div>

        <button
          onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
          style={toggleButtonStyle}
          title={isDarkMode ? "Passer en mode clair" : "Passer en mode sombre"}
        >
          {isDarkMode ? (
            <SunIcon style={{ width: '18px', height: '18px' }} />
          ) : (
            <MoonIcon style={{ width: '18px', height: '18px' }} />
          )}
        </button>
      </div>

      {/* Layout Principal */}
      <div style={{ display: 'flex', gap: '16px', minHeight: 'calc(100vh - 120px)' }}>
        {/* Sidebar - Desktop */}
        <div style={{
          width: sidebarCollapsed ? '60px' : '320px',
          display: showMobileSidebar ? 'block' : (window.innerWidth >= 768 ? 'block' : 'none'),
          transition: 'width 0.3s ease',
          flexShrink: 0,
        }}>
          {!sidebarCollapsed && renderSidebarContent()}
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Toggle Sidebar Desktop */}
          <button
            onClick={toggleSidebar}
            style={{
              position: 'absolute',
              left: sidebarCollapsed ? '70px' : '330px',
              top: '90px',
              transform: 'translateX(-50%)',
              padding: '6px',
              backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
              border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
              borderRadius: '50%',
              color: isDarkMode ? '#e5e7eb' : '#1f2937',
              cursor: 'pointer',
              zIndex: 10,
              display: window.innerWidth >= 768 ? 'flex' : 'none',
            }}
            title={sidebarCollapsed ? "Afficher la barre latérale" : "Masquer la barre latérale"}
          >
            {sidebarCollapsed ? (
              <SwatchIcon className="w-4 h-4" />
            ) : (
              <XMarkIcon className="w-4 h-4" />
            )}
          </button>

          {/* Éditeur Markdown */}
          <MarkdownEditor
            ref={markdownRef}
            value={markdown}
            onChange={setMarkdown}
            markdownRef={markdownRef}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>

      {/* Overlay Mobile */}
      {showMobileSidebar && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 20,
            display: window.innerWidth < 768 ? 'block' : 'none',
          }}
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* Sidebar Mobile */}
      {showMobileSidebar && window.innerWidth < 768 && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            width: '280px',
            backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
            zIndex: 30,
            overflowY: 'auto',
            padding: '16px',
            boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: '600',
              color: isDarkMode ? '#e5e7eb' : '#1f2937',
              marginBottom: '8px'
            }}>
              Panneau de contrôle
            </h3>
          </div>
          {renderSidebarContent()}
        </div>
      )}
    </div>
  );
};

export default MarkdownToPDF;