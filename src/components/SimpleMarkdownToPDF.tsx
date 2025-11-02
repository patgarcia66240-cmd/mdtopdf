import React, { useRef, useState } from 'react';
import { DocumentArrowDownIcon, RocketLaunchIcon, SunIcon, MoonIcon, SwatchIcon, ArrowDownTrayIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useAppStore } from '@/stores/appStore';
import MarkdownEditor from './MarkdownEditor';
import PDFOptionsPanel from './PDFOptionsPanel';
import PDFHeaderFooterPanel from './PDFHeaderFooterPanel';
import { useTemplates } from '@/hooks/api/usePDFQuery';

const SimpleMarkdownToPDF: React.FC = () => {
  const markdownRef = useRef<HTMLDivElement>(null);
  const [fileName, setFileName] = useState('document');
  const [showTemplates, setShowTemplates] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const { markdown, setMarkdown, pdfOptions, updatePDFOptions, theme, setTheme, getWordCount, getEstimatedPages } = useAppStore();
  const { data: templates } = useTemplates();

  const isDarkMode = theme === 'dark';

  const handleExportPDF = () => {
    if (!markdown.trim()) {
      alert('Veuillez entrer du contenu Markdown avant d\'exporter');
      return;
    }

    // Simulation de l'export PDF
    const link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(markdown);
    link.download = `${fileName}.md`;
    link.click();
  };

  const handleExportDOCX = () => {
    alert('Export DOCX - fonctionnalité en développement');
  };

  const handleExportHTML = () => {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${fileName}</title>
    <style>
        body { font-family: Arial; padding: 20px; line-height: 1.6; }
        h1 { color: #2563eb; }
        h2 { color: #64748b; }
    </style>
</head>
<body>
    ${markdown.replace(/\n/g, '<br>')}
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const containerStyle = {
    backgroundColor: isDarkMode ? '#181820' : '#f7f7f7',
    color: isDarkMode ? '#fff' : '#333',
    padding: '30px',
    minHeight: '100vh',
  };

  const headerStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '1.2',
    background: 'linear-gradient(135deg, #1357e8ff 0%,  #1452b5ff 75%, #0b41b6ff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    WebkitTextStroke: '1px #579eefff',
    textStroke: '2px #104582ff',
    margin: 0,
    alignSelf: 'center',
    position: 'relative' as const,
  };

  const buttonStyle = {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #1e40af 0%, #2e79f1ff 45%, #2563eb 75%,  #1e40af 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  };

  const toggleButtonStyle = {
    padding: '8px 16px',
    backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
    color: isDarkMode ? 'white' : '#333',
    border: '1px solid ' + (isDarkMode ? '#4b5563' : '#d1d5db'),
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const panelStyle = {
    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
    border: '1px solid ' + (isDarkMode ? '#374151' : '#d1d5db'),
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
  };

  const tabButtonStyle = (isActive: boolean) => ({
    flex: 1,
    padding: '8px 12px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: isActive ? (isDarkMode ? '#374151' : '#e5e7eb') : 'transparent',
    color: isDarkMode ? '#e5e7eb' : '#1f2937',
    fontSize: '12px',
    fontWeight: isActive ? '600' : '400',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
  });

  return (
    <div style={containerStyle} data-theme={theme}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        height: '60px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <RocketLaunchIcon
            style={{
              width: '40px',
              height: '40px',
              color: isDarkMode ? '#3b82f6' : '#2563eb',
              filter: 'drop-shadow(0 2px 4px rgba(37, 99, 235, 0.3)) saturate(1.2) brightness(1.1)'
            }}
          />
          <div>
            <h1 style={headerStyle}>Markdown to PDF Converter</h1>
            <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '4px' }}>
              {getWordCount()} mots • ~{getEstimatedPages()} pages
            </div>
          </div>
        </div>
        <button
          onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
          style={toggleButtonStyle}
        >
          {isDarkMode ? <SunIcon style={{ width: '18px', height: '18px' }} /> : <MoonIcon style={{ width: '18px', height: '18px' }} />}
          {isDarkMode ? 'Clair' : 'Sombre'}
        </button>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
        borderRadius: '8px',
        padding: '4px',
        marginBottom: '16px',
      }}>
        <button
          onClick={() => { setShowTemplates(false); setShowExport(false); }}
          style={tabButtonStyle(!showTemplates && !showExport)}
        >
          <Cog6ToothIcon style={{ width: '4 h-4' }} />
          Options
        </button>
        <button
          onClick={() => { setShowTemplates(true); setShowExport(false); }}
          style={tabButtonStyle(showTemplates)}
        >
          <SwatchIcon style={{ width: '4 h-4' }} />
          Templates ({templates?.length || 0})
        </button>
        <button
          onClick={() => { setShowTemplates(false); setShowExport(true); }}
          style={tabButtonStyle(showExport)}
        >
          <ArrowDownTrayIcon style={{ width: '4 h-4' }} />
          Export
        </button>
      </div>

      {/* Options Panel */}
      {!showTemplates && !showExport && (
        <>
          <PDFHeaderFooterPanel options={pdfOptions} onChange={updatePDFOptions} isDarkMode={isDarkMode} />
          <PDFOptionsPanel options={pdfOptions} onChange={updatePDFOptions} isDarkMode={isDarkMode} />

          <div style={panelStyle}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: isDarkMode ? '#e5e7eb' : '#1f2937' }}>
              Export PDF
            </h4>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Nom du fichier"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid ' + (isDarkMode ? '#3b3b52' : '#d1d5db'),
                backgroundColor: isDarkMode ? '#2a2a3d' : 'white',
                color: isDarkMode ? 'white' : '#333',
                marginBottom: '8px',
              }}
            />
            <button onClick={handleExportPDF} style={{ ...buttonStyle, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <DocumentArrowDownIcon style={{ width: '18px', height: '18px' }} />
              Exporter en PDF
            </button>
          </div>
        </>
      )}

      {/* Templates Panel */}
      {showTemplates && (
        <div style={panelStyle}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: isDarkMode ? '#e5e7eb' : '#1f2937' }}>
            Templates Disponibles
          </h3>
          {templates?.map((template) => (
            <div key={template.id} style={{
              border: '1px solid ' + (isDarkMode ? '#374151' : '#e5e7eb'),
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '8px',
              backgroundColor: isDarkMode ? '#374151' : '#f9fafb',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: isDarkMode ? '#e5e7eb' : '#1f2937' }}>
                    {template.name}
                  </div>
                  <div style={{ fontSize: '12px', color: isDarkMode ? '#9ca3af' : '#6b7280', marginTop: '2px' }}>
                    {template.description}
                  </div>
                </div>
                <div style={{
                  padding: '4px 8px',
                  backgroundColor: isDarkMode ? '#4b5563' : '#e5e7eb',
                  borderRadius: '4px',
                  fontSize: '11px',
                  textTransform: 'capitalize'
                }}>
                  {template.category}
                </div>
              </div>
            </div>
          ))}
          <button style={{
            width: '100%',
            padding: '8px 12px',
            marginTop: '8px',
            border: '1px dashed ' + (isDarkMode ? '#4b5563' : '#d1d5db'),
            borderRadius: '4px',
            backgroundColor: 'transparent',
            color: isDarkMode ? '#9ca3af' : '#6b7280',
            fontSize: '12px',
            cursor: 'pointer',
          }}>
            + Créer un template personnalisé (bientôt disponible)
          </button>
        </div>
      )}

      {/* Export Panel */}
      {showExport && (
        <div style={panelStyle}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: isDarkMode ? '#e5e7eb' : '#1f2937' }}>
            Export Multi-Formats
          </h3>

          <div style={{ fontSize: '12px', color: isDarkMode ? '#9ca3af' : '#6b7280', marginBottom: '16px' }}>
            <div>Mots: <strong>{getWordCount().toLocaleString()}</strong></div>
            <div>Pages estimées: <strong>{getEstimatedPages()}</strong></div>
            <div>Caractères: <strong>{markdown.length.toLocaleString()}</strong></div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: isDarkMode ? '#9ca3af' : '#6b7280', marginBottom: '4px' }}>
              Nom du fichier
            </label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="document"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid ' + (isDarkMode ? '#4b5563' : '#d1d5db'),
                borderRadius: '6px',
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                color: isDarkMode ? '#e5e7eb' : '#1f2937',
                fontSize: '14px',
                marginBottom: '8px',
              }}
            />
          </div>

          <div style={{ display: 'grid', gap: '8px' }}>
            <button onClick={handleExportPDF} style={buttonStyle}>
              📄 Exporter en PDF
            </button>
            <button onClick={handleExportDOCX} style={{ ...buttonStyle, background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' }}>
              📝 Exporter en Word (DOCX)
            </button>
            <button onClick={handleExportHTML} style={{ ...buttonStyle, background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)' }}>
              🌐 Exporter en HTML
            </button>
          </div>

          {!markdown.trim() && (
            <div style={{
              marginTop: '12px',
              padding: '12px',
              backgroundColor: isDarkMode ? '#451a03' : '#fffbeb',
              border: '1px solid ' + (isDarkMode ? '#78350f' : '#fed7aa'),
              borderRadius: '6px',
              fontSize: '12px',
              color: isDarkMode ? '#fbbf24' : '#92400e',
              textAlign: 'center',
            }}>
              ⚠️ Ajoutez du contenu Markdown pour activer l'export
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

export default SimpleMarkdownToPDF;