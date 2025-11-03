import  { useState } from 'react';
import InputWithButton from './components/ui/InputWithButton';
import TemplateCard from './components/ui/TemplateCard';
import {
  DocumentIcon,
  Cog6ToothIcon,
  SparklesIcon,
  DocumentArrowDownIcon,
  GlobeAltIcon,
  ChartBarIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';

function App() {
  const [activeTab, setActiveTab] = useState('options');
  const [content, setContent] = useState('# Bienvenue dans MDtoPDF\n\nCeci est un convertisseur Markdown vers PDF moderne.');
  const [isDark, setIsDark] = useState(false);
  const [documentTitle, setDocumentTitle] = useState('Mon Document');
  const [selectedTemplate, setSelectedTemplate] = useState('modern');

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
    color: isDark ? '#ffffff' : '#333333',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  };

  const tabContainer = {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    backgroundColor: isDark ? '#333' : '#fff',
    padding: '10px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  };

  const tabStyle = (isActive: boolean) => ({
    padding: '12px 20px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: isActive ? (isDark ? '#4a5568' : '#e5e7eb') : 'transparent',
    color: isDark ? '#fff' : '#333',
    fontSize: '16px',
    fontWeight: isActive ? 'bold' : 'normal',
    cursor: 'pointer',
    transition: 'all 0.2s'
  });

  const contentBox = {
    backgroundColor: isDark ? '#2a2a2a' : '#fff',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    minHeight: '400px'
  };

  const buttonStyle = {
    padding: '15px 30px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s'
  };

  const textareaStyle = {
    width: '100%',
    minHeight: '200px',
    padding: '15px',
    border: `1px solid ${isDark ? '#4a5568' : '#d1d5db'}`,
    borderRadius: '8px',
    backgroundColor: isDark ? '#374151' : '#fff',
    color: isDark ? '#fff' : '#333',
    fontSize: '14px',
    fontFamily: 'monospace',
    resize: 'vertical' as const,
    marginBottom: '20px'
  };

  const handleExportPDF = () => {
    alert('Export PDF - fonctionnalité simulée');
  };

  const handleTitleSubmit = () => {
    if (documentTitle.trim()) {
      alert(`Titre du document: ${documentTitle}`);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleTemplateCustomize = () => {
    alert('Personnalisation du template - fonctionnalité à venir');
  };

  const handleExportHTML = () => {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>${documentTitle}</title>
    <style>
      body { font-family: Arial; line-height: 1.6; padding: 20px; }
      h1 { color: #2563eb; }
    </style>
</head>
<body>
  ${content.replace(/\n/g, '<br>')}
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentTitle.toLowerCase().replace(/\s+/g, '-')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: 'center', color: '#2563eb', marginBottom: '30px' }}>
        <DocumentIcon style={{ width: '28px', height: '28px', verticalAlign: 'middle', marginRight: '8px' }} />
        MDtoPDF Converter
      </h1>

      {/* Theme Toggle */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <button
          onClick={() => setIsDark(!isDark)}
          style={{
            padding: '10px 20px',
            backgroundColor: isDark ? '#4a5568' : '#e5e7eb',
            border: 'none',
            borderRadius: '20px',
            color: isDark ? '#fff' : '#333',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            margin: '0 auto'
          }}
        >
          {isDark ? (
            <>
              <SunIcon style={{ width: '18px', height: '18px' }} />
              Mode Clair
            </>
          ) : (
            <>
              <MoonIcon style={{ width: '18px', height: '18px' }} />
              Mode Sombre
            </>
          )}
        </button>
      </div>

      {/* Navigation Tabs */}
      <div style={tabContainer}>
        <button
          onClick={() => setActiveTab('options')}
          style={tabStyle(activeTab === 'options')}
        >
          <Cog6ToothIcon style={{ width: '18px', height: '18px', marginRight: '6px', verticalAlign: 'middle' }} />
          Options
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          style={tabStyle(activeTab === 'templates')}
        >
          <SparklesIcon style={{ width: '18px', height: '18px', marginRight: '6px', verticalAlign: 'middle' }} />
          Templates
        </button>
        <button
          onClick={() => setActiveTab('export')}
          style={tabStyle(activeTab === 'export')}
        >
          <GlobeAltIcon style={{ width: '18px', height: '18px', marginRight: '6px', verticalAlign: 'middle' }} />
          Export
        </button>
      </div>

      {/* Content */}
      <div style={contentBox}>
        {activeTab === 'options' && (
          <div>
            <h2 style={{ color: isDark ? '#fff' : '#333', marginTop: 0 }}>Options PDF</h2>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '10px', color: isDark ? '#9ca3af' : '#6b7280', fontWeight: '500' }}>
                Nom du document:
              </label>
              <InputWithButton
                value={documentTitle}
                onChange={setDocumentTitle}
                onButtonClick={handleTitleSubmit}
                placeholder="Entrez votre titre"
                buttonText="Continuer"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: isDark ? '#9ca3af' : '#6b7280' }}>
                Format de page:
              </label>
              <select style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                backgroundColor: isDark ? '#374151' : '#fff',
                color: isDark ? '#fff' : '#333',
                border: `1px solid ${isDark ? '#4a5568' : '#d1d5db'}`
              }}>
                <option value="a4">A4</option>
                <option value="letter">Letter</option>
                <option value="legal">Legal</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: isDark ? '#9ca3af' : '#6b7280' }}>
                Orientation:
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 16px',
                  backgroundColor: isDark ? '#374151' : '#f3f4f6',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: `1px solid ${isDark ? '#4a5568' : '#d1d5db'}`
                }}>
                  <input type="radio" name="orientation" value="portrait" defaultChecked style={{ marginRight: '8px' }} />
                  Portrait
                </label>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 16px',
                  backgroundColor: isDark ? '#374151' : '#f3f4f6',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: `1px solid ${isDark ? '#4a5568' : '#d1d5db'}`
                }}>
                  <input type="radio" name="orientation" value="landscape" style={{ marginRight: '8px' }} />
                  Paysage
                </label>
              </div>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '12px', color: isDark ? '#9ca3af' : '#6b7280', fontWeight: '500' }}>
                Choisissez un template:
              </label>

              <TemplateCard
                title="Moderne"
                description="Template moderne et épuré avec des couleurs douces"
                previewColors={['#3b82f6', '#8b5cf6', '#ec4899']}
                isPro={false}
                isSelected={selectedTemplate === 'modern'}
                onSelect={() => handleTemplateSelect('modern')}
                onCustomize={handleTemplateCustomize}
              />

              <TemplateCard
                title="Académique"
                description="Template formel pour documents académiques"
                previewColors={['#1e293b', '#475569', '#64748b']}
                isPro={true}
                isSelected={selectedTemplate === 'academic'}
                onSelect={() => handleTemplateSelect('academic')}
                onCustomize={handleTemplateCustomize}
              />

              <TemplateCard
                title="Créatif"
                description="Template coloré et dynamique pour présentations"
                previewColors={['#f59e0b', '#ef4444', '#10b981']}
                isPro={false}
                isSelected={selectedTemplate === 'creative'}
                onSelect={() => handleTemplateSelect('creative')}
                onCustomize={handleTemplateCustomize}
              />
            </div>

            <button onClick={handleExportPDF} style={buttonStyle}>
              <DocumentArrowDownIcon style={{ width: '18px', height: '18px', marginRight: '8px', verticalAlign: 'middle' }} />
              Exporter en PDF
            </button>
          </div>
        )}

        {activeTab === 'templates' && (
          <div>
            <h2 style={{ color: isDark ? '#fff' : '#333', marginTop: 0 }}>Templates</h2>
            <div style={{
              border: '1px solid ' + (isDark ? '#4a5568' : '#d1d5db'),
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '15px',
              backgroundColor: isDark ? '#374151' : '#f9fafb'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#2563eb' }}>
                <SparklesIcon style={{ width: '20px', height: '20px', marginRight: '8px', verticalAlign: 'middle' }} />
                Modern
              </h3>
              <p style={{ margin: 0, color: isDark ? '#d1d5db' : '#4b5563' }}>
                Template moderne et épuré
              </p>
            </div>
            <div style={{
              border: '1px solid ' + (isDark ? '#4a5568' : '#d1d5db'),
              borderRadius: '8px',
              padding: '15px',
              backgroundColor: isDark ? '#374151' : '#f9fafb'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#2563eb' }}>
                <DocumentIcon style={{ width: '20px', height: '20px', marginRight: '8px', verticalAlign: 'middle' }} />
                Academic
              </h3>
              <p style={{ margin: 0, color: isDark ? '#d1d5db' : '#4b5563' }}>
                Template académique formel
              </p>
            </div>
          </div>
        )}

        {activeTab === 'export' && (
          <div>
            <h2 style={{ color: isDark ? '#fff' : '#333', marginTop: 0 }}>Export Multi-Formats</h2>
            <p style={{ color: isDark ? '#9ca3af' : '#6b7280', marginBottom: '20px' }}>
              Choisissez le format d'export pour votre document Markdown.
            </p>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: isDark ? '#9ca3af' : '#6b7280' }}>
                Contenu Markdown:
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={textareaStyle}
                placeholder="Entrez votre contenu Markdown ici..."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button onClick={handleExportPDF} style={buttonStyle}>
                <DocumentArrowDownIcon style={{ width: '18px', height: '18px', marginRight: '8px', verticalAlign: 'middle' }} />
                Export PDF
              </button>
              <button onClick={handleExportHTML} style={{ ...buttonStyle, backgroundColor: '#8b5cf6' }}>
                <GlobeAltIcon style={{ width: '18px', height: '18px', marginRight: '8px', verticalAlign: 'middle' }} />
                Export HTML
              </button>
            </div>

            <div style={{
              marginTop: '20px',
              padding: '15px',
              backgroundColor: isDark ? '#374151' : '#f3f4f6',
              borderRadius: '8px',
              textAlign: 'center',
              fontSize: '14px',
              color: isDark ? '#d1d5db' : '#4b5563'
            }}>
              <ChartBarIcon style={{ width: '16px', height: '16px', marginRight: '6px', verticalAlign: 'middle' }} />
              <strong>Statistiques:</strong> {content.split(/\s+/).filter(word => word.length > 0).length} mots
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
