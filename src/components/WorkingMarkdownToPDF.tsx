import React, { useState, useRef } from 'react';
import MarkdownEditor from './MarkdownEditor';
import { useAppStore } from '@/stores/appStore';

const WorkingMarkdownToPDF: React.FC = () => {
  const markdownRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'options' | 'templates' | 'export'>('options');
  const [fileName, setFileName] = useState('document');

  const { markdown, setMarkdown, pdfOptions, updatePDFOptions, theme, setTheme, getWordCount, getEstimatedPages } = useAppStore();

  const isDarkMode = theme === 'dark';

  const handleExportPDF = () => {
    if (!markdown.trim()) {
      alert('Veuillez entrer du contenu Markdown avant d\'exporter');
      return;
    }

    // Export basique
    const content = `# ${fileName}\n\n${markdown}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportHTML = () => {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${fileName}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
        h2 { color: #4b5563; margin-top: 30px; }
        p { margin: 15px 0; text-align: justify; }
        code { background: #f3f4f6; padding: 2px 6px; border-radius: 3px; font-family: monospace; }
        pre { background: #f3f4f6; padding: 15px; border-radius: 6px; overflow-x: auto; }
        blockquote { border-left: 4px solid #2563eb; padding-left: 15px; color: #6b7280; font-style: italic; }
    </style>
</head>
<body>
    ${markdown
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(.*)$/gm, '<p>$1</p>')
      .replace(/<p><\/p>/g, '')
      .replace(/<p>(<h[1-6]>)/g, '$1')
      .replace(/(<\/h[1-6]>)<\/p>/g, '$1')
    }
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const containerStyle = {
    backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
    color: isDarkMode ? '#ffffff' : '#333333',
    minHeight: '100vh',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  };

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  };

  const tabsStyle = {
    display: 'flex',
    backgroundColor: isDarkMode ? '#333333' : '#ffffff',
    borderRadius: '8px',
    padding: '4px',
    marginBottom: '20px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  };

  const tabButtonStyle = (isActive: boolean) => ({
    flex: 1,
    padding: '12px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: isActive ? (isDarkMode ? '#4a5568' : '#e5e7eb') : 'transparent',
    color: isDarkMode ? '#ffffff' : '#333333',
    fontSize: '14px',
    fontWeight: isActive ? 'bold' : 'normal',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  });

  const contentStyle = {
    backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  };

  const buttonStyle = {
    padding: '12px 24px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    width: '100%'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: `1px solid ${isDarkMode ? '#4a5568' : '#d1d5db'}`,
    borderRadius: '6px',
    backgroundColor: isDarkMode ? '#374151' : '#ffffff',
    color: isDarkMode ? '#ffffff' : '#333333',
    fontSize: '14px',
    marginBottom: '10px'
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={{
          margin: 0,
          color: '#2563eb',
          fontSize: '28px',
          fontWeight: 'bold'
        }}>
          📄 MDtoPDF Converter
        </h1>
        <p style={{
          margin: '10px 0 0 0',
          color: isDarkMode ? '#9ca3af' : '#6b7280',
          fontSize: '14px'
        }}>
          {getWordCount()} mots • ~{getEstimatedPages()} pages
        </p>
        <button
          onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
          style={{
            padding: '8px 16px',
            backgroundColor: isDarkMode ? '#4a5568' : '#e5e7eb',
            color: isDarkMode ? '#ffffff' : '#333333',
            border: 'none',
            borderRadius: '20px',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          {isDarkMode ? '☀️ Clair' : '🌙 Sombre'}
        </button>
      </div>

      {/* Navigation Tabs */}
      <div style={tabsStyle}>
        <button
          onClick={() => setActiveTab('options')}
          style={tabButtonStyle(activeTab === 'options')}
        >
          ⚙️ Options
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          style={tabButtonStyle(activeTab === 'templates')}
        >
          🎨 Templates
        </button>
        <button
          onClick={() => setActiveTab('export')}
          style={tabButtonStyle(activeTab === 'export')}
        >
          📤 Export
        </button>
      </div>

      {/* Content */}
      {activeTab === 'options' && (
        <div style={contentStyle}>
          <h3 style={{ marginTop: 0, color: isDarkMode ? '#ffffff' : '#333333' }}>
            Options PDF
          </h3>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
              Format de page:
            </label>
            <select
              value={pdfOptions.format}
              onChange={(e) => updatePDFOptions({ format: e.target.value as any })}
              style={inputStyle}
            >
              <option value="a4">A4</option>
              <option value="letter">Letter</option>
              <option value="legal">Legal</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
              Orientation:
            </label>
            <select
              value={pdfOptions.orientation}
              onChange={(e) => updatePDFOptions({ orientation: e.target.value as any })}
              style={inputStyle}
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Paysage</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
              Nom du fichier:
            </label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="document"
              style={inputStyle}
            />
          </div>

          <button onClick={handleExportPDF} style={buttonStyle}>
            📄 Exporter en PDF
          </button>
        </div>
      )}

      {activeTab === 'templates' && (
        <div style={contentStyle}>
          <h3 style={{ marginTop: 0, color: isDarkMode ? '#ffffff' : '#333333' }}>
            Templates Disponibles
          </h3>

          <div style={{
            border: '1px solid ' + (isDarkMode ? '#4a5568' : '#d1d5db'),
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '10px',
            backgroundColor: isDarkMode ? '#374151' : '#f9fafb'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#2563eb' }}>Modern</h4>
            <p style={{ margin: 0, color: isDarkMode ? '#d1d5db' : '#4b5563' }}>
              Template moderne et épuré, idéal pour les documents professionnels.
            </p>
            <div style={{ fontSize: '12px', color: isDarkMode ? '#9ca3af' : '#6b7280', marginTop: '10px' }}>
              Format: A4 • Police: Inter • Design: Épuré
            </div>
          </div>

          <div style={{
            border: '1px solid ' + (isDarkMode ? '#4a5568' : '#d1d5db'),
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '10px',
            backgroundColor: isDarkMode ? '#374151' : '#f9fafb'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#2563eb' }}>Academic</h4>
            <p style={{ margin: 0, color: isDarkMode ? '#d1d5db' : '#4b5563' }}>
              Template académique formel, parfait pour les rapports et publications.
            </p>
            <div style={{ fontSize: '12px', color: isDarkMode ? '#9ca3af' : '#6b7280', marginTop: '10px' }}>
              Format: A4 • Police: Times New Roman • Design: Formel
            </div>
          </div>

          <button style={{
            ...buttonStyle,
            backgroundColor: 'transparent',
            border: '2px dashed ' + (isDarkMode ? '#4a5568' : '#d1d5db'),
            color: isDarkMode ? '#9ca3af' : '#6b7280'
          }}>
            ➕ Créer un template personnalisé
          </button>
        </div>
      )}

      {activeTab === 'export' && (
        <div style={contentStyle}>
          <h3 style={{ marginTop: 0, color: isDarkMode ? '#ffffff' : '#333333' }}>
            Export Multi-Formats
          </h3>

          <div style={{
            backgroundColor: isDarkMode ? '#374151' : '#f9fafb',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: isDarkMode ? '#ffffff' : '#333333' }}>
              📊 Statistiques du document
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px' }}>
              <div>
                <span style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>Mots:</span>
                <strong style={{ color: isDarkMode ? '#ffffff' : '#333333', marginLeft: '5px' }}>
                  {getWordCount().toLocaleString()}
                </strong>
              </div>
              <div>
                <span style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>Pages:</span>
                <strong style={{ color: isDarkMode ? '#ffffff' : '#333333', marginLeft: '5px' }}>
                  {getEstimatedPages()}
                </strong>
              </div>
              <div>
                <span style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>Caractères:</span>
                <strong style={{ color: isDarkMode ? '#ffffff' : '#333333', marginLeft: '5px' }}>
                  {markdown.length.toLocaleString()}
                </strong>
              </div>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
              Nom du fichier:
            </label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="document"
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'grid', gap: '10px' }}>
            <button onClick={handleExportPDF} style={buttonStyle}>
              📄 Exporter en PDF
            </button>

            <button onClick={handleExportHTML} style={{ ...buttonStyle, backgroundColor: '#8b5cf6' }}>
              🌐 Exporter en HTML
            </button>

            <button
              onClick={() => alert('Export DOCX en développement')}
              style={{ ...buttonStyle, backgroundColor: '#10b981' }}
            >
              📝 Exporter en Word (DOCX)
            </button>

            <button
              onClick={() => alert('Export PNG en développement')}
              style={{ ...buttonStyle, backgroundColor: '#f59e0b' }}
            >
              🖼️ Exporter en Image (PNG)
            </button>
          </div>

          {!markdown.trim() && (
            <div style={{
              marginTop: '15px',
              padding: '15px',
              backgroundColor: isDarkMode ? '#451a03' : '#fef3c7',
              border: '1px solid ' + (isDarkMode ? '#fbbf24' : '#f59e0b'),
              borderRadius: '8px',
              fontSize: '14px',
              color: isDarkMode ? '#fbbf24' : '#92400e',
              textAlign: 'center'
            }}>
              ⚠️ Veuillez entrer du contenu Markdown dans l'éditeur ci-dessous pour activer l'export.
            </div>
          )}
        </div>
      )}

      {/* Editor */}
      <MarkdownEditor
        ref={markdownRef}
        value={markdown}
        onChange={setMarkdown}
        markdownRef={markdownRef}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default WorkingMarkdownToPDF;
